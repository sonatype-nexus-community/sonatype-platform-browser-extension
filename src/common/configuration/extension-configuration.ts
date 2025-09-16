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

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

import { Analytics } from '../analytics/analytics'
import { logger, LogLevel } from '../logger'
import { DefaultRepoRegistry } from '../repo-registry'
import { ExtensionConfiguration } from './types'

export abstract class ExtensionConfigurationState {

    constructor(protected extensionConfig: ExtensionConfiguration, protected analytics?: Analytics) {
        this.init()
        this.ensureCorrectLogLevel()
        this.ensureNxrmServersRegistered()
    }

    public getAnalytics = (): Analytics => {
        return this.analytics ?? new Analytics()
    }

    public getExtensionConfig = (): ExtensionConfiguration => {
        return this.extensionConfig
    }

    public setExtensionConfig = (config: ExtensionConfiguration) => {
        logger.logGeneral('Set new Extension Config in State', LogLevel.DEBUG, config)
        this.extensionConfig = config
        this.ensureCorrectLogLevel()
        this.ensureNxrmServersRegistered()
    } 

    public handleStorageOnChanged = (changes: { [key: string]: browser.storage.StorageChange; }, areaName: string) => {
        if (areaName == 'local') {
            logger.logGeneral(`ExtensionConfigurationState.handleStorageOnChanged: `, LogLevel.TRACE, changes, areaName)
            if (Object.keys(changes).includes('settings')) {
                this.setExtensionConfig(changes['settings']['newValue'] as ExtensionConfiguration)
            } else {
                logger.logGeneral(`ExtensionConfigurationState Ignoring storage change: `, LogLevel.TRACE, Object.keys(changes))
            }
        }
    }

    protected init = () => { }

    protected ensureCorrectLogLevel = () => {
        logger.logGeneral("Setting LogLevel", LogLevel.INFO, this.extensionConfig.logLevel)
        logger.setLevel(this.extensionConfig.logLevel)
    }

    protected ensureNxrmServersRegistered = () => {
        const externalRepoManagerIds = Object.keys(this.extensionConfig.externalRepositoryManagers)
        if (externalRepoManagerIds.length > 0) {
            logger.logGeneral("ExtensionConfigurationState.ensureNxrmServersRegistered handling registered External Repository Managers", LogLevel.DEBUG)

            externalRepoManagerIds.forEach((i) => {
                DefaultRepoRegistry.registerExternalRepositoryManager(this.extensionConfig.externalRepositoryManagers[i])
            })
        }
        this.postNxrmServerRegistrations()
    }

    protected postNxrmServerRegistrations = () => { }
}
