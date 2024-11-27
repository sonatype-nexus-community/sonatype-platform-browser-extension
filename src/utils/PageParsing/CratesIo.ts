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
import { logger, LogLevel } from '../../logger/Logger'
import { generatePackageURLComplete } from './PurlUtils'
import { FORMATS, REPOS } from '../Constants'
import { BaseRepo } from '../Types'

export class CratesIoRepo extends BaseRepo {
    id(): string {
        return REPOS.cratesIo
    }
    format(): string {
        return FORMATS.cargo
    }
    baseUrl(): string {
        return 'https://crates.io/crates/'
    }
    titleSelector(): string {
        return "h1[class*='heading']"
    }
    versionPath(): string {
        return '{artifactId}/{version}'
    }
    pathRegex(): RegExp {
        return /^(?<artifactId>[^/#?]*)(\/(?<version>[^/#?]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return 'h1 small'
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
            return [generatePackageURLComplete(
                FORMATS.cargo,
                encodeURIComponent(pathResults.groups.artifactId),
                pathResults.groups.version !== undefined ? pathResults.groups.version : pageVersion.replace('v', ''),
                undefined,
                {},
                undefined
            )]
        }
        return []
    }
}