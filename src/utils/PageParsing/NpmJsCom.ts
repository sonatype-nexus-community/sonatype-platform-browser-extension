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
import { generatePackageURLWithNamespace } from './PurlUtils'
import { FORMATS, REPOS } from '../Constants'
import { stripHtmlComments } from '../Helpers'
import { BaseRepo } from '../Types'

export class NpmJsComRepo extends BaseRepo {
    id(): string {
        return REPOS.npmJsCom
    }
    format(): string {
        return FORMATS.npm
    }
    baseUrl(): string {
        return 'https://www.npmjs.com/package/'
    }
    titleSelector(): string {
        return '#top > div > h2 > span'
    }
    versionPath(): string {
        return '{groupAndArtifactId}/v/{version}'
    }
    pathRegex(): RegExp {
        return /^((?<groupId>@[^/]*)\/)?(?<artifactId>[^/?#]*)(\/v\/(?<version>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return '#top > div:not(.bg-washed-red) > span'
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
            const pageVersion = stripHtmlComments($(this.versionDomPath()).first().text()).split('•')[0].trim()

            return [generatePackageURLWithNamespace(
                FORMATS.npm,
                pathResults.groups.artifactId,
                pathResults.groups.version !== undefined ? pathResults.groups.version : pageVersion,
                pathResults.groups.groupId
            )]
        }
        return []
    }
}
