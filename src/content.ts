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

import $ from 'cash-dom'
import { getArtifactDetailsFromDOM } from './utils/PageParsing'
import { MESSAGE_REQUEST_TYPE, MESSAGE_RESPONSE_STATUS, MessageRequest, MessageResponseFunction } from './types/Message'
import { logger, LogLevel } from './logger/Logger'
import { ComponentState } from './types/Component'
import { DefaultRepoRegistry } from './utils/RepoRegistry'
import { BaseRepo } from './utils/Types'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

/**
 * New listener for messages received by Service Worker.
 *
 */
_browser.runtime.onMessage.addListener(handle_message_received_calculate_purl_for_page)
_browser.runtime.onMessage.addListener(handle_message_received_propogate_component_state)

/**
 * New (asynchronous) handler for processing messages received.
 *
 * This always returns True to cause handling to be asynchronous.
 */
function handle_message_received_calculate_purl_for_page(
    request: MessageRequest,
    sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
    sendResponse: MessageResponseFunction
): void {
    if (request.type == MESSAGE_REQUEST_TYPE.CALCULATE_PURL_FOR_PAGE) {
        logger.logMessage('Content Script - Handle Received Message', LogLevel.INFO, request.type)
        logger.logMessage('Deriving PackageURL', LogLevel.INFO, request.params)

        let repoType: BaseRepo | undefined
        if (request.params !== undefined && 'repoId' in request.params) {
            repoType = DefaultRepoRegistry.getRepoById(request.params.repoId as string)
        }

        if (repoType === undefined) {
            sendResponse({
                status: MESSAGE_RESPONSE_STATUS.FAILURE,
                status_detail: {
                    message: `Repository not supported: ${window.location.href}`,
                },
            })
        } else {
            const purl = getArtifactDetailsFromDOM(repoType, window.location.href)
            if (purl === undefined) {
                sendResponse({
                    status: MESSAGE_RESPONSE_STATUS.FAILURE,
                    status_detail: {
                        message: `Unable to determine PackageURL for ${window.location.href}`,
                    },
                })
            } else {
                sendResponse({
                    status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                    data: {
                        purl: purl.toString(),
                    },
                })
            }
        }
        //  else if (repoType.repoFormat == FORMATS.NXRM) {
        //     logger.logMessage(`Calculating PURL for a Sonatype Nexus Repository`, LogLevel.DEBUG)
        //     const
        //     const purl = getArtifactDetailsFromNxrmDom(repoType, window.location.href)

        //     if (purl === undefined) {
        //         sendResponse({
        //             status: MESSAGE_RESPONSE_STATUS.FAILURE,
        //             status_detail: {
        //                 message: `Unable to determine PackageURL for Sonatype Nexus Repository ${window.location.href}`,
        //             },
        //         })
        //     } else {
        //         sendResponse({
        //             status: MESSAGE_RESPONSE_STATUS.SUCCESS,
        //             data: {
        //                 purl: purl.toString(),
        //             },
        //         })
        //     }
        // } else {
        //     const purl = getArtifactDetailsFromDOM(repoType, window.location.href)
        //     if (purl === undefined) {
        //         sendResponse({
        //             status: MESSAGE_RESPONSE_STATUS.FAILURE,
        //             status_detail: {
        //                 message: `Unable to determine PackageURL for ${window.location.href}`,
        //             },
        //         })
        //     } else {
        //         sendResponse({
        //             status: MESSAGE_RESPONSE_STATUS.SUCCESS,
        //             data: {
        //                 purl: purl.toString(),
        //             },
        //         })
        //     }
        // }
    }
}

/**
 * New (asynchronous) handler for processing messages received.
 *
 * This always returns True to cause handling to be asynchronous.
 */
function handle_message_received_propogate_component_state(request: MessageRequest): void {
    if (request.type == MESSAGE_REQUEST_TYPE.PROPOGATE_COMPONENT_STATE) {
        logger.logMessage('Content Script - Handle Received Message', LogLevel.DEBUG, request.type)
        const repoType = DefaultRepoRegistry.getRepoForUrl(window.location.href)

        if (repoType !== undefined) {
            logger.logMessage('Propogate - Repo Type', LogLevel.DEBUG, repoType)
            if (request.params !== undefined && 'componentState' in request.params) {
                const domElement = $(repoType.titleSelector())
                const componentState = request.params.componentState as ComponentState

                if (componentState == ComponentState.CLEAR) {
                    removeClasses(domElement)
                    return
                }

                logger.logMessage('Adding CSS Classes', LogLevel.DEBUG, ComponentState)
                let vulnClass = 'sonatype-iq-extension-vuln-unspecified'
                switch (componentState) {
                    case ComponentState.CRITICAL:
                        vulnClass = 'sonatype-iq-extension-vuln-critical'
                        break
                    case ComponentState.SEVERE:
                        vulnClass = 'sonatype-iq-extension-vuln-severe'
                        break
                    case ComponentState.MODERATE:
                        vulnClass = 'sonatype-iq-extension-vuln-moderate'
                        break
                    case ComponentState.LOW:
                        vulnClass = 'sonatype-iq-extension-vuln-low'
                        break
                    case ComponentState.NONE:
                        vulnClass = 'sonatype-iq-extension-vuln-none'
                        break
                    case ComponentState.EVALUATING:
                        vulnClass = 'sonatype-iq-extension-vuln-evaluating'
                        break
                    case ComponentState.INCOMPLETE_CONFIG:
                        vulnClass = 'sonatype-iq-extension-vuln-invalid-config'
                        break
                }

                logger.logMessage('Propogate - domElement', LogLevel.DEBUG, domElement)
                if (domElement.length > 0) {
                    removeClasses(domElement)
                    domElement.addClass('sonatype-iq-extension-vuln')
                    domElement.addClass(vulnClass)
                }
            }
        }
    }
}

const removeClasses = (element) => {
    logger.logMessage(`Remving Sonatype added classes`, LogLevel.DEBUG, element)
    element.removeClass('sonatype-iq-extension-vuln')
    element.removeClass('sonatype-iq-extension-vuln-severe')
    element.removeClass('sonatype-iq-extension-vuln-high')
    element.removeClass('sonatype-iq-extension-vuln-med')
    element.removeClass('sonatype-iq-extension-vuln-low')
    element.removeClass('sonatype-iq-extension-vuln-none')
    element.removeClass('sonatype-iq-extension-vuln-evaluating')
    element.removeClass('sonatype-iq-extension-vuln-invalid-config')
    element.removeClass('sonatype-iq-extension-vuln-unspecified')
}
