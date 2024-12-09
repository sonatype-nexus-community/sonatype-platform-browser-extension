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
import { MESSAGE_REQUEST_TYPE, MessageRequestOpenPopupForPurl, MessageResponseFunction } from '../types/Message'

export class ContentScriptOpenPopupForPurl {

    constructor(private readonly extensionConfiguration: ExtensionConfigurationState) {
        this.extensionConfiguration = extensionConfiguration
    }

    public handleMessage(
        request: MessageRequestOpenPopupForPurl,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): void {
        logger.logMessage(`ContentScriptOpenPopupForPurl.handleMessage`, LogLevel.DEBUG, request, sender, sendResponse)    

        if (request.type == MESSAGE_REQUEST_TYPE.OPEN_POPUP_FOR_PURL) {
            logger.logMessage('Content Script - OpenPopUpForPurl - Handle Received Message', LogLevel.DEBUG, request.type, request.params)}
    }
}