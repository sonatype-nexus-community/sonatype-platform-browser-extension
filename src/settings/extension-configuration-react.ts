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

import { logger, LogLevel } from "../logger/Logger"
import { ExtensionConfigurationStateContentScript } from "./extension-configuration-cs"

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export class ExtensionConfigurationStateReact extends ExtensionConfigurationStateContentScript {

    public purlsDiscovered: string[] = []

    protected init(): void {
        logger.logMessage('Initialised new React Context for Extension', LogLevel.DEBUG)
    }

    public async loadSessionDataForCurrentTab(): Promise<void> {
        // Load Purls for this Tab from Session Storage
        return _browser.tabs.query({ active: true, currentWindow: true }).then((tabs: chrome.tabs.Tab[] | browser.tabs.Tab[]) => {
            const [currentTab] = tabs
            const sessionKey = `Purls-Tab-${currentTab.id}`
            return _browser.storage.session.get(sessionKey).then((items: object) => {
                logger.logMessage('Read Purls from Session Storage for Tab', LogLevel.DEBUG, currentTab.id, items)
                this.purlsDiscovered = items[sessionKey]
            }).catch((err) => {
                logger.logMessage('Error reading Purls from Session Storage ', LogLevel.ERROR, err)
            })
        })
    }

}