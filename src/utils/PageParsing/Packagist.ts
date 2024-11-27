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

import $ from 'cash-dom'
import { PackageURL } from 'packageurl-js'
import { FORMATS, REPOS } from '../Constants'
import { generatePackageURLWithNamespace } from './PurlUtils'
import { BaseRepo } from '../Types'
import { logger, LogLevel } from '../../logger/Logger'

export class PackagistOrgRepo extends BaseRepo {
    id(): string {
        return REPOS.packagistOrg
    }
    format(): string {
        return FORMATS.composer
    }
    baseUrl(): string {
        return 'https://packagist.org/packages/'
    }
    titleSelector(): string {
        return 'h2.title'
    }
    versionPath(): string {
        return '{groupAndArtifactId}#{version}'
    }
    pathRegex(): RegExp {
        return /^(?<groupId>[^/]*)\/(?<artifactId>[^/?#]*)(\?(?<query>([^#]*)))?(#(?<version>(.*)))?$/
    }
    versionDomPath(): string {
        return '#view-package-page .versions-section .title .version-number'
    }
    supportsVersionNavigation(): boolean {
        return true
    }
    supportsMultiplePurlsPerPage(): boolean {
        return false
    }
    
    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults && pathResults.groups) {
            const pageVersion = $(this.versionDomPath()).text().trim()
            logger.logMessage(`URL Version: ${pathResults.groups.version}, Page Version: ${pageVersion}`, LogLevel.DEBUG)
            return [generatePackageURLWithNamespace(
                FORMATS.composer,
                encodeURIComponent(pathResults.groups.artifactId),
                pathResults.groups.version !== undefined ? pathResults.groups.version : pageVersion,
                encodeURIComponent(pathResults.groups.groupId)
            )]
        }
        return []
    }
}
