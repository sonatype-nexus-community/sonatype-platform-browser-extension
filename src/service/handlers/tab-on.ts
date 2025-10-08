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
import {
    ApiComponentDetailsDTOV2,
    ApiComponentDetailsDTOV2ToJSON,
    ApiComponentEvaluationResultDTOV2,
} from '@sonatype/nexus-iq-api-client'
import { PackageURL } from 'packageurl-js'
import { ANALYTICS_EVENT_TYPES } from '../../common/analytics/analytics'
import { ComponentStateUtil } from '../../common/component/component-state-util'
import { MATCH_STATE_EXACT } from '../../common/component/constants'
import { ComponentStateType, ThisBrowser } from '../../common/constants'
import { ExtensionTabsData, TabDataStatus } from '../../common/data/types'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType, MessageResponseStatus } from '../../common/message/constants'
import { lastRuntimeError } from '../../common/message/helpers'
import { MessageResponsePageComponentIdentitiesParsed } from '../../common/message/types'
import { DefaultRepoRegistry } from '../../common/repo-registry'
import { BaseRepo } from '../../common/repo-type/base'
import { ActiveInfo, ChangeInfo, RemoveInfo, TabType } from '../../common/types'
import { BaseServiceWorkerHandler } from './base'
import { IqMessageHelper } from './helpers/iq'
import { NotificationHelper } from './helpers/notification'

export class ServiceWorkerTabOnHandler extends BaseServiceWorkerHandler {
    private inFlightEvaluations = new Map<number, { url: string; timestamp: number }>()

    public handleOnActivated = (activeInfo: ActiveInfo) => {
        logger.logServiceWorker(`ServiceWorkerTabOnHandler.handleOnActivated: `, LogLevel.DEBUG, activeInfo)

        ThisBrowser.tabs.get(activeInfo.tabId).then((tab: TabType) => {
            const lastError = lastRuntimeError()
            if (lastError) {
                logger.logReact(
                    'Runtime Error in ServiceWorkerTabOnHandler.handleOnActivated',
                    LogLevel.WARN,
                    lastError
                )
            }

            if (lastError === undefined && tab.url !== undefined && tab.status == chrome.tabs.TabStatus.COMPLETE) {
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

    public handleOnRemoved = (tabId: number, removeInfo: RemoveInfo) => {
        logger.logServiceWorker(`ServiceWorkerTabOnHandler.handleOnRemoved: `, LogLevel.DEBUG, tabId, removeInfo)
        const newExtensionTabsData = this.extensionDataState.tabsData
        delete newExtensionTabsData.tabs[tabId]
        return this.updateExtensionTabData(newExtensionTabsData)
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
        const existing = this.inFlightEvaluations.get(tabId)
    if (existing?.url === url) {
        logger.logServiceWorker('Evaluation already in progress', LogLevel.DEBUG, tabId, url)
        return
    }
    this.inFlightEvaluations.set(tabId, { url, timestamp: Date.now() })       
        try {
            const msgResponse = await ThisBrowser.tabs
                .sendMessage(tabId, {
                    messageType: MessageRequestType.REQUEST_COMPONENT_IDENTITIES_FROM_PAGE,
                    externalReopsitoryManagers:
                        this.extensionConfigurationState.getExtensionConfig().externalRepositoryManagers,
                    repoTypeId: repoType.id,
                })
                .then((msgResponse) => {
                    const lastError = lastRuntimeError()
                    if (lastError) {
                        logger.logReact(
                            'Runtime Error in ServiceWorkerTabOnHandler.processTabForRepo',
                            LogLevel.WARN,
                            lastError
                        )
                    }

                    return msgResponse
                })

            if ((msgResponse as MessageResponsePageComponentIdentitiesParsed).status != MessageResponseStatus.SUCCESS) {
                await this.handleTabError(tabId, repoType.id)
                return
            }

            logger.logServiceWorker('Component(s) Identified from Content Script', LogLevel.DEBUG, msgResponse)

            const componentIdentities = (msgResponse as MessageResponsePageComponentIdentitiesParsed)
                .componentIdentities

            if (componentIdentities.length === 0) {
                await this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.COMPONENT_IDENTITY_CALCULATED_NONE, {
                    page_url: url,
                    repo_type_id: repoType.id,
                    repo_type_url: repoType.baseUrl,
                })
                await this.handleNoComponents(tabId, repoType.id)
            } else {
                const eventPromises = componentIdentities.map((p) => {
                    const purl = PackageURL.fromString(p)
                    return this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.COMPONENT_IDENTITY_CALCULATED, {
                        page_url: url,
                        repo_type_id: repoType.id,
                        repo_type_url: repoType.baseUrl,
                        purl_type: purl.type,
                        purl_namespace: purl.namespace,
                        purl_name: purl.name,
                        purl_version: purl.version,
                        purl_subpath: purl.subpath,
                        purl: purl.toString(),
                    })
                })
                eventPromises.push(
                    this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.COMPONENT_IDENTITIES_CALCULATED, {
                        page_url: url,
                        repo_type_id: repoType.id,
                        repo_type_url: repoType.baseUrl,
                        component_count: componentIdentities.length,
                    })
                )
                await this.handleComponentsFound(tabId, repoType.id, componentIdentities)
                await Promise.all(eventPromises)
            }
        } catch (error) {
            logger.logServiceWorker('Error processing tab for repo', LogLevel.ERROR, error, url, tabId, repoType.id)
            await this.handleTabError(tabId, repoType.id)
            await this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.COMPONENT_IDENTITIES_CALCULATE_FAILURE, {
                page_url: url,
                repo_type_id: repoType.id,
                repo_type_url: repoType.baseUrl,
                error: (error as Error).message,
            })
        } finally {
        this.inFlightEvaluations.delete(tabId)
    }
    }

    private async handleTabError(tabId: number, repoTypeId: string): Promise<void> {
        const newExtensionTabsData = this.extensionDataState.tabsData

        newExtensionTabsData.tabs[tabId] = {
            tabId,
            components: {},
            status: TabDataStatus.ERROR,
            repoTypeId,
        }

        await this.updateExtensionTabData(newExtensionTabsData)
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

    private processEvaluationResults(
        tabId: number,
        tabsData: ExtensionTabsData,
        evaluationResults: ApiComponentEvaluationResultDTOV2
    ): void {
        evaluationResults.results?.forEach((result: ApiComponentDetailsDTOV2) => {
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
        tabsData: ExtensionTabsData,
        evaluationResults: ApiComponentEvaluationResultDTOV2,
        iqMessageHelper: IqMessageHelper
    ): Promise<void> {
        const remediationPromises =
            evaluationResults.results?.map((compEvalResult: ApiComponentDetailsDTOV2) => {
                if (compEvalResult.matchState === MATCH_STATE_EXACT) {
                    return this.fetchSingleRemediationDetail(tabId, tabsData, compEvalResult, iqMessageHelper)
                }
            }) || []

        await Promise.all(remediationPromises)

        logger.logServiceWorker('All Component Remediation Calls in', LogLevel.DEBUG)

        await this.updateExtensionTabData(tabsData)
        await this.sendCompletionNotification(tabId)
    }

    private async fetchSingleRemediationDetail(
        tabId: number,
        tabsData: ExtensionTabsData,
        compEvalResult: ApiComponentDetailsDTOV2,
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
