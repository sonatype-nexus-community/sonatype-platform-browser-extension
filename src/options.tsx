/* eslint @typescript-eslint/no-var-requires: "off" */
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
import { logger, LogLevel } from './logger/Logger'
import { readExtensionConfiguration } from './messages/SettingsMessages'
import Options from './components/Options/Options'
import { ExtensionConfigurationStateReact } from './settings/extension-configuration-react'
import { ExtensionConfiguration } from './types/ExtensionConfiguration'
import { ExtensionConfigurationContext } from './context/ExtensionConfigurationContext'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser
const extension = _browser.runtime.getManifest()

readExtensionConfiguration().then((response) => {
    logger.logMessage(`Options Page has loaded Extension Config`, LogLevel.WARN, response)
    const extensionConfigurationContainer = new ExtensionConfigurationStateReact(response.data as ExtensionConfiguration)
    const container = document.getElementById('ui')
    const root = ReactDOM.createRoot(container)

    window.document.title = extension.name

    root.render(
        <React.StrictMode>
            <ExtensionConfigurationContext.Provider value={extensionConfigurationContainer}>
                <Options/>
            </ExtensionConfigurationContext.Provider>
        </React.StrictMode>
    )
})
