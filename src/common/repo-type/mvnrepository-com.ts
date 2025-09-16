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
import { PURL_TYPE_MAVEN } from "../purl-types"
import { BaseRepo } from "./base"
import { RepositoryId } from "./types"

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

export class MvnRepositoryComRepo extends BaseRepo {
    readonly id: RepositoryId = RepositoryId.MVNREPOSITORY_COM

    readonly baseUrl: string = 'https://mvnrepository.com/artifact/'
    
    readonly purlType: string = PURL_TYPE_MAVEN

    readonly titleSelector: string = 'h2.im-title'

    readonly versionPath: string = '{groupId}/{artifactId}/{version}'

    readonly pathRegex: RegExp = /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)\/(?<version>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/

    readonly versionDomPath: string = ''

    readonly supportsVersionNavigation: boolean = true

    readonly supportsMultiplePurlsPerPage: boolean = false
}