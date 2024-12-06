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

import { logger, LogLevel } from '../logger/Logger'
import { ExtensionConfigurationState } from '../settings/extension-configuration'
import { MESSAGE_REQUEST_TYPE, MESSAGE_RESPONSE_STATUS, MessageRequest, MessageResponseFunction } from '../types/Message'
import { DefaultPageParserRegistry } from '../utils/PageParserRegistry'
import { DefaultRepoRegistry } from '../utils/RepoRegistry'
import { BaseRepo } from '../utils/RepoType/BaseRepo'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
// const _browser = chrome || browser

export class ContentScriptCalculatePurls {

    constructor(private readonly extensionConfiguration: ExtensionConfigurationState) {
        this.extensionConfiguration = extensionConfiguration
    }

    public handleMessage(
        request: MessageRequest,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): void {
        logger.logMessage(`ContentScriptCalculatePurls.handleMessage`, LogLevel.DEBUG, request, sender, sendResponse)    
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
}
