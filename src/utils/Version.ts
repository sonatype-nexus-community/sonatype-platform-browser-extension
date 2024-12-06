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
import { DefaultRepoRegistry } from "./RepoRegistry"

/**
 * Attempts to calculate the URL to the newVersion (if supplied). Returns the currentUrl
 * where either no newVersion is supplied or the OSS Registry in question is defined as
 * not supporting navigation to specific versions.
 *
 * @param currentUrl
 * @param currentPurl
 * @param newVersion
 * @returns
 */
export function getNewSelectedVersionUrl(currentUrl: URL, currentPurl: PackageURL, newVersion?: string): URL {
    let nextUrl = currentUrl.toString()
    if (newVersion !== undefined) {
        const repoType = DefaultRepoRegistry.getRepoForUrl(currentUrl.toString())

        if (repoType !== undefined) {
            let groupAndArtifactId = `${currentPurl.namespace}/${currentPurl.name}`
            if (currentPurl.namespace === undefined || currentPurl.namespace === null) {
                groupAndArtifactId = currentPurl.name
            }
            const mapUrlReplacements = {
                '{artifactId}': currentPurl.name,
                '{groupAndArtifactId}': groupAndArtifactId,
                '{groupId}': currentPurl.namespace,
                '{version}': newVersion
            }
            if (currentPurl.qualifiers && 'extension' in currentPurl.qualifiers) {
                mapUrlReplacements['{extension}'] = currentPurl.qualifiers['extension']
            }

            const re = new RegExp(Object.keys(mapUrlReplacements).join('|'), 'gi')
            const nextUrlPath = repoType.versionPath().replace(re, (matched) => mapUrlReplacements[matched])
            nextUrl = `${repoType.baseUrl()}${nextUrlPath}`
        }
    }
    return new URL(nextUrl)
}
