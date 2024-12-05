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

import { logger, LogLevel } from './logger/Logger'
import { readExtensionConfiguration } from './messages/SettingsMessages'
import { ExtensionConfiguration } from './types/ExtensionConfiguration'
import { ContentScriptCalculatePurls } from './content/calculate-purls'
import { ContentScriptUpdateComponentState } from './content/update-component-state'
import { MessageRequest, MessageResponseFunction, MessageRequestPropogateComponentState } from './types/Message'
import { ExtensionConfigurationStateContentScript } from './settings/extension-configuration-cs'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser = chrome || browser

readExtensionConfiguration().then((response) => {
    logger.logMessage(`Content Script has loaded Extension Config`, LogLevel.DEBUG, response)
    const extensionConfigurationContainer = new ExtensionConfigurationStateContentScript(response.data as ExtensionConfiguration)

    const handlerCalculatePurls = new ContentScriptCalculatePurls(extensionConfigurationContainer)
    _browser.runtime.onMessage.addListener((
        request: MessageRequest,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): void => {
        handlerCalculatePurls.handleMessage(request, sender, sendResponse)
    })

    const handlerUpdateComponentState = new ContentScriptUpdateComponentState(extensionConfigurationContainer)
    _browser.runtime.onMessage.addListener((
        request: MessageRequestPropogateComponentState,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): void => {
        handlerUpdateComponentState.handleMessage(request, sender, sendResponse)
    })
})