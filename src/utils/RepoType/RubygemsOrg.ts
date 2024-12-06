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

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

import { FORMATS, REPOS } from '../Constants'
import { BaseRepo } from '../RepoType/BaseRepo'

export class RubygemsOrgRepo extends BaseRepo {
    id(): string {
        return REPOS.rubyGemsOrg
    }
    format(): string {
        return FORMATS.gem
    }
    baseUrl(): string {
        return 'https://rubygems.org/gems/'
    }
    titleSelector(): string {
        return 'h1.t-display'
    }
    versionPath(): string {
        return '{artifactId}/versions/{version}'
    }
    pathRegex(): RegExp {
        return /^(?<artifactId>[^/?#]*)(\/versions\/(?<version>[^?#-]*)-?(?<platform>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return '.page__subheading'
    }
    supportsVersionNavigation(): boolean {
        return true
    }
    supportsMultiplePurlsPerPage(): boolean {
        return false
    }
}
