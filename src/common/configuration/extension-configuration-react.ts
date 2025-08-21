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
import { PackageURL } from "packageurl-js"
import { ThisBrowser } from "../constants"
import { logger, LogLevel } from "../logger"
import { TabType } from "../types"
import { ExtensionConfigurationState } from "./extension-configuration"

export class ExtensionConfigurationStateReact extends ExtensionConfigurationState {

    public currentPurl: PackageURL
    public currentTab: TabType
    public purlsDiscovered: string[] = []

    protected init = () => {
        logger.logReact('Initialised new ExtensionConfigurationStateReact', LogLevel.DEBUG, this)
    }

    public loadSessionDataForCurrentTab = (): Promise<null> => {
        // Load Purls for this Tab from Session Storage
        return ThisBrowser.tabs.query({ active: true, currentWindow: true }).then((tabs: chrome.tabs.Tab[] | browser.tabs.Tab[]) => {
            [this.currentTab] = tabs
            const sessionKey = `Purls-Tab-${this.currentTab.id}`
            return ThisBrowser.storage.session.get(sessionKey).then((items: object) => {
                logger.logReact('Read Purls from Session Storage for Tab', LogLevel.DEBUG, undefined, this.currentTab?.id, items)
                this.purlsDiscovered = (items[sessionKey] as string).split('~')
                if (this.purlsDiscovered.length > 0) {
                    this.currentPurl = PackageURL.fromString(this.purlsDiscovered.at(0) ?? '')
                }
                return null
            }).catch((err) => {
                logger.logReact('Error reading Purls from Session Storage ', LogLevel.ERROR, err)
                return null
            })
        })
    }

}