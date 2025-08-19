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
import { ExtensionConfiguration, DEFAULT_EXTENSION_SETTINGS } from "../common/configuration/types"
import { ThisBrowser, STORAGE_KEY_SETTINGS, STORAGE_KEY_TABS, STORAGE_KEY_VULNERABILITIES } from "../common/constants"
import { DEFAULT_TABS_DATA, DEFAULT_VULNERABILITY_DATA, ExtensionTabsData, ExtensionVulnerabilitiesData } from "../common/data/types"
import { ExtensionError } from "../common/error"
import { logger, LogLevel } from "../common/logger"

export async function loadExtensionSettings(): Promise<ExtensionConfiguration> {
  try {
    const storageSettings = await ThisBrowser.storage.local.get([STORAGE_KEY_SETTINGS])
    if (ThisBrowser.runtime.lastError) {
      logger.logServiceWorker("Failed reading local storage", LogLevel.ERROR)
      Promise.reject(new ExtensionError('Failed reading Extension Settings from local storage'))
    }
    logger.logServiceWorker("Read Settings from Local Storage", LogLevel.DEBUG, storageSettings)
    return storageSettings.settings as ExtensionConfiguration
  } catch (err) {
    logger.logServiceWorker("Error loading Settings - using Default Settings", LogLevel.ERROR, err)
    return DEFAULT_EXTENSION_SETTINGS
  }
}

export async function loadExtensionDataAndSettings(): Promise<{ settings: ExtensionConfiguration, tabsData: ExtensionTabsData, vulnerabilityData: ExtensionVulnerabilitiesData }> {
  try {
    const localStorage = await ThisBrowser.storage.local.get([STORAGE_KEY_SETTINGS, STORAGE_KEY_TABS, STORAGE_KEY_VULNERABILITIES])
    if (ThisBrowser.runtime.lastError) {
      logger.logServiceWorker("Failed reading local storage", LogLevel.ERROR)
      Promise.reject(new ExtensionError('Failed reading Extension Data and Settings from local storage'))
    }
    logger.logServiceWorker("Read Data & Settings from Local Storage", LogLevel.DEBUG, localStorage)
    return {
      settings: localStorage.settings as ExtensionConfiguration,
      tabsData: localStorage.tabs as ExtensionTabsData || DEFAULT_TABS_DATA,
      vulnerabilityData: localStorage.vulnerabilityData as ExtensionVulnerabilitiesData || DEFAULT_VULNERABILITY_DATA
    }
  } catch (err) {
    logger.logServiceWorker("Error loading Data & Settings - using Default Data", LogLevel.ERROR, err)
    return {
      settings: DEFAULT_EXTENSION_SETTINGS,
      tabsData: DEFAULT_TABS_DATA,
      vulnerabilityData: DEFAULT_VULNERABILITY_DATA
    }
  }
}