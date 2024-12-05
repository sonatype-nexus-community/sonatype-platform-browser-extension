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

import { logger, LogLevel } from "../logger/Logger"
import { ExtensionConfigurationState } from "./extension-configuration"

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export class ExtensionConfigurationStateServiceWorker extends ExtensionConfigurationState {

    protected postNxrmServerRegistrations(): void {
        if (this.extensionConfig.sonatypeNexusRepositoryHosts.length > 0) {
            const allNxrmHostsForContentScript: string[] = []
            this.extensionConfig.sonatypeNexusRepositoryHosts.forEach(nxrmHost => {
                allNxrmHostsForContentScript.push(nxrmHost.url + '*')
            })

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
                            world: 'ISOLATED',
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
                            world: 'ISOLATED',
                        },
                    ])
                }
            })
                .then(() => logger.logMessage('Content Scripts successfully registered for NXRM Hosts', LogLevel.DEBUG))
                .catch((err) => logger.logMessage('Content Scripts NOT successfully registered for NXRM Hosts', LogLevel.DEBUG, err))
        }
    }
}