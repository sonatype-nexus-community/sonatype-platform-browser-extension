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
import { ThisBrowser } from "../constants"
import { logger, LogLevel } from "../logger"
import { ContentScripts } from "../types"
import { ExtensionConfigurationState } from "./extension-configuration"

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

export class ExtensionConfigurationStateServiceWorker extends ExtensionConfigurationState {

    protected init = () => { 
        logger.logServiceWorker('Initialised new ExtensionConfigurationStateServiceWorker', LogLevel.DEBUG)
    }

    protected postNxrmServerRegistrations = () => {
        // if (this.extensionConfig.sonatypeNexusRepositoryHosts.length > 0) {
        //     const allNxrmHostsForContentScript: string[] = []
        //     this.extensionConfig.sonatypeNexusRepositoryHosts.forEach(nxrmHost => {
        //         allNxrmHostsForContentScript.push(nxrmHost.url + '*')
        //     })

        //     logger.logServiceWorker('Ensuring Content Scripts are registered for NXRM Hosts...', LogLevel.DEBUG)
        //     ThisBrowser.scripting.getRegisteredContentScripts({ ids: ['content'] }).then((scripts: ContentScripts[]) => {
        //         if (scripts.length == 0) {
        //             return ThisBrowser.scripting.registerContentScripts([
        //                 {
        //                     id: 'content',
        //                     css: ['/css/pagestyle.css'],
        //                     js: ['/static/js/content.js'],
        //                     matches: allNxrmHostsForContentScript,
        //                     runAt: 'document_end',
        //                     world: 'ISOLATED',
        //                 },
        //             ])
        //         } else {
        //             return ThisBrowser.scripting.updateContentScripts([
        //                 {
        //                     id: 'content',
        //                     css: ['/css/pagestyle.css'],
        //                     js: ['/static/js/content.js'],
        //                     matches: allNxrmHostsForContentScript,
        //                     runAt: 'document_end',
        //                     world: 'ISOLATED',
        //                 },
        //             ])
        //         }
        //     })
        //         .then(() => logger.logServiceWorker('Content Scripts successfully registered for NXRM Hosts', LogLevel.DEBUG))
        //         .catch((err) => logger.logServiceWorker('Content Scripts NOT successfully registered for NXRM Hosts', LogLevel.DEBUG, err))
        // }
    }
}