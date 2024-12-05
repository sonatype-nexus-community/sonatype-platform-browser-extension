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
import { MessageRequest, MessageResponseFunction } from './types/Message'
import { Analytics } from './utils/Analytics'
import { readExtensionConfiguration } from './messages/SettingsMessages'
import { ExtensionConfigurationStateServiceWorker } from './settings/extension-configuration-sw'
import { ExtensionServiceOnInstalled, OnInstalledDetails } from './service/runtime-on-installed'
import { ExtensionServiceOnMessage } from './service/runtime-on-message'
import { ActiveInfo, ChangeInfo, ExtensionServiceTabOn, TabType } from './service/tab-on'
import { ExtensionConfiguration } from './types/ExtensionConfiguration'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser
const analytics = new Analytics()

/**
 * Handler for Install Event for our Extension
 * 
 * Can't wait for Extension Settings to be read - otherwise we miss the event!
 */
const handlerOnInstalled = new ExtensionServiceOnInstalled(analytics)
_browser.runtime.onInstalled.addListener((details: object): void => {
    return handlerOnInstalled.handleOnInstalled(details as OnInstalledDetails)
})

/**
 * BOOTSTRAP
 */
readExtensionConfiguration().then((response) => {
    logger.logMessage(`Service Worker has loaded Extension Config`, LogLevel.INFO, response)
    const extensionConfigurationContainer = new ExtensionConfigurationStateServiceWorker(response.data as ExtensionConfiguration)

    _browser.storage.onChanged.addListener((changes: object, areaName: string): void => {
        extensionConfigurationContainer.handleStorageOnChanged(changes, areaName)
    })

    /**
     * Handlers for On Message
     */
    const ExtensionServiceOnMessageHandler = new ExtensionServiceOnMessage(analytics, extensionConfigurationContainer)
    _browser.runtime.onMessage.addListener((
        request: MessageRequest,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): boolean => {
        return ExtensionServiceOnMessageHandler.handleMessage(request, sender, sendResponse)
    })

    /**
     * Handlers for Tab Activity
     */
    const ExtensionServiceTabOnHandler = new ExtensionServiceTabOn(analytics, extensionConfigurationContainer)
    _browser.tabs.onActivated.addListener((activeInfo: ActiveInfo): void => {
        ExtensionServiceTabOnHandler.handleOnActivated(activeInfo)
    })
    _browser.tabs.onUpdated.addListener((tabId: number, changeInfo: ChangeInfo, tab: TabType): void => {
        ExtensionServiceTabOnHandler.handleOnUpdated(tabId, changeInfo, tab)
    })    
})