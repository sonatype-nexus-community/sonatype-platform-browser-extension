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
import { BaseRepo } from "./base"
import { RepoFormat, RepositoryId } from "./types"

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

export class NpmJsComRepo extends BaseRepo {
    readonly id: RepositoryId = RepositoryId.NPMJS_COM

    readonly format: RepoFormat = RepoFormat.NPM

    readonly baseUrl: string = 'https://www.npmjs.com/package/'

    readonly titleSelector: string = '#top > div > h2 > span'

    readonly versionPath: string = '{groupAndArtifactId}/v/{version}'

    readonly pathRegex: RegExp = /^((?<groupId>@[^/]*)\/)?(?<artifactId>[^/?#]*)(\/v\/(?<version>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/

    readonly versionDomPath: string = '#top > div:not(.bg-washed-red) > span'

    readonly supportsVersionNavigation: boolean = true

    readonly supportsMultiplePurlsPerPage: boolean = false
}