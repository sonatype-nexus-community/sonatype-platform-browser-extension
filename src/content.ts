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

import { Cash } from 'cash-dom'
import { MESSAGE_REQUEST_TYPE, MESSAGE_RESPONSE_STATUS, MessageRequest, MessageRequestPropogateComponentState, MessageResponseFunction } from './types/Message'
import { logger, LogLevel } from './logger/Logger'
import { ComponentState, ComponentStateUtil } from './types/Component'
import { DefaultRepoRegistry } from './utils/RepoRegistry'
import { BaseRepo } from './utils/RepoType/BaseRepo'
import { DefaultPageParserRegistry } from './utils/PageParserRegistry'
import { PackageURL } from 'packageurl-js'

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
            const purls = DefaultPageParserRegistry.getParserByRepoId(repoType.id()).parsePage(window.location.href)
            if (purls.length == 0) {
                sendResponse({
                    status: MESSAGE_RESPONSE_STATUS.FAILURE,
                    status_detail: {
                        message: `Unable to determine PackageURLs for ${window.location.href}`,
                    },
                })
            } else {
                sendResponse({
                    status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                    data: {
                        purl: purls[0].toString(),
                        purls: purls.map((p) => p.toString())
                    },
                })
            }
        }
    }
}

/**
 * New (asynchronous) handler for processing messages received.
 *
 * This always returns True to cause handling to be asynchronous.
 */
function handle_message_received_propogate_component_state(request: MessageRequestPropogateComponentState): void {
    if (request.type == MESSAGE_REQUEST_TYPE.PROPOGATE_COMPONENT_STATE) {
        logger.logMessage('Content Script - Handle Received Message', LogLevel.DEBUG, request.type, request.params)
        const repoType = DefaultRepoRegistry.getRepoForUrl(window.location.href)

        if (repoType !== undefined) {
            logger.logMessage('Propogate - Repo Type', LogLevel.DEBUG, repoType)
            // const domClass = `purl-${getPurlHash(PackageURL.fromString(request.params.purl))}`
            // $(function () { console.debug('DOM READY', $(`.${domClass}`)) })
            const domElement = DefaultPageParserRegistry.getParserByRepoId(repoType.id())
                .getDomNodeForPurl(window.location.href, PackageURL.fromString(request.params.purl))
            logger.logMessage(`Finding DOM Element for PURL '${request.params.purl}' yields...`, LogLevel.DEBUG, domElement)

            if (request.params.componentState == ComponentState.CLEAR) {
                removeClasses(domElement)
                return
            }

            logger.logMessage('Adding CSS Classes', LogLevel.DEBUG, request.params.componentState)
            // let vulnClass = 'sonatype-iq-extension-vuln-unspecified'
            const vulnClass = ComponentStateUtil.toCssClass(request.params.componentState)

            logger.logMessage('Propogate - domElement', LogLevel.DEBUG, domElement)
            if (domElement.length > 0) {
                removeClasses(domElement)
                domElement.addClass('sonatype-iq-extension-vuln')
                domElement.addClass(vulnClass)
            }
            logger.logMessage("CSS CLASSES ARE NOW: ", LogLevel.DEBUG, domElement.attr('class'))
        }
    }
}

const removeClasses = (element: Cash) => {
    logger.logMessage(`Removing Sonatype added classes`, LogLevel.DEBUG, element)
    element.removeClass('sonatype-iq-extension-vuln')
    Object.values(ComponentState).forEach((v) => { 
        element.removeClass(ComponentStateUtil.toCssClass(v))
    })
}
