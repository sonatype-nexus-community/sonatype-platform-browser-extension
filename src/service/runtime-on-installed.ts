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
import { Analytics, ANALYTICS_EVENT_TYPES } from '../utils/Analytics'
import { compareVersions } from 'compare-versions'
import { readExtensionConfiguration, updateExtensionConfiguration } from '../messages/SettingsMessages'
import { DEFAULT_EXTENSION_SETTINGS, ExtensionConfiguration } from '../types/ExtensionConfiguration'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export interface OnInstalledDetails {
    id?: string
    previousVersion?: string
    reason: chrome.runtime.OnInstalledReason | browser.runtime.OnInstalledReason
}

export class ExtensionServiceOnInstalled {

    constructor(private readonly analytics: Analytics) { }

    public handleOnInstalled(details: OnInstalledDetails): void {
        logger.logMessage(`ExtensionServiceOnInstalled.handleMessage: `, LogLevel.DEBUG, details)

        if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
            _browser.tabs.create({ url: 'options.html?install' })
            this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_INSTALL, {
                reason: details.reason,
            })
        } else if (details.reason == chrome.runtime.OnInstalledReason.UPDATE) {
            this.performUpgrade(details.previousVersion ?? '', details.reason).then(() => {
                this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_UPDATE, {
                    previous_extension_version: details.previousVersion,
                    reason: details.reason,
                })
            })
        } else {
            this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.BROWSER_UPDATE, {
                reason: details.reason,
            })
        }

        // Handlers are async - so return true
        // return true
    }

    protected async performUpgrade(fromVersion: string, reason: string): Promise<void> {
        logger.logMessage(`Upgrading from ${fromVersion}`, LogLevel.INFO)
        // There was no upgrade of internal data prior to 2.9.1

        if (fromVersion === undefined || compareVersions('2.9.0', fromVersion) < 1) {
            // Upgrading from 2.9.0 or prior
            readExtensionConfiguration()
                .then((response) => {
                    const extensionSettings = response.data as ExtensionConfiguration
                    const newSettings = response.data as ExtensionConfiguration ?? DEFAULT_EXTENSION_SETTINGS
                    if (!(Object.keys(extensionSettings ?? {}).includes('sonatypeNexusRepositoryHosts'))) {
                        newSettings.sonatypeNexusRepositoryHosts = []
                    }
                    if (!(Object.keys(extensionSettings ?? {}).includes('supportsFirewall'))) {
                        newSettings.supportsFirewall = false
                    }
                    if (!(Object.keys(extensionSettings ?? {}).includes('supportsLifecycle'))) {
                        newSettings.supportsLifecycle = false
                    }
                    if (!(Object.keys(extensionSettings ?? {}).includes('supportsLifecycleAlp'))) {
                        newSettings.supportsLifecycleAlp = false
                    }
                    updateExtensionConfiguration(newSettings)
                        .then((upgradeResposne) => {
                            this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_CONFIG_UPGRADE, {
                                upgradeResposne: upgradeResposne.status,
                            })
                        })
                        .then(() => {
                            /**
                             *  @todo Force re-detection of IQ Capabilities here
                             */
                            logger.logMessage(
                                `Automatic re-detection of IQ Capabilities is not yet implemented - please click "Connect" in Options page`,
                                LogLevel.WARN
                            )
                        })
                })
                .then(() => {
                    this.analytics.fireEvent(ANALYTICS_EVENT_TYPES.EXTENSION_UPDATE, {
                        previousVersion: fromVersion,
                        reason: reason,
                    })
                })
        }
    }
}
