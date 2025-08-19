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
import { logger, LogLevel } from "../logger"
import { DefaultPageParserRegistry } from "../page-parsing/registry"
import { Nxrm3PageParser } from "../page-parsing/nxrm3"
import { DefaultRepoRegistry } from "../repo-registry"
import { ExtensionConfigurationState } from "./extension-configuration"

export class ExtensionConfigurationStateContentScript extends ExtensionConfigurationState {

    protected init = () => { 
        logger.logContent('Initialised new ExtensionConfigurationStateContentScript', LogLevel.DEBUG)
    }

    protected postNxrmServerRegistrations = () => {
        if (this.extensionConfig.sonatypeNexusRepositoryHosts.length > 0) {
            logger.logContent('Ensuring Page Parsers are registered for NXRM Hosts...', LogLevel.DEBUG, DefaultPageParserRegistry.getCount())
            this.extensionConfig.sonatypeNexusRepositoryHosts.forEach((nxrmHost) => {
                DefaultPageParserRegistry.registerPageParser(
                    new Nxrm3PageParser(DefaultRepoRegistry.getRepoById(nxrmHost.id))
                )
                logger.logContent('   Registered NXRM3 Page Parser', LogLevel.DEBUG, nxrmHost, DefaultPageParserRegistry.getCount())
            })
        }
    }

}