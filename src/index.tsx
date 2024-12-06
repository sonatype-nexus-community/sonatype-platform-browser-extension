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
import React from 'react'
import ReactDOM from 'react-dom/client'
import ExtensionPopup from './components/Popup/ExtensionPopup'
import { UI_MODE, UiContext } from './context/UiContext'
import { ExtensionConfigurationContext } from './context/ExtensionConfigurationContext'
import { logger, LogLevel } from './logger/Logger'
import { readExtensionConfiguration } from './messages/SettingsMessages'
import { ExtensionConfigurationStateReact } from './settings/extension-configuration-react'
import { DEFAULT_EXTENSION_SETTINGS, ExtensionConfiguration } from './types/ExtensionConfiguration'

/**
 * This is the UI that appears in the Extension Popup or Side Panel.
 */
readExtensionConfiguration().then((response) => {
    logger.logMessage(`Extension Popup has loaded Extension Config`, LogLevel.DEBUG, response)
    const extensionConfigurationContainer = new ExtensionConfigurationStateReact(response.data as ExtensionConfiguration ?? DEFAULT_EXTENSION_SETTINGS)

    extensionConfigurationContainer.loadSessionDataForCurrentTab().then(() => { 
        const container = document.getElementById('ui')
        const root = ReactDOM.createRoot(container)
        root.render(
            <React.StrictMode>
                <ExtensionConfigurationContext.Provider value={extensionConfigurationContainer}>
                    <UiContext.Provider value={UI_MODE.POPUP}>
                        <ExtensionPopup />
                    </UiContext.Provider>
                </ExtensionConfigurationContext.Provider>
            </React.StrictMode>
        )
    })
    
})