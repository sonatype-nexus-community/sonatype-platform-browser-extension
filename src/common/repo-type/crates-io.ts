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
import { PURL_TYPE_CARGO } from "../purl-types"
import { BaseRepo } from "./base"
import { RepositoryId } from "./types"

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

export class CratesIoRepo extends BaseRepo {
    readonly id: RepositoryId = RepositoryId.CRATES_IO
   
    readonly baseUrl: string = 'https://crates.io/crates/'

    readonly purlType: string = PURL_TYPE_CARGO
   
    readonly titleSelector: string = "h1[class*='heading']"
   
    readonly versionPath: string = '{artifactId}/{version}'
   
    readonly pathRegex: RegExp = /^(?<artifactId>[^/#?]*)(\/(?<version>[^/#?]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
   
    readonly versionDomPath: string = 'h1 small'
   
    readonly supportsVersionNavigation: boolean = true
   
    readonly supportsMultiplePurlsPerPage: boolean = false
}