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

import { PackageURL } from 'packageurl-js'
import { logger, LogLevel } from '../logger/Logger'
import { propogateCurrentComponentState } from '../messages/ComponentStateMessages'
import { ComponentState, getForComponentPolicyViolations, getIconForComponentState } from '../types/Component'
import { MESSAGE_REQUEST_TYPE, MESSAGE_RESPONSE_STATUS, MessageResponseCalculatePurlForPage } from '../types/Message'
import { ANALYTICS_EVENT_TYPES } from '../utils/Analytics'
import { DefaultRepoRegistry } from '../utils/RepoRegistry'
import { BaseRepo } from '../utils/RepoType/BaseRepo'
import { ApiComponentEvaluationTicketDTOV2, ApiComponentEvaluationResultDTOV2 } from '@sonatype/nexus-iq-api-client'
import { IncompleteConfigurationError, NoComponentsForEvaluationError, UserAuthenticationError } from '../error/ExtensionError'
import { requestComponentEvaluationByPurls, pollForComponentEvaluationResult } from '../messages/IqMessages'
import { BaseServiceWorkerHandler } from './common'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export type ActiveInfo = chrome.tabs.TabActiveInfo | browser.tabs._OnActivatedActiveInfo
export type ChangeInfo = chrome.tabs.TabChangeInfo | browser.tabs._OnUpdatedChangeInfo
export type TabType = chrome.tabs.Tab | browser.tabs.Tab

export class ExtensionServiceTabOn extends BaseServiceWorkerHandler {

    public handleOnActivated(activeInfo: ActiveInfo): void {
        logger.logMessage(`ExtensionServiceTabOn.handleOnActivated: `, LogLevel.TRACE, activeInfo)

        _browser.tabs.get(activeInfo.tabId, (tab: TabType) => {
            if (tab.url !== undefined) {
                this.enableDisableExtensionForUrl(tab.url, activeInfo.tabId)
            }
        })
    }

    public handleOnUpdated(tabId: number, changeInfo: ChangeInfo, tab: TabType): void {
        logger.logMessage(`ExtensionServiceTabOn.handleOnUpdated: `, LogLevel.TRACE, tabId, changeInfo, tab)

        if (changeInfo.status == 'complete' && tab.active && tab.url !== undefined) {
            this.enableDisableExtensionForUrl(tab.url, tabId)
        }
    }

    protected enableDisableExtensionForUrl(url: string, tabId: number): void {
        const repoType = DefaultRepoRegistry.getRepoForUrl(url)
        if (repoType !== undefined) {
            // Do work
            this.requestPurlsFromPage(repoType, url, tabId)
                .then((calcPurlsResponse: MessageResponseCalculatePurlForPage) => {
                    logger.logMessage("TEMPORARY", LogLevel.INFO, calcPurlsResponse)
                    if (calcPurlsResponse.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
                        if (calcPurlsResponse.data.purls.length > 0) {
                            return this.evaluatePurlsWithSonatype(calcPurlsResponse.data.purls)
                        } else {
                            throw new NoComponentsForEvaluationError("No Components Identified for evaluation")
                        }
                    } else {
                        throw new NoComponentsForEvaluationError("No Components Identified for evaluation")
                    }
                })
                .then((evaluationResponse) => this.processSonatypeIqEvaluationResult(evaluationResponse, tabId))
                // .then((r) => { 
                //     logger.logMessage("TEMPORARY", LogLevel.INFO, r)
                // })
                .catch((err) => {
                    if (err instanceof IncompleteConfigurationError) {
                        logger.logMessage(`Incomplete Extension Configuration: ${err}`, LogLevel.ERROR)
                        propogateCurrentComponentState(tabId, ComponentState.INVALID_CONFIG)
                        logger.logMessage(
                            `Disabling Extension - Incomplete Extension Configuration: ${err}`,
                            LogLevel.ERROR
                        )
                        _browser.action.disable(tabId, () => {
                            _browser.action.setIcon({
                                tabId: tabId,
                                path: getIconForComponentState(ComponentState.UNKNOWN),
                            })
                        })
                    } else if (err instanceof UserAuthenticationError) {
                        logger.logMessage(`UserAuthenticationError: ${err}`, LogLevel.ERROR)
                        propogateCurrentComponentState(tabId, ComponentState.INVALID_CONFIG)
                        logger.logMessage(
                            `Disabling Extension - Incomplete Extension Configuration: ${err}`,
                            LogLevel.ERROR
                        )
                        _browser.action.disable(tabId, () => {
                            _browser.action.setIcon({
                                tabId: tabId,
                                path: getIconForComponentState(ComponentState.UNKNOWN),
                            })
                        })
                        _browser.tabs.create({ url: 'options.html#invalid-credentials' })
                    } else if (err instanceof NoComponentsForEvaluationError) {
                        logger.logMessage("No Components identified for evaluation", LogLevel.INFO)
                    } else {
                        logger.logMessage("Error in enableDisableExtensionForUrl", LogLevel.ERROR, err)
                    }
                })
        } else {
            this.disableExtensionForTab(url, tabId)
        }
    }

    private async requestPurlsFromPage(repoType: BaseRepo, url: string, tabId: number): Promise<MessageResponseCalculatePurlForPage> {
        logger.logMessage('ExtensionServiceTabOn.requestPurlsFromPage', LogLevel.DEBUG, repoType, url, tabId)
        return _browser.tabs.sendMessage(tabId, {
            type: MESSAGE_REQUEST_TYPE.CALCULATE_PURL_FOR_PAGE,
            params: {
                repoId: repoType.id(),
                tabId: tabId,
                url: url,
            },
        }).catch((err) => {
            logger.logMessage(`Error caught calling CALCULATE_PURL_FOR_PAGE`, LogLevel.DEBUG, err)
            this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.PURL_CALCULATE_FAILURE, {
                repo_id: repoType.id(),
                url: url,
            })
            return {
                data: {
                    purls: []
                }
            }
        }).then((response: MessageResponseCalculatePurlForPage) => { 
            response.data.purls.forEach((p) => { 
                const packageUrl = PackageURL.fromString(p)
                propogateCurrentComponentState(tabId, ComponentState.EVALUATING, packageUrl)
                this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.PURL_CALCULATED, {
                    purl_type: packageUrl.type,
                    purl_namespace: packageUrl.namespace ?? '',
                    purl_name: packageUrl.name,
                    purl_version: packageUrl.version,
                    purl_qualifier_extension: (packageUrl.qualifiers ? packageUrl.qualifiers['extension'] : ''),
                    purl_qualifier_qualifier: (packageUrl.qualifiers ? packageUrl.qualifiers['qualifier'] : ''),
                    purl_qualifier_type: (packageUrl.qualifiers ? packageUrl.qualifiers['type'] : ''),
                    purl_string: p
                })
            })
            return response
        })
    }

    private async evaluatePurlsWithSonatype(purls: string[]): Promise<ApiComponentEvaluationResultDTOV2> {
        return requestComponentEvaluationByPurls({
            type: MESSAGE_REQUEST_TYPE.REQUEST_COMPONENT_EVALUATION_BY_PURLS,
            params: {
                purls: purls,
            },
        }).then((r2) => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (_browser.runtime.lastError) {
                logger.logMessage(
                    'Error handling requestComponentEvaluationByPurls',
                    LogLevel.ERROR
                )
            }

            const evaluateRequestTicketResponse = r2.data as ApiComponentEvaluationTicketDTOV2

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { promise } = pollForComponentEvaluationResult(
                evaluateRequestTicketResponse.applicationId === undefined
                    ? ''
                    : evaluateRequestTicketResponse.applicationId,
                evaluateRequestTicketResponse.resultId === undefined
                    ? ''
                    : evaluateRequestTicketResponse.resultId,
                1000
            )

            return promise
        })
    }

    private async processSonatypeIqEvaluationResult(evalResponse: ApiComponentEvaluationResultDTOV2, tabId: number) {
        evalResponse.results?.forEach((cResult) => { 
            let componentState: ComponentState = ComponentState.UNKNOWN
            if (cResult.matchState != null && cResult.matchState != 'unknown') {
                componentState = getForComponentPolicyViolations(
                    cResult?.policyData
                )
            }
            propogateCurrentComponentState(
                tabId,
                componentState,
                PackageURL.fromString(cResult?.component?.packageUrl ?? '')
            )
        })

        const componentDetails = evalResponse.results?.pop()
        let componentState: ComponentState = ComponentState.UNKNOWN
        if (
            componentDetails?.matchState != null &&
            componentDetails.matchState != 'unknown'
        ) {
            componentState = getForComponentPolicyViolations(
                componentDetails?.policyData
            )
        }

        _browser.action.enable(tabId, () => {
            _browser.action.setIcon({
                tabId: tabId,
                path: getIconForComponentState(componentState),
            })
        })

            // logger.logMessage(
            //     `${extension.name} ENABLED for ${url} : ${response.data.purl}`,
            //     LogLevel.INFO
            // )

        _browser.storage.local
            .set({
                componentDetails: componentDetails,
            })
            .then(() => {
                logger.logMessage(
                    'We wrote to the session',
                    LogLevel.DEBUG,
                    componentDetails
                )
            })
        // })
        // .catch((err) => {
        //     logger.logMessage(`Error in Poll: ${err}`, LogLevel.ERROR)
        // })
        // .finally(() => {
        //     logger.logMessage('Stopping poll for results - they are in!', LogLevel.INFO)
        //     stopPolling()
        // })
    }

    private disableExtensionForTab(url: string, tabId: number): void {
        logger.logMessage(
            `Disabling Sonatype Browser Extension for ${url} - Not a supported Registry.`,
            LogLevel.DEBUG
        )
        // propogateCurrentComponentState(tabId, ComponentState.CLEAR)
        _browser.action.disable(tabId, () => {
            logger.logMessage(`Sonatype Extension DISABLED for ${url}`, LogLevel.INFO)
            _browser.action.setIcon({
                tabId: tabId,
                path: getIconForComponentState(ComponentState.UNKNOWN),
            })
        })
    }
}
