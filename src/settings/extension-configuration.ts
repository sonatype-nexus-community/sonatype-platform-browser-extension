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
import { ExtensionConfiguration } from '../types/ExtensionConfiguration'
import { DefaultRepoRegistry } from '../utils/RepoRegistry'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export class ExtensionConfigurationState {

    constructor(private extensionConfig: ExtensionConfiguration) {
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
            const allNxrmHostsForContentScript: string[] = []
            this.extensionConfig.sonatypeNexusRepositoryHosts.forEach((nxrmHost) => {
                logger.logMessage(`Ensuring NXRM Server is registered`, LogLevel.DEBUG, nxrmHost)
                DefaultRepoRegistry.registerNxrm3(nxrmHost)
                allNxrmHostsForContentScript.push(nxrmHost.url + '*')
            })

            if (_browser.scripting !== undefined && this.extensionConfig.sonatypeNexusRepositoryHosts.length > 0) {
                // DO NOT RUN IN CONTENT-SCRIPTS - no access to _browser.scripting
                logger.logMessage('Ensuring Content Scripts are registered for NXRM Hosts...', LogLevel.DEBUG)
                _browser.scripting.getRegisteredContentScripts().then((scripts) => { // { ids: ['content'] }
                    if (scripts.length == 0) {
                        return _browser.scripting.registerContentScripts([
                            {
                                id: 'content',
                                css: ['/css/pagestyle.css'],
                                js: ['/static/js/content.js'],
                                matches: allNxrmHostsForContentScript,
                                runAt: 'document_end',
                                world: 'MAIN',
                            },
                        ])
                    } else {
                        return _browser.scripting.updateContentScripts([
                            {
                                id: 'content',
                                css: ['/css/pagestyle.css'],
                                js: ['/static/js/content.js'],
                                matches: allNxrmHostsForContentScript,
                                runAt: 'document_end',
                                world: 'MAIN',
                            },
                        ])
                    }
                })
                    .then(() => logger.logMessage('Content Scripts successfully registered for NXRM Hosts', LogLevel.DEBUG))
                    .catch((err) => logger.logMessage('Content Scripts NOT successfully registered for NXRM Hosts', LogLevel.DEBUG, err))
            }
        }
    }
}
