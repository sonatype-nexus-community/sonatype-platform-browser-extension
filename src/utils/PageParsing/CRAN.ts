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
import { generatePackageURL } from './PurlUtils'
import { BaseRepo } from '../Types'

export class CranRRepo extends BaseRepo {
    id(): string {
        return REPOS.cranRProject
    }
    format(): string {
        return FORMATS.cran
    }
    baseUrl(): string {
        return 'https://cran.r-project.org/'
    }
    titleSelector(): string {
        return 'h2'
    }
    versionPath(): string {
        return 'web/packages/{artifactId}/index.html'
    }
    pathRegex(): RegExp {
        return /^web\/packages\/(?<artifactId>[^/]*)\/index\.html(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return 'table tr:nth-child(1) td:nth-child(2)'
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
            const version = $(this.versionDomPath()).first().text().trim()
            return [generatePackageURL(FORMATS.cran, encodeURIComponent(pathResults.groups.artifactId), version)]
        }
        return []
    }
}