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
import { logger, LogLevel } from "../../../common/logger"
import { MessageResponseStatus } from "../../../common/message/constants"
import { MessageRequestRequestComponentIdentitiesFromPage, MessageResponseFunction } from "../../../common/message/types"
import { DefaultPageParserRegistry } from "../../../common/page-parsing/registry"
import { DefaultRepoRegistry } from "../../../common/repo-registry"
import { MessageSender } from "../../../common/types"
import { BaseRuntimeOnMessageHandler } from "./base"

// const domReady = new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve))

export class RequestComponentIdentitiesFromPageMessageHandler extends BaseRuntimeOnMessageHandler {
    
    handleMessage(message: MessageRequestRequestComponentIdentitiesFromPage, sender: MessageSender, sendResponse: MessageResponseFunction): Promise<void> {
        logger.logContent('Requested to parse Component Identities from current Page', LogLevel.DEBUG, message)

        $(function () {
        // return domReady.then(() => {
            logger.logContent('DOM is ready', LogLevel.DEBUG, message)

            const url = window.location.href
            const repoType = DefaultRepoRegistry.getRepoForUrl(url)
            if (repoType !== undefined) {
                logger.logServiceWorker('Determining Component Identities for Page', LogLevel.DEBUG, url, repoType)

                const purls = DefaultPageParserRegistry.getParserByRepoId(repoType.id).parsePage(url)
                logger.logContent(
                    'Component Identities parsed',
                    LogLevel.DEBUG,
                    purls,
                    purls.map((purl) => purl.toString())
                )
                sendResponse({
                    status: MessageResponseStatus.SUCCESS,
                    componentIdentities: purls.map((purl) => purl.toString())
                })
            } else {
                logger.logContent('Could not determine Repo Type for URL', LogLevel.DEBUG, url)
                sendResponse({
                    status: MessageResponseStatus.FAILURE,
                    status_detail: "Unable to determine Repo Type for URL"
                })
            }
        })

        return Promise.resolve()
    } 
    
}