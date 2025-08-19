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

export class RepoMavenApacheOrgRepo extends BaseRepo {
    readonly id: RepositoryId = RepositoryId.REPO_MAVEN_APACHE_ORG

    readonly format: RepoFormat = RepoFormat.MAVEN

    readonly baseUrl: string = 'https://repo.maven.apache.org/maven2/'

    readonly titleSelector: string = 'h1'

    readonly versionPath: string = '{groupId}/{artifactId}/{version}'

    readonly pathRegex: RegExp = /^(?<groupArtifactId>([^#?&]+)+)\/(?<version>[^/#&?]+)\/?(\?(?<query>([^#]+)))?(#(?<fragment>(.*)))?/

    readonly versionDomPath: string = ''

    readonly supportsVersionNavigation: boolean = false

    readonly supportsMultiplePurlsPerPage: boolean = false
}