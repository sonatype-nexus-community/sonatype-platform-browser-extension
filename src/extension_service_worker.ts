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
/// <reference lib="webworker" />

import 'node-window-polyfill/register' // New line ensures this Polyfill is first!

import { logger, LogLevel } from './logger/Logger'
import { findRepoType } from './utils/UrlParsing'
import { compareVersions } from 'compare-versions'
import { MESSAGE_REQUEST_TYPE, MESSAGE_RESPONSE_STATUS, MessageRequest, MessageResponseFunction } from './types/Message'
import { propogateCurrentComponentState } from './messages/ComponentStateMessages'
import {
    requestComponentEvaluationByPurls,
    getApplications,
    pollForComponentEvaluationResult,
} from './messages/IqMessages'
import { ApiComponentEvaluationResultDTOV2, ApiComponentEvaluationTicketDTOV2 } from '@sonatype/nexus-iq-api-client'
import { ComponentState, getForComponentPolicyViolations, getIconForComponentState } from './types/Component'
import { IncompleteConfigurationError, UserAuthenticationError } from './error/ExtensionError'
import { Analytics, ANALYTICS_EVENT_TYPES } from './utils/Analytics'
import { PackageURL } from 'packageurl-js'
import { readExtensionConfiguration, updateExtensionConfiguration } from './messages/SettingsMessages'
import { ExtensionConfiguration } from './types/ExtensionConfiguration'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser
const extension = _browser.runtime.getManifest()
const analytics = new Analytics()

/**
 * New listener for messages received by Service Worker.
 *
 */
_browser.runtime.onMessage.addListener(handle_message_received)

/**
 * New (asynchronous) handler for processing messages received.
 *
 * This always returns True to cause handling to be asynchronous.
 */
function handle_message_received(
    request: MessageRequest,
    sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
    sendResponse: MessageResponseFunction
): boolean {
    logger.logMessage('Service Worker - Handle Received Message', LogLevel.INFO, request.type)

    switch (request.type) {
        case MESSAGE_REQUEST_TYPE.GET_APPLICATIONS:
            getApplications().then((response) => {
                sendResponse(response)
            })
            break
        case MESSAGE_REQUEST_TYPE.REQUEST_COMPONENT_EVALUATION_BY_PURLS:
            requestComponentEvaluationByPurls(request).then((response) => {
                logger.logMessage(`Response to Poll for Results: ${response}`, LogLevel.DEBUG)
                sendResponse(response)
            })
            break
    }

    // Handlers are async - so return true
    return true
}

/**
 * Handler for Install Event for our Extension
 */
_browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        _browser.tabs.create({ url: 'options.html?install' })
        analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_INSTALL, {
            reason: details.reason,
        })
    } else if (details.reason == 'update') {
        performUpgrade(details.fromVersion, details.reason).then(() => {
            analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_UPDATE, {
                previousVersion: details.previousVersion,
                reason: details.reason,
            })
        })
    } else {
        analytics.fireEvent(ANALYTICS_EVENT_TYPES.BROWSER_UPDATE, {
            reason: details.reason,
        })
    }
})

async function performUpgrade(fromVersion: string, reason: string): Promise<void> {
    logger.logMessage(`Upgrading from ${fromVersion}`, LogLevel.INFO)
    // There was no upgrade of internal data prior to 2.9.1

    if (fromVersion === undefined || compareVersions('2.9.0', fromVersion) < 1) {
        // Upgrading from 2.9.0 or prior
        readExtensionConfiguration()
            .then((response) => {
                const extensionSettings = response.data as ExtensionConfiguration
                const newSettings = response.data as ExtensionConfiguration
                if (!('sonatypeNexusRepositoryHosts' in extensionSettings)) {
                    newSettings.sonatypeNexusRepositoryHosts = []
                }
                if (!('supportsFirewall' in extensionSettings)) {
                    newSettings.supportsFirewall = false
                }
                if (!('supportsLifecycle' in extensionSettings)) {
                    newSettings.supportsLifecycle = false
                }
                if (!('supportsLifecycleAlp' in extensionSettings)) {
                    newSettings.supportsLifecycleAlp = false
                }
                updateExtensionConfiguration(newSettings)
                    .then((upgradeResposne) => {
                        analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_CONFIG_UPGRADE, {
                            upgradeResposne: upgradeResposne.status,
                        })
                    })
                    .then(() => {
                        /**
                         *  @todo Force re-detection of IQ Capabilities here
                         */
                        logger.logMessage(
                            `Automatic re-detection of IQ Capabilities is not yet implemented - please click "Connect" in Options page`,
                            LogLevel.WARN
                        )
                    })
            })
            .then(() => {
                analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_UPDATE, {
                    previousVersion: fromVersion,
                    reason: reason,
                })
            })
    }
}

function enableDisableExtensionForUrl(url: string, tabId: number): void {
    /**
     * Check if URL matches an ecosystem we support, and only then do something
     *
     */
    findRepoType(url).then((repoType) => {
        /**
         * Make sure we get a valid PURL before we ENABLE - this may require DOM access (via Message)
         */

        if (repoType !== undefined) {
            // We support this Repository!
            logger.logMessage(`Enabling Sonatype Browser Extension for ${url}`, LogLevel.DEBUG)
            propogateCurrentComponentState(tabId, ComponentState.EVALUATING)
            _browser.tabs
                .sendMessage(tabId, {
                    type: MESSAGE_REQUEST_TYPE.CALCULATE_PURL_FOR_PAGE,
                    params: {
                        repoType: repoType,
                        tabId: tabId,
                        url: url,
                    },
                })
                .catch((err) => {
                    logger.logMessage(`Error caught calling CALCULATE_PURL_FOR_PAGE`, LogLevel.DEBUG, err)
                    analytics.fireEvent(ANALYTICS_EVENT_TYPES.PURL_CALCULATE_FAILURE, {
                        repo: repoType.url,
                        url: url,
                    })
                })
                .then((response) => {
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    if (_browser.runtime.lastError) {
                        logger.logMessage('Error response from CALCULATE_PURL_FOR_PAGE', LogLevel.ERROR, response)
                    }
                    logger.logMessage('Calc Purl Response: ', LogLevel.INFO, response)

                    // chrome.sidePanel.setPanelBehavior({
                    //     openPanelOnActionClick: true,
                    // })

                    if (response !== undefined && response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
                        const packageUrl = PackageURL.fromString(response.data.purl)
                        analytics.fireEvent(ANALYTICS_EVENT_TYPES.PURL_CALCULATED, {
                            name: packageUrl.name,
                            namespace: packageUrl.namespace,
                            purl: response.data.purl,
                            qualifiers: packageUrl.qualifiers,
                            type: packageUrl.type,
                            version: packageUrl.version,
                        })

                        requestComponentEvaluationByPurls({
                            type: MESSAGE_REQUEST_TYPE.REQUEST_COMPONENT_EVALUATION_BY_PURLS,
                            params: {
                                purls: [response.data.purl],
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

                                const { promise, stopPolling } = pollForComponentEvaluationResult(
                                    evaluateRequestTicketResponse.applicationId === undefined
                                        ? ''
                                        : evaluateRequestTicketResponse.applicationId,
                                    evaluateRequestTicketResponse.resultId === undefined
                                        ? ''
                                        : evaluateRequestTicketResponse.resultId,
                                    1000
                                )

                                promise
                                    .then((evalResponse) => {
                                        const componentDetails = (
                                            evalResponse as ApiComponentEvaluationResultDTOV2
                                        ).results?.pop()

                                        let componentState: ComponentState = ComponentState.UNKNOWN
                                        if (
                                            componentDetails?.matchState != null &&
                                            componentDetails.matchState != 'unknown'
                                        ) {
                                            componentState = getForComponentPolicyViolations(
                                                componentDetails?.policyData
                                            )
                                        }

                                        propogateCurrentComponentState(tabId, componentState)

                                        _browser.action.enable(tabId, () => {
                                            _browser.action.setIcon({
                                                tabId: tabId,
                                                path: getIconForComponentState(componentState),
                                            })
                                        })

                                        logger.logMessage(
                                            `${extension.name} ENABLED for ${url} : ${response.data.purl}`,
                                            LogLevel.INFO
                                        )

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
                                    })
                                    .catch((err) => {
                                        logger.logMessage(`Error in Poll: ${err}`, LogLevel.ERROR)
                                    })
                                    .finally(() => {
                                        logger.logMessage('Stopping poll for results - they are in!', LogLevel.INFO)
                                        stopPolling()
                                    })
                            })
                            .catch((err) => {
                                if (err instanceof IncompleteConfigurationError) {
                                    logger.logMessage(`Incomplete Extension Configuration: ${err}`, LogLevel.ERROR)
                                    propogateCurrentComponentState(tabId, ComponentState.INCOMPLETE_CONFIG)
                                    logger.logMessage(
                                        `Disabling ${extension.name} - Incompolete Extension Configuration: ${err}`,
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
                                    propogateCurrentComponentState(tabId, ComponentState.INCOMPLETE_CONFIG)
                                    logger.logMessage(
                                        `Disabling ${extension.name} - Incompolete Extension Configuration: ${err}`,
                                        LogLevel.ERROR
                                    )
                                    _browser.action.disable(tabId, () => {
                                        _browser.action.setIcon({
                                            tabId: tabId,
                                            path: getIconForComponentState(ComponentState.UNKNOWN),
                                        })
                                    })
                                    _browser.tabs.create({ url: 'options.html#invalid-credentials' })
                                } else {
                                    logger.logMessage(`Error in r2: ${err}`, LogLevel.ERROR)
                                }
                            })
                    } else {
                        logger.logMessage(
                            `Disabling Sonatype Browser Extension for ${url} - Could not determine PURL.`,
                            LogLevel.DEBUG
                        )
                        analytics.fireEvent(ANALYTICS_EVENT_TYPES.PURL_CALCULATE_FAILURE, {
                            repo: repoType.url,
                            url: url,
                        })
                        propogateCurrentComponentState(tabId, ComponentState.CLEAR)
                        _browser.action.disable(tabId, () => {
                            logger.logMessage(`Sonatype Extension DISABLED for ${url}`, LogLevel.INFO)
                            _browser.action.setIcon({
                                tabId: tabId,
                                path: getIconForComponentState(ComponentState.UNKNOWN),
                            })
                        })
                    }
                })
        } else {
            logger.logMessage(
                `Disabling Sonatype Browser Extension for ${url} - Not a supported Registry.`,
                LogLevel.DEBUG
            )
            propogateCurrentComponentState(tabId, ComponentState.CLEAR)
            _browser.action.disable(tabId, () => {
                logger.logMessage(`Sonatype Extension DISABLED for ${url}`, LogLevel.INFO)
                _browser.action.setIcon({
                    tabId: tabId,
                    path: getIconForComponentState(ComponentState.UNKNOWN),
                })
            })
        }
    })
}

/**
 * Fired when the current tab changes, but the tab may itself not change
 */
_browser.tabs.onActivated.addListener(({ tabId }: { tabId: number }) => {
    _browser.tabs.get(tabId, (tab) => {
        if (tab.url !== undefined) {
            enableDisableExtensionForUrl(tab.url, tabId)
        }
    })
})

/**
 * This is fired for every tab on every update - we should filter before sending a message - this is carnage!
 */
_browser.tabs.onUpdated.addListener((tabId: number, changeInfo: object, tab: chrome.tabs.Tab | browser.tabs.Tab) => {
    if ('status' in changeInfo && changeInfo.status == 'complete' && tab.active && tab.url !== undefined) {
        enableDisableExtensionForUrl(tab.url, tabId)
    }
})
