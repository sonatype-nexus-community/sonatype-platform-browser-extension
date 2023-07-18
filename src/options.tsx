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
import { MESSAGE_REQUEST_TYPE } from './types/Message'
import { readExtensionConfiguration } from './messages/SettingsMessages'
import Options from './components/Options/Options'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

const container = document.getElementById('ui')
const root = ReactDOM.createRoot(container)

root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
_browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    logger.logMessage('Options Request received', LogLevel.INFO, request)

    switch (request.type) {
        case MESSAGE_REQUEST_TYPE.GET_SETTINGS:
            readExtensionConfiguration().then((response) => {
                sendResponse(response)
            })
            break
    }
})
