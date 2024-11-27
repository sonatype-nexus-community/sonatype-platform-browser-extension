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

import { PackageURL } from 'packageurl-js'
import { generatePackageURLComplete } from './PurlUtils'
import { FORMATS, REPOS } from '../Constants'
import { BaseRepo } from '../Types'

export class RepoMavenApacheOrgRepo extends BaseRepo {
    id(): string {
        return REPOS.repoMavenApacheOrg
    }
    format(): string {
        return FORMATS.maven
    }
    baseUrl(): string {
        return 'https://repo.maven.apache.org/maven2/'
    }
    titleSelector(): string {
        return 'h1'
    }
    versionPath(): string {
        return '{groupId}/{artifactId}/{version}'
    }
    pathRegex(): RegExp {
        return /^(?<groupArtifactId>([^#?&]*)+)\/(?<version>[^/#&?]+)\/?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?/
    }
    versionDomPath(): string {
        return ''
    }
    supportsVersionNavigation(): boolean {
        return false
    }
    supportsMultiplePurlsPerPage(): boolean {
        return false
    }
    
    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults && pathResults.groups) {
            if (pathResults.groups.version !== undefined) {
                const gaParts = pathResults.groups.groupArtifactId.trim().split('/')
                const artifactId = gaParts.pop()
                const groupId = gaParts.join('.')
                return [generatePackageURLComplete(
                    FORMATS.maven,
                    encodeURIComponent(artifactId as string),
                    encodeURIComponent(pathResults.groups.version),
                    encodeURIComponent(groupId),
                    { type: 'jar' },
                    undefined
                )]
            }
        }
        return []
    }
}
