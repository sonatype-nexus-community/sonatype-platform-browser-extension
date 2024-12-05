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
import { getApplications, requestComponentEvaluationByPurls } from '../messages/IqMessages'
import { MESSAGE_REQUEST_TYPE, MessageRequest, MessageResponseFunction } from "../types/Message"
import { BaseServiceWorkerHandler } from './common'

export class ExtensionServiceOnMessage extends BaseServiceWorkerHandler {

    public handleMessage(
        request: MessageRequest,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): boolean {
        logger.logMessage(`ExtensionServiceOnMessage.handleMessage: `, LogLevel.DEBUG, request.type, request)

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
}
