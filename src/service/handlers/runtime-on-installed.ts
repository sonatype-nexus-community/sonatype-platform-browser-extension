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
import { compareVersions } from "compare-versions"
import { Analytics, ANALYTICS_EVENT_TYPES } from "../../common/analytics/analytics"
import { STORAGE_KEY_SETTINGS, ThisBrowser } from "../../common/constants"
import { logger, LogLevel } from "../../common/logger"
import { OnInstalledDetails } from "../../common/types"
import { DEFAULT_EXTENSION_SETTINGS } from "../../common/configuration/types"
import { loadExtensionSettings } from "../helpers"


export class ServiceWorkerRuntimeOnInstalledHandler {

    constructor(private readonly analytics: Analytics) { 
        logger.logServiceWorker("New ServiceWorkerRuntimeOnInstalledHandler", LogLevel.DEBUG, this)

        // ThisBrowser.storage.local.get([SETTINGS_STORAGE_KEY]).then((storageSettings) => {
        //     this.currentExtensionConfig = storageSettings as ExtensionConfiguration
        // }).catch((err) => {
        //     logger.logServiceWorker("Error loading Settings - using Default Settings", LogLevel.ERROR, err)
        //     this.currentExtensionConfig = DEFAULT_EXTENSION_SETTINGS
        // })        
    }

    public handleOnInstalled = async (details: OnInstalledDetails) => {
        logger.logServiceWorker(`ServiceWorkerRuntimeOnInstalledHandler.handleOnInstalled`, LogLevel.DEBUG, details, this)

        chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

        if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
            // Can't rely on messages as this handler is instantiated before Service Worker is guaranteed to be active
            await ThisBrowser.storage.local.set({ [STORAGE_KEY_SETTINGS]: DEFAULT_EXTENSION_SETTINGS }).then(() => {
                logger.logServiceWorker("Installed DEFAULT settings at Extension install", LogLevel.INFO)
                ThisBrowser.tabs.create({ url: 'options.html?install' })
                return this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_INSTALL, {
                    reason: details.reason,
                })
            })
        } else if (details.reason == chrome.runtime.OnInstalledReason.UPDATE) {
            await this.performUpgrade(details.previousVersion ?? '', details.reason).then(() => {
                return this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_UPDATE, {
                    previous_extension_version: details.previousVersion,
                    reason: details.reason,
                })
            })
        } else {
            await this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.BROWSER_UPDATE, {
                reason: details.reason,
            })
        }
    }

    protected async performUpgrade(fromVersion: string, reason: string): Promise<void> {
        logger.logServiceWorker(`Upgrading from ${fromVersion}`, LogLevel.INFO, this, fromVersion, reason)

        const currentExtensionConfig = await loadExtensionSettings()
        let newExtensionConfig = currentExtensionConfig
        let upgraded = false

        if (fromVersion === undefined) {
            // Fresh Install
            newExtensionConfig = DEFAULT_EXTENSION_SETTINGS
            upgraded = true
        } else if (compareVersions('2.9.0', fromVersion) < 1) {
            // Upgrading from 2.9.0 or newer
            if (!(Object.keys(currentExtensionConfig ?? {}).includes('sonatypeNexusRepositoryHosts'))) {
                newExtensionConfig.sonatypeNexusRepositoryHosts = []
            }
            if (!(Object.keys(currentExtensionConfig ?? {}).includes('supportsFirewall'))) {
                newExtensionConfig.supportsFirewall = false
            }
            if (!(Object.keys(currentExtensionConfig ?? {}).includes('supportsLifecycle'))) {
                newExtensionConfig.supportsLifecycle = false
            }
            if (!(Object.keys(currentExtensionConfig ?? {}).includes('supportsLifecycleAlp'))) {
                newExtensionConfig.supportsLifecycleAlp = false
            }
            upgraded = true
        }

        if (upgraded) {
            // Can't rely on messages as this handler is instantiated before Service Worker is guaranteed to be active
            await ThisBrowser.storage.local.set({ [STORAGE_KEY_SETTINGS]: newExtensionConfig }).then(() => {
                this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_CONFIG_UPGRADE, {
                    upgradeResposne: "SUCCESS",
                })
            }).then(() => {
                ThisBrowser.notifications.create({
                    type: 'basic',
                    iconUrl: 'images/Sonatype-platform-icon.png',
                    title: 'Sonatype Platform Extension Upgdated',
                    message: `Upgraded to version ${ThisBrowser.runtime.getManifest().version} - see whats new`,
                    buttons: [{ title: 'See what\'s changed' }],
                    priority: 0
                })
            })
        }
    }
}