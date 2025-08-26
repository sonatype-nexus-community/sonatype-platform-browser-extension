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
import { ThisBrowser } from "../../common/constants"
import { logger, LogLevel } from "../../common/logger"
import { MessageRequestType } from "../../common/message/constants"
import { MessageRequestAnnotatePageWithComponentStatuses, MessageRequestRequestComponentIdentitiesFromPage, MessageResponseFunction } from "../../common/message/types"
import { MessageSender } from "../../common/types"
import { AnnotatePageWithComponentStatusesMessageHandler } from "./runtime-on-message/annotate-page-with-component-statuses"
import { BaseRuntimeOnMessageHandler } from "./runtime-on-message/base"
import { RequestComponentIdentitiesFromPageMessageHandler } from "./runtime-on-message/request-component-identities"

export class ContentScriptRuntimeOnMessageHandler {

    public handleOnMessage = (
        request: MessageRequestAnnotatePageWithComponentStatuses | MessageRequestRequestComponentIdentitiesFromPage,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): boolean => {
        logger.logContent(
            `ContentScript.handleMessage: `,
            LogLevel.DEBUG,
            request.messageType,
            request,
            sender
        )
        let messageHandler: BaseRuntimeOnMessageHandler | undefined = undefined
        
        switch (request.messageType) {
            case MessageRequestType.ANNOTATE_PAGE_COMPONENT_IDENTITIES:
                messageHandler = new AnnotatePageWithComponentStatusesMessageHandler()
                break
            case MessageRequestType.REQUEST_COMPONENT_IDENTITIES_FROM_PAGE:
                messageHandler = new RequestComponentIdentitiesFromPageMessageHandler()
                break
        }

        if (messageHandler !== undefined) {
            messageHandler.handleMessage(request, sender, sendResponse).then(() => {
                logger.logContent(`Message Handled ${request.messageType}`, LogLevel.DEBUG, request)
            }).catch((err: Error) => {
                logger.logContent('Error whilst Content Script handled Message', LogLevel.ERROR, err, request)
                ThisBrowser.notifications.create({
                    type: 'basic',
                    iconUrl: '/images/pink-icon-alert.png',
                    title: 'Error',
                    message: `Extension Error: ${err.message}`,
                    priority: 0,
                }).finally(() => {
                    throw err
                })
            })
        } else {
            logger.logContent(
                `No message handler for message type: ${request.messageType}`,
                LogLevel.DEBUG,
                request
            )
        }

        // Handlers are async - so return true
        return true
    }
}
