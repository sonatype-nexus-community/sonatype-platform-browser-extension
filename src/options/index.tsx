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
import { createRoot } from 'react-dom/client'
import { ExtensionConfiguration } from '../common/configuration/types'
import { ThisBrowser } from '../common/constants'
import { ExtensionConfigurationContext } from '../common/context/extension-configuration'
import { logger, LogLevel } from '../common/logger'
import { MessageRequestType } from '../common/message/constants'
import { MessageRequestExtensionConfigurationUpdated } from '../common/message/types'
import OptionsPage from './components/options-page'

// Load Configuration
const domNode = document.getElementById('root')
const root = createRoot(domNode!)

// Re-render when Extension Configuration changes
ThisBrowser.runtime.connect({name: "OPTIONS-PAGE"}).onMessage.addListener((
    request: MessageRequestExtensionConfigurationUpdated
) => { 
    if (request.messageType === MessageRequestType.EXTENSION_CONFIGURATION_UPDATED) {
        logger.setLevel(request.newExtensionConfig.logLevel as number)
        logger.logReact("[OPTIONS] Received new Extension Configuration", LogLevel.DEBUG, request.newExtensionConfig)
        root.render(
            <MyOptionsPage extensionConfiguration={request.newExtensionConfig}/>
        )
    }
})

function MyOptionsPage(props: Readonly<{ extensionConfiguration: ExtensionConfiguration }>) {
    return (
        <ExtensionConfigurationContext value={props.extensionConfiguration}>
            <OptionsPage />
        </ExtensionConfigurationContext>
    )
}