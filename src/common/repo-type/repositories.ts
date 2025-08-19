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

import { RepoFormat, RepositoryId, RepoType } from "./types"

export const SUPPORTED_REPOSITORIES: RepoType[] = [
    {
        id: RepositoryId.PKGS_ALPINELINUX_ORG_PACKAGE,
        format: RepoFormat.ALPINE,
        baseUrl: 'https://pkgs.alpinelinux.org/package/',
        titleSelector: 'th.header ~ td',
        versionPath: '',
        pathRegex:
            /^(?<releaseName>[^/]*)\/(?<releaseFeed>[^/]*)\/(?<architecture>[^/]*)\/(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '#package > tbody > tr:nth-child(2) > td',
        supportsVersionNavigation: false
    },
    {
        id: RepositoryId.COCOAPODS_ORG,
        format: RepoFormat.COCOAPODS,
        baseUrl: 'https://cocoapods.org/pods/',
        titleSelector: 'h1',
        versionPath: '{artifactId}',
        pathRegex: /^(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'h1 > span',
        supportsVersionNavigation: false
    },
    {
        id: RepositoryId.CONAN_IO_CENTER,
        format: RepoFormat.CONAN,
        baseUrl: 'https://conan.io/center/recipes/',
        titleSelector: 'h1',
        versionPath: '{artifactId}?version={version}',
        pathRegex: /^(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'h1',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.CRAN_R_PROJECT_ORG,
        format: RepoFormat.CRAN,
        baseUrl: 'https://cran.r-project.org/',
        titleSelector: 'h2',
        versionPath: 'web/packages/{artifactId}/index.html',
        pathRegex: /^web\/packages\/(?<artifactId>[^/]*)\/index\.html(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'table tr:nth-child(1) td:nth-child(2)',
        supportsVersionNavigation: false
    },
    {
        id: RepositoryId.CRATES_IO,
        format: RepoFormat.CARGO,
        baseUrl: 'https://crates.io/crates/',     
        titleSelector: "H1[class*='heading']",
        versionPath: '{artifactId}/{version}', // https://crates.io/crates/claxon/0.4.0
        pathRegex: /^(?<artifactId>[^/#?]*)(\/(?<version>[^/#?]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'h1 small',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.PKG_GO_DEV,
        format: RepoFormat.GOLANG,
        baseUrl: 'https://pkg.go.dev/',
        titleSelector: 'body > main > header > div.go-Main-headerContent > div.go-Main-headerTitle.js-stickyHeader > h1',
        versionPath: '{groupAndArtifactId}/@{version}',
        pathRegex:
            /^(?<groupId>.+)\/(?<artifactId>[^/]*)\/(?<version>v[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: false
    },
    {
        id: RepositoryId.CENTRAL_SONATYPE_COM,
        format: RepoFormat.MAVEN,
        baseUrl: 'https://central.sonatype.com/artifact/',
        titleSelector: 'h1',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex:
            /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)\/(?<version>[^/#?]*)(\/[^#?]*)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.REPO_MAVEN_APACHE_ORG,
        format: RepoFormat.MAVEN,
        baseUrl: 'https://repo.maven.apache.org/maven2/',
        titleSelector: 'h1',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex:
            /^(?<groupArtifactId>([^#?&]*)+)\/(?<version>[^/#&?]+)?\/?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?/,
        versionDomPath: '',
        supportsVersionNavigation: false
    },
    {
        id: RepositoryId.REPO1_MAVEN_ORG,
        format: RepoFormat.MAVEN,
        baseUrl: 'https://repo1.maven.org/maven2/',
        titleSelector: 'h1',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex:
            /^(?<groupArtifactId>([^#?&]*)+)\/(?<version>[^/#&?]+)\/?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?/,
        versionDomPath: '',
        supportsVersionNavigation: false
    },
    {
        id: RepositoryId.SEARCH_MAVEN_ORG,
        format: RepoFormat.MAVEN,
        baseUrl: 'https://search.maven.org/artifact/',
        titleSelector: '.artifact-title',
        versionPath: '{groupId}/{artifactId}/{version}/{extension}',
        pathRegex:
            /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)(\/(?<version>[^/#?]*)\/(?<type>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.MVNREPOSITORY_COM,
        format: RepoFormat.MAVEN,
        baseUrl: 'https://mvnrepository.com/artifact/',
        titleSelector: 'h2.im-title',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex: /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)\/(?<version>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.NPMJS_COM,
        format: RepoFormat.NPM,
        baseUrl: 'https://www.npmjs.com/package/',
        titleSelector: '#top > div > h2 > span',
        versionPath: '{groupAndArtifactId}/v/{version}',
        pathRegex: /^((?<groupId>@[^/]*)\/)?(?<artifactId>[^/?#]*)(\/v\/(?<version>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '#top > div:not(.bg-washed-red) > span',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.NUGET_ORG,
        format: RepoFormat.NUGET,
        baseUrl: 'https://www.nuget.org/packages/',
        titleSelector: '.package-title > h1',
        versionPath: '{artifactId}/{version}',
        pathRegex: /^(?<artifactId>[^/?#]*)\/?((?<version>[^/?#]*)\/?)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'span.version-title',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.PACKAGIST_ORG,
        format: RepoFormat.COMPOSER,
        baseUrl: 'https://packagist.org/packages/',
        titleSelector: 'h2.title',
        versionPath: '{groupAndArtifactId}#{version}',
        pathRegex: /^(?<groupId>[^/]*)\/(?<artifactId>[^/?#]*)(\?(?<query>([^#]*)))?(#(?<version>(.*)))?$/,
        versionDomPath: '#view-package-page .versions-section .title .version-number',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.PYPI_ORG,
        format: RepoFormat.PYPI,
        baseUrl: 'https://pypi.org/project/',
        titleSelector: 'h1.package-header__name',
        versionPath: '{artifactId}/{version}',
        pathRegex: /^(?<artifactId>[^/?#]*)\/((?<version>[^?#]*)\/)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '#content > div.banner > div > div.package-header__left > h1',
        supportsVersionNavigation: true
    },
    {
        id: RepositoryId.RUBYGEMS_ORG,
        format: RepoFormat.RUBY_GEMS,
        baseUrl: 'https://rubygems.org/gems/',
        titleSelector: 'h1.t-display',
        versionPath: '{artifactId}/versions/{version}',
        pathRegex: /^(?<artifactId>[^/?#]*)(\/versions\/(?<version>[^?#-]*)-?(?<platform>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '.page__subheading',
        supportsVersionNavigation: true
    }
]