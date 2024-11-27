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
import { generatePackageURL } from './PurlUtils'
import { FORMATS, REPOS } from '../Constants'
import { BaseRepo } from '../Types'

export class CocoaPodsOrgRepo extends BaseRepo {
    id(): string {
        return REPOS.cocoaPodsOrg
    }
    format(): string {
        return FORMATS.cocoapods
    }
    baseUrl(): string {
        return 'https://cocoapods.org/pods/'
    }
    titleSelector(): string {
        return 'h1'
    }
    versionPath(): string {
        return '{artifactId}'
    }
    pathRegex(): RegExp {
        return /^(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return 'h1 > span'
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
            return [generatePackageURL(FORMATS.cocoapods, encodeURIComponent(pathResults.groups.artifactId), version)]
        }
        return []
    }
}