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
import { PURL_TYPE_CRAN } from "../purl-types"
import { BaseRepo } from "./base"
import { RepositoryId } from "./types"

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

export class CranRProjectOrg extends BaseRepo {
    readonly id: RepositoryId = RepositoryId.CRAN_R_PROJECT_ORG

    readonly baseUrl: string = 'https://cran.r-project.org/'
    
    readonly purlType: string = PURL_TYPE_CRAN

    readonly titleSelector: string = 'h2'

    readonly versionPath: string = 'web/packages/{artifactId}/index.html'

    readonly pathRegex: RegExp = /^web\/packages\/(?<artifactId>[^/]*)\/index\.html(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/

    readonly versionDomPath: string = 'table tr:nth-child(1) td:nth-child(2)'

    readonly supportsVersionNavigation: boolean = false

    readonly supportsMultiplePurlsPerPage: boolean = false
}