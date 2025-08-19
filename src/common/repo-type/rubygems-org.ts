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

export class RubygemsOrgRepo extends BaseRepo {
    readonly id: RepositoryId = RepositoryId.RUBYGEMS_ORG

    readonly format: RepoFormat = RepoFormat.RUBY_GEMS

    readonly baseUrl: string = 'https://rubygems.org/gems/'

    readonly titleSelector: string = 'h1.t-display'

    readonly versionPath: string = '{artifactId}/versions/{version}'

    readonly pathRegex: RegExp = /^(?<artifactId>[^/?#]*)(\/versions\/(?<version>[^?#-]*)-?(?<platform>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/

    readonly versionDomPath: string = '.page__subheading'

    readonly supportsVersionNavigation: boolean = true

    readonly supportsMultiplePurlsPerPage: boolean = false
}