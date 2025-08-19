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
import {
    MessageResponsePageComponentIdentitiesParsed
} from '../../common/message/types'
import { DefaultRepoRegistry } from '../../common/repo-registry'
import { ActiveInfo, ChangeInfo, TabType } from '../../common/types'
import { BaseServiceWorkerHandler } from './base'
import { IqMessageHelper } from './helpers/iq'
import { NotificationHelper } from './helpers/notification'

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
        if (repoType !== undefined) {
            logger.logServiceWorker('enableDisableExtensionForUrl', LogLevel.DEBUG, url, tabId, repoType)
            ThisBrowser.tabs
                .sendMessage(tabId, {
                    messageType: MessageRequestType.REQUEST_COMPONENT_IDENTITIES_FROM_PAGE,
                    repoTypeId: repoType.id,
                })
                .then((msgResponse) => {
                    logger.logServiceWorker('Component Identitied from Content Script', LogLevel.DEBUG, msgResponse)
                    const newExtensionTabsData = this.extensionDataState.tabsData
                    const respPageComponentIdentitiesParsed =
                        msgResponse as MessageResponsePageComponentIdentitiesParsed

                    if (respPageComponentIdentitiesParsed.componentIdentities.length === 0) {
                        this.extensionDataState.tabsData.tabs[tabId] = {
                            tabId,
                            components: {},
                            status: TabDataStatus.NO_COMPONENTS,
                            repoTypeId: repoType.id
                        }
                        return this.updateExtensionTabData(newExtensionTabsData).then(() => {})
                        //     .then((msgResponse) => {
                        //     sendResponse(msgResponse)
                        // })
                    } else {
                        newExtensionTabsData.tabs[tabId] = {
                            tabId,
                            components: {},
                            status: TabDataStatus.EVALUATING,
                            repoTypeId: repoType.id
                        }

                        const iqMessageHelper = new IqMessageHelper(this.extensionConfigurationState)

                        return this.updateExtensionTabData(newExtensionTabsData).then(() => {
                            return iqMessageHelper
                                .evaluateComponents(respPageComponentIdentitiesParsed.componentIdentities)
                                .then((evaluationResults) => {
                                    evaluationResults.results?.forEach((result) => {
                                        if (result.component?.packageUrl != undefined)
                                            newExtensionTabsData.tabs[tabId].components[
                                                result.component?.packageUrl as string
                                            ] = {
                                                componentDetails: ApiComponentDetailsDTOV2ToJSON(result),
                                                componentEvaluationDateTime:
                                                    evaluationResults.evaluationDate?.toISOString() || '',
                                                allComponentVersions: [],
                                                componentLegalDegtails: [],
                                                componentRemediationDetails: undefined,
                                            }
                                    })
                                    newExtensionTabsData.tabs[tabId]['status'] = TabDataStatus.COMPLETE
                                    this.extensionDataState.tabsData = newExtensionTabsData

                                    return this.updateExtensionTabData(newExtensionTabsData).then((msgResponse) => {
                                        const notificationHelper = new NotificationHelper(
                                            this.extensionConfigurationState,
                                            this.extensionDataState
                                        )
                                        const ps: Promise<void>[] = []
                                        evaluationResults.results?.forEach((compEvalResult) => {
                                            ps.push(
                                                iqMessageHelper
                                                    .getComponentRemediationDetails(
                                                        compEvalResult.component?.packageUrl as string
                                                    )
                                                    .then((remediationResponse) => {
                                                        newExtensionTabsData.tabs[tabId].components[
                                                            compEvalResult.component?.packageUrl as string
                                                        ].componentRemediationDetails = remediationResponse.remediation
                                                    })
                                            )
                                        })
                                        Promise.all(ps).then(() => {
                                            logger.logServiceWorker(
                                                'All Component Remediation Calls in',
                                                LogLevel.DEBUG
                                            )
                                            return this.updateExtensionTabData(newExtensionTabsData).then(
                                                (msgResponse) => {
                                                    return notificationHelper.notifyOnComponentEvaluationComplete(tabId)
                                                }
                                            )
                                        })
                                    })
                                })
                        })
                    }
                })
        } else {
            logger.logServiceWorker('Disabling for current Tab', LogLevel.INFO, tabId)
            // chrome.sidePanel.setOptions({
            //     tabId,
            //     enabled: false,
            //     path: `side-panel.html?tabId=${tabId}#6`,
            // })
            this.disableExtensionForTab(url, tabId)
        }
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
