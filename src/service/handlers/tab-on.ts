/*
 * Copyright (c) 2019-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ApiComponentDetailsDTOV2ToJSON } from '@sonatype/nexus-iq-api-client'
import { ComponentStateUtil } from '../../common/component/component-state-util'
import { ComponentStateType, ThisBrowser } from '../../common/constants'
import { TabDataStatus } from '../../common/data/types'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType } from '../../common/message/constants'
import { MessageResponsePageComponentIdentitiesParsed } from '../../common/message/types'
import { DefaultRepoRegistry } from '../../common/repo-registry'
import { ActiveInfo, ChangeInfo, TabType } from '../../common/types'
import { BaseServiceWorkerHandler } from './base'
import { IqMessageHelper } from './helpers/iq'
import { NotificationHelper } from './helpers/notification'
import { BaseRepo } from '../../common/repo-type/base'

export class ServiceWorkerTabOnHandler extends BaseServiceWorkerHandler {
    public handleOnActivated = (activeInfo: ActiveInfo) => {
        logger.logServiceWorker(`ServiceWorkerTabOnHandler.handleOnActivated: `, LogLevel.DEBUG, activeInfo)

        ThisBrowser.tabs.get(activeInfo.tabId, (tab: TabType) => {
            if (
                !ThisBrowser.runtime.lastError &&
                tab.url !== undefined &&
                tab.status == chrome.tabs.TabStatus.COMPLETE
            ) {
                this.enableDisableExtensionForUrl(tab.url, activeInfo.tabId)
            }
        })
    }

    public handleOnUpdated = (tabId: number, changeInfo: ChangeInfo, tab: TabType) => {
        logger.logServiceWorker(`ServiceWorkerTabOnHandler.handleOnUpdated: `, LogLevel.DEBUG, tabId, changeInfo, tab)

        if (changeInfo.status == 'complete' && tab.active && tab.url !== undefined) {
            this.enableDisableExtensionForUrl(tab.url, tabId)
        }
    }

    protected enableDisableExtensionForUrl = (url: string, tabId: number): void => {
        const repoType = DefaultRepoRegistry.getRepoForUrl(url)

        if (repoType === undefined) {
            this.handleUnsupportedUrl(url, tabId)
            return
        }

        logger.logServiceWorker('enableDisableExtensionForUrl', LogLevel.DEBUG, url, tabId, repoType)
        this.processTabForRepo(url, tabId, repoType)
    }

    private handleUnsupportedUrl(url: string, tabId: number): void {
        logger.logServiceWorker('Disabling for current Tab', LogLevel.INFO, tabId)
        this.disableExtensionForTab(url, tabId)
    }

    private async processTabForRepo(url: string, tabId: number, repoType: BaseRepo): Promise<void> {
        try {
            const msgResponse = await ThisBrowser.tabs.sendMessage(tabId, {
                messageType: MessageRequestType.REQUEST_COMPONENT_IDENTITIES_FROM_PAGE,
                externalReopsitoryManagers: this.extensionConfigurationState.getExtensionConfig().externalRepositoryManagers,
                repoTypeId: repoType.id,
            })

            logger.logServiceWorker('Component Identified from Content Script', LogLevel.DEBUG, msgResponse)

            const componentIdentities = (msgResponse as MessageResponsePageComponentIdentitiesParsed)
                .componentIdentities

            if (componentIdentities.length === 0) {
                await this.handleNoComponents(tabId, repoType.id)
            } else {
                await this.handleComponentsFound(tabId, repoType.id, componentIdentities)
            }
        } catch (error) {
            logger.logServiceWorker('Error processing tab for repo', LogLevel.ERROR, error)
        }
    }

    private async handleNoComponents(tabId: number, repoTypeId: string): Promise<void> {
        const newExtensionTabsData = this.extensionDataState.tabsData

        newExtensionTabsData.tabs[tabId] = {
            tabId,
            components: {},
            status: TabDataStatus.NO_COMPONENTS,
            repoTypeId,
        }

        await this.updateExtensionTabData(newExtensionTabsData)
    }

    private async handleComponentsFound(tabId: number, repoTypeId: string, componentIdentities: any[]): Promise<void> {
        const newExtensionTabsData = this.extensionDataState.tabsData

        // Set initial evaluating state
        newExtensionTabsData.tabs[tabId] = {
            tabId,
            components: {},
            status: TabDataStatus.EVALUATING,
            repoTypeId,
        }

        await this.updateExtensionTabData(newExtensionTabsData)

        // Evaluate components
        const iqMessageHelper = new IqMessageHelper(this.extensionConfigurationState)
        const evaluationResults = await iqMessageHelper.evaluateComponents(componentIdentities)

        this.processEvaluationResults(tabId, newExtensionTabsData, evaluationResults)

        await this.updateExtensionTabData(newExtensionTabsData)
        await this.fetchRemediationDetailsAndNotify(tabId, newExtensionTabsData, evaluationResults, iqMessageHelper)
    }

    private processEvaluationResults(tabId: number, tabsData: any, evaluationResults: any): void {
        evaluationResults.results?.forEach((result: any) => {
            if (result.component?.packageUrl !== undefined) {
                tabsData.tabs[tabId].components[result.component.packageUrl] = {
                    componentDetails: ApiComponentDetailsDTOV2ToJSON(result),
                    componentEvaluationDateTime: evaluationResults.evaluationDate?.toISOString() || '',
                    allComponentVersions: [],
                    componentLegalDegtails: [], // Note: keeping original typo for compatibility
                    componentRemediationDetails: undefined,
                }
            }
        })

        tabsData.tabs[tabId].status = TabDataStatus.COMPLETE
        this.extensionDataState.tabsData = tabsData
    }

    private async fetchRemediationDetailsAndNotify(
        tabId: number,
        tabsData: any,
        evaluationResults: any,
        iqMessageHelper: IqMessageHelper
    ): Promise<void> {
        const remediationPromises =
            evaluationResults.results?.map((compEvalResult: any) =>
                this.fetchSingleRemediationDetail(tabId, tabsData, compEvalResult, iqMessageHelper)
            ) || []

        await Promise.all(remediationPromises)

        logger.logServiceWorker('All Component Remediation Calls in', LogLevel.DEBUG)

        await this.updateExtensionTabData(tabsData)
        await this.sendCompletionNotification(tabId)
    }

    private async fetchSingleRemediationDetail(
        tabId: number,
        tabsData: any,
        compEvalResult: any,
        iqMessageHelper: IqMessageHelper
    ): Promise<void> {
        const packageUrl = compEvalResult.component?.packageUrl as string

        try {
            const remediationResponse = await iqMessageHelper.getComponentRemediationDetails(packageUrl)
            tabsData.tabs[tabId].components[packageUrl].componentRemediationDetails = remediationResponse.remediation
        } catch (error) {
            logger.logServiceWorker('Error fetching remediation details', LogLevel.ERROR, packageUrl, error)
        }
    }

    private async sendCompletionNotification(tabId: number): Promise<void> {
        const notificationHelper = new NotificationHelper(this.extensionConfigurationState, this.extensionDataState)

        await notificationHelper.notifyOnComponentEvaluationComplete(tabId)
    }

    private readonly disableExtensionForTab = (url: string, tabId: number): void => {
        logger.logServiceWorker(
            `Disabling Sonatype Browser Extension for ${url} - Not a supported Registry.`,
            LogLevel.DEBUG,
            tabId
        )
        // propogateCurrentComponentState(tabId, ComponentState.CLEAR)

        // Not required in Side Panel mode
        ThisBrowser.action.disable(tabId, () => {
            logger.logServiceWorker(`Sonatype Extension DISABLED for ${url}`, LogLevel.INFO)
            ThisBrowser.action.setIcon({
                tabId: tabId,
                path: ComponentStateUtil.getIconForComponentState(ComponentStateType.UNKNOWN),
            })
        })
    }
}
