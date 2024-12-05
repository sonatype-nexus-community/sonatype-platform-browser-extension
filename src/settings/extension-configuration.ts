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

import { logger, LogLevel } from '../logger/Logger'
import { ExtensionConfiguration } from '../types/ExtensionConfiguration'
import { DefaultRepoRegistry } from '../utils/RepoRegistry'

export abstract class ExtensionConfigurationState {

    constructor(protected extensionConfig: ExtensionConfiguration) {
        this.ensureNxrmServersRegistered()
    }

    public handleStorageOnChanged(changes: object, areaName: string): void {
        if (areaName == 'local') {
            logger.logMessage(`ExtensionConfigurationState.handleStorageOnChanged: `, LogLevel.TRACE, changes, areaName)
            if (Object.keys(changes).includes('settings')) {
                this.extensionConfig = changes['settings']['newValue'] as ExtensionConfiguration
                logger.logMessage(`ExtensionConfigurationState - State is now:`, LogLevel.DEBUG, this.extensionConfig)
                this.ensureNxrmServersRegistered()
            } else {
                logger.logMessage(`Ignoring storage change: `, LogLevel.TRACE, Object.keys(changes))
            }
        }
    }

    protected ensureNxrmServersRegistered(): void {
        if (this.extensionConfig !== undefined) {
            this.extensionConfig.sonatypeNexusRepositoryHosts.forEach((nxrmHost) => {
                logger.logMessage(`Ensuring NXRM Server is registered`, LogLevel.DEBUG, nxrmHost)
                DefaultRepoRegistry.registerNxrm3(nxrmHost)
            })

            this.postNxrmServerRegistrations()
        }
    }

    protected abstract postNxrmServerRegistrations(): void
}
