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
import { BaseRepo } from './Types'
import { DefaultRepoRegistry } from './RepoRegistry'

export interface RepoDetails {
    RepoType: BaseRepo
    RepoBaseUrl: string
}

// @deprecated
export function findRepoType(url: string): RepoDetails | undefined {
    const repo = DefaultRepoRegistry.getRepoForUrl(url)
    if (repo) {
        return {RepoType: repo, RepoBaseUrl: repo.baseUrl()}
    }

    return undefined
}

// const findPublicOssRepoType = (url: string): RepoDetails | undefined => {
//     for (let i = 0; i < REPO_TYPES.length; i++) {
//         const repoType = REPO_TYPES[i]
//         if (url.startsWith(repoType.url)) {
//             logger.logMessage(`Current URL ${url} matches ${repoType.repoID}`, LogLevel.INFO)
//             return repoType
//         } else {
//             logger.logMessage(`Current URL ${url} does not match ${repoType.repoID}`, LogLevel.TRACE)
//         }
//     }
//     return undefined
// }

// function findNxrmRepoType(url: string): Promise<RepoDetails | undefined> {
//     return readExtensionConfiguration().then((response) => {
//         logger.logMessage(`Checking if ${url} matches a configured Sonatype Nexus Repository`, LogLevel.DEBUG)
//         if (response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
//             const extensionConfig = response.data as ExtensionConfiguration
//             if (extensionConfig !== undefined && extensionConfig.sonatypeNexusRepositoryHosts.length > 0) {
//                 for (const nxrmHost of extensionConfig.sonatypeNexusRepositoryHosts) {
//                     logger.logMessage(`Checking ${url} against ${nxrmHost.url}...`, LogLevel.DEBUG)
//                     if (url.startsWith(nxrmHost.url)) {
//                         return {
//                             RepoType: Nxrm3Repo,
//                             RepoBaseUrl: nxrmHost.url
//                         }
//                     }
//                 }
//             }
//         }
//         return undefined
//     })
// }
