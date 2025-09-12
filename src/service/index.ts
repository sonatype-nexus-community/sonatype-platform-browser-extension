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

import { Analytics } from '../common/analytics/analytics'
import { ExtensionConfigurationStateServiceWorker } from '../common/configuration/extension-configuration-sw'
import { ExtensionConfiguration } from '../common/configuration/types'
import { STORAGE_KEY_SETTINGS, STORAGE_KEY_TABS, STORAGE_KEY_VULNERABILITIES, ThisBrowser } from '../common/constants'
import { ExtensionDataState } from '../common/data/extension-data'
import { ExtensionTabsData, ExtensionVulnerabilitiesData } from '../common/data/types'
import { logger, LogLevel } from '../common/logger'
import { MessageRequestType } from '../common/message/constants'
import { lastRuntimeError } from '../common/message/helpers'
import {
    MessageRequestExtensionConfigurationUpdated,
    MessageRequestExtensionDataUpdated,

} from '../common/message/types'
import { PortType } from '../common/types'
import { ServiceWorkerNotificationOnClickedHandler } from './handlers/notifications-on-clicked'
import { ServiceWorkerRuntimeOnInstalledHandler } from './handlers/runtime-on-installed'
import { ServiceWorkerRuntimeOnMessageHandler } from './handlers/runtime-on-message'
import { ServiceWorkerTabOnHandler } from './handlers/tab-on'
import { loadExtensionDataAndSettings } from './helpers'

// This script is our Service Worker.
//
// It has many purposes, but ultimately bootstraps this Extension.
//
// 1. Detect install/upgrade of this Extension
// 2. Service Worker Activation
//    2A) Handle Messages received by Service Worker
//    2B) Handle Tab Activity
//    2C) Handle Storage changes
const analytics = new Analytics()
const allDataClientNames = ['SIDE-PANEL']
const broadcastClientsAllData = new Set<PortType>()
const broadcastClientsExtensionConfiguration = new Set<PortType>()

async function broadcastExtensionConfiguration(message: MessageRequestExtensionConfigurationUpdated) {
    logger.logServiceWorker(
        'Broadcasting Extension Configuration to registered clients',
        LogLevel.DEBUG,
        message,
        broadcastClientsExtensionConfiguration.size
    )
    for (const client of broadcastClientsExtensionConfiguration.values()) {
        try {
            client.postMessage(message)
        } catch (err) {
            logger.logServiceWorker("Failed to broadcast extension configuration to client", LogLevel.WARN, client, err)
        }
    }
}

async function broadcastAllData(message: MessageRequestExtensionDataUpdated) {
    logger.logServiceWorker(
        'Broadcasting All Data to registered clients',
        LogLevel.DEBUG,
        message,
        broadcastClientsAllData.size
    )
    for (const client of broadcastClientsAllData.values()) {
        try {
            client.postMessage(message)
        } catch (err) {
            logger.logServiceWorker("Failed to broadcast all data to client", LogLevel.WARN, client, err)
        }
    }
}

// 1 Extension Installed/Updated
const onInstalledHandler = new ServiceWorkerRuntimeOnInstalledHandler(analytics)
ThisBrowser.runtime.onInstalled.addListener(onInstalledHandler.handleOnInstalled)

// 2 Service Worker Activated
logger.logServiceWorker('Service Worker Activated', LogLevel.DEBUG)

// Load Configuration
loadExtensionDataAndSettings().then(({ settings, tabsData, vulnerabilityData }) => {
    const extensionConfigurationState = new ExtensionConfigurationStateServiceWorker(settings, analytics)
    const extensionDataState = new ExtensionDataState(tabsData, vulnerabilityData)

    ThisBrowser.runtime.onConnect.addListener(async function (port: PortType) {
        port.onDisconnect.addListener((port: PortType) => {
            const runtimeError = lastRuntimeError()
            logger.logServiceWorker('Client disconnected', LogLevel.DEBUG, port, runtimeError)
            broadcastClientsAllData.delete(port)
            broadcastClientsExtensionConfiguration.delete(port)
        })
        logger.logServiceWorker('Client connected', LogLevel.DEBUG, port)
        if (allDataClientNames.includes(port.name)) {
            broadcastClientsAllData.add(port)
        } else {
            broadcastClientsExtensionConfiguration.add(port)
        }
        await broadcastExtensionConfiguration({
            messageType: MessageRequestType.EXTENSION_CONFIGURATION_UPDATED,
            newExtensionConfig: extensionConfigurationState.getExtensionConfig(),
        })
        await broadcastAllData({
            messageType: MessageRequestType.EXTENSION_DATA_UPDATED,
            extensionConfiguration: extensionConfigurationState.getExtensionConfig(),
            tabsData: extensionDataState.tabsData,
            vulnerabilitiesData: extensionDataState.vulnerabilityData,
        })
    })

    // 2A Message Received
    const onMessageHandler = new ServiceWorkerRuntimeOnMessageHandler(
        analytics,
        extensionConfigurationState,
        extensionDataState
    )
    ThisBrowser.runtime.onMessage.addListener(onMessageHandler.handleOnMessage)

    // 2B Tab Activiy
    const onTabHandler = new ServiceWorkerTabOnHandler(analytics, extensionConfigurationState, extensionDataState)
    ThisBrowser.tabs.onActivated.addListener(onTabHandler.handleOnActivated)
    ThisBrowser.tabs.onUpdated.addListener(onTabHandler.handleOnUpdated)
    ThisBrowser.tabs.onRemoved.addListener(onTabHandler.handleOnRemoved)

    // 2C Storage Changed
    const storageHandler = (changes: { [key: string]: browser.storage.StorageChange }, areaName: string) => {
        if (areaName == 'local') {
            let configChanged = false
            let tabsChanged = false
            let vulnerabilitiesChanged = false
            if (Object.keys(changes).includes(STORAGE_KEY_SETTINGS)) {
                extensionConfigurationState.setExtensionConfig(
                    changes[STORAGE_KEY_SETTINGS]['newValue'] as ExtensionConfiguration
                )
                configChanged = true
            }
            if (Object.keys(changes).includes(STORAGE_KEY_TABS)) {
                extensionDataState.tabsData = changes[STORAGE_KEY_TABS]['newValue'] as ExtensionTabsData
                tabsChanged = true
            }
            if (Object.keys(changes).includes(STORAGE_KEY_VULNERABILITIES)) {
                extensionDataState.vulnerabilityData = changes[STORAGE_KEY_VULNERABILITIES][
                    'newValue'
                ] as ExtensionVulnerabilitiesData
                vulnerabilitiesChanged = true
            }

            // Broadcast Extension Config only
            if (configChanged) {
                broadcastExtensionConfiguration({
                    messageType: MessageRequestType.EXTENSION_CONFIGURATION_UPDATED,
                    newExtensionConfig: extensionConfigurationState.getExtensionConfig(),
                })
            }

            // Broadcast All Data
            if (configChanged || tabsChanged || vulnerabilitiesChanged) {
                broadcastAllData({
                    messageType: MessageRequestType.EXTENSION_DATA_UPDATED,
                    extensionConfiguration: extensionConfigurationState.getExtensionConfig(),
                    tabsData: extensionDataState.tabsData,
                    vulnerabilitiesData: extensionDataState.vulnerabilityData
                })
            }
        }
    }
    ThisBrowser.storage.onChanged.addListener(storageHandler)

    // 2D Notification interacted with
    const onClickedHandler = new ServiceWorkerNotificationOnClickedHandler(analytics, extensionConfigurationState, extensionDataState)
    ThisBrowser.notifications.onButtonClicked.addListener(onClickedHandler.handleOnClicked)
    ThisBrowser.notifications.onClicked.addListener(onClickedHandler.handleOnClicked)
})
