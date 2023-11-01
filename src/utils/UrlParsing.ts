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
import { RepoType, REPO_TYPES, FORMATS } from './Constants'
import { LogLevel, logger } from '../logger/Logger'
import { readExtensionConfiguration } from '../messages/SettingsMessages'
import { MESSAGE_RESPONSE_STATUS } from '../types/Message'
import { ExtensionConfiguration } from '../types/ExtensionConfiguration'

const findPublicOssRepoType = (url: string): RepoType | undefined => {
    for (let i = 0; i < REPO_TYPES.length; i++) {
        const repoType = REPO_TYPES[i]
        if (url.search(repoType.url) >= 0) {
            logger.logMessage(`Current URL ${url} matches ${repoType.repoID}`, LogLevel.INFO)
            return repoType
        } else {
            logger.logMessage(`Current URL ${url} does not match ${repoType.repoID}`, LogLevel.TRACE)
        }
    }
    return undefined
}

const findRepoType = async (url: string): Promise<RepoType | undefined> => {
    const repoType = findPublicOssRepoType(url)

    if (repoType !== undefined) {
        return repoType
    }

    return await findNxrmRepoType(url)
}

function findNxrmRepoType(url: string): Promise<RepoType | undefined> {
    return readExtensionConfiguration().then((response) => {
        logger.logMessage(`Checking if ${url} matches a configured Sonatype Nexus Repository`, LogLevel.DEBUG)
        if (response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
            const extensionConfig = response.data as ExtensionConfiguration
            if (extensionConfig !== undefined && extensionConfig.sonatypeNexusRepositoryHosts.length > 0) {
                for (const nxrmHost of extensionConfig.sonatypeNexusRepositoryHosts) {
                    logger.logMessage(`Checking ${url} against ${nxrmHost.url}...`, LogLevel.DEBUG)
                    if (url.startsWith(nxrmHost.url)) {
                        return {
                            url: nxrmHost.url,
                            repoFormat: FORMATS.NXRM,
                            repoID: `NXRM-${nxrmHost.id}`,
                            titleSelector: "[id^='nx-coreui-component-componentassetinfo'][id$='header-title-textEl']",
                            versionPath: '',
                            pathRegex: /^$/,
                            versionDomPath: '',
                            supportsVersionNavigation: false
                        }
                    }
                }
            }
        }
        return undefined
    })
}

export { findPublicOssRepoType, findRepoType }
