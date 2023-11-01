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

export const SANDBOX_APPLICATION_PUBLIC_ID = 'sandbox-application'

export enum DATA_SOURCE {
    NEXUSIQ = 'Sonatype IQ Server',
    OSSINDEX = 'Sonatype OSS Index',
}

export const REMEDIATION_LABELS = {
    'next-no-violations': 'Next version with no policy violation(s)',
    'next-non-failing': 'Next version with no policy action failure(s)',
    'next-no-violations-with-dependencies':
        'Next version with no policy violation(s) for this component and its dependencies',
    'next-non-failing-with-dependencies':
        'Next version with no policy action failure(s) for this component and its dependencies',
}

export const FORMATS = {
    alpine: 'alpine',
    cargo: 'cargo', //cargo == crates == rust
    chocolatey: 'chocolatey',
    clojars: 'clojars',
    cocoapods: 'cocoapods',
    composer: 'composer', //packagist website but composer format, php language
    conan: 'conan',
    conda: 'conda',
    cran: 'cran',
    debian: 'deb',
    gem: 'gem',
    github: 'github',
    golang: 'golang',
    maven: 'maven',
    npm: 'npm',
    nuget: 'nuget',
    pypi: 'pypi',
    rpm: 'rpm',
    NXRM: 'NXRM',
}

export const REPOS = {
    alpineLinux: 'alpineLinux',
    cratesIo: 'cratesIo',
    npmJs: 'npmJs',
    anacondaCom: 'anacondaCom',
    chocolateyOrg: 'chocolateyOrg',
    clojarsOrg: 'clojarsOrg',
    cocoaPodsOrg: 'cocoaPodsOrg',
    conanIo: 'conanIo',
    cranRProject: 'cranRProject',
    packagesDebianOrg: 'packagesDebianOrg',
    trackerDebianOrg: 'trackerDebianOrg',
    pkgGoDev: 'pkgGoDev',
    nugetOrg: 'nugetOrg',
    packagistOrg: 'packagistOrg',
    pypiOrg: 'pypiOrg',
    rubyGemsOrg: 'rubyGemsOrg',
    nexusRepository: 'nexusRepository',
    mvnRepositoryCom: 'mvnRepositoryCom',
    repoMavenApacheOrg: 'repoMavenApacheOrg',
    searchMavenOrg: 'searchMavenOrg',
    repo1MavenOrg: 'repo1MavenOrg',
    centralSonatypeCom: 'centralSonatypeCom',
}

export interface RepoType {
    url: string                 // URL to the repo without package or version
    repoFormat: string          // Repo Format
    repoID: string              // Unique ID for this Repo
    titleSelector: string       // DOM selector to find the Package Title - used to annotate the page
    versionPath: string         // URL format with placeholders
    pathRegex: RegExp           // Regex for parsing URL
    versionDomPath: string      // DOM selector to find component version on the page (not always in the URL)
    supportsVersionNavigation: boolean // Whether to allow navigation using this extension to different versions
}

export const REPO_TYPES: RepoType[] = [
    {
        url: 'https://pkgs.alpinelinux.org/package/',
        repoFormat: FORMATS.alpine,
        repoID: REPOS.alpineLinux,       
        titleSelector: 'th.header ~ td',
        versionPath: '',
        pathRegex:
            /^(?<releaseName>[^/]*)\/(?<releaseFeed>[^/]*)\/(?<architecture>[^/]*)\/(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '#package > tbody > tr:nth-child(2) > td',
        supportsVersionNavigation: false
    },
    {
        url: 'https://cocoapods.org/pods/',
        repoFormat: FORMATS.cocoapods,
        repoID: REPOS.cocoaPodsOrg,
        titleSelector: 'h1',
        versionPath: '{artifactId}',
        pathRegex: /^(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'h1 > span',
        supportsVersionNavigation: false
    },
    {
        url: 'https://conan.io/center/recipes/',
        repoFormat: FORMATS.conan,
        repoID: REPOS.conanIo,
        titleSelector: 'h1',
        versionPath: '{artifactId}?version={version}',
        pathRegex: /^(?<artifactId>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'h1',
        supportsVersionNavigation: true
    },
    {
        url: 'https://cran.r-project.org/',
        repoFormat: FORMATS.cran,
        repoID: REPOS.cranRProject,
        titleSelector: 'h2',
        versionPath: 'web/packages/{artifactId}/index.html',
        pathRegex: /^web\/packages\/(?<artifactId>[^/]*)\/index\.html(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'table tr:nth-child(1) td:nth-child(2)',
        supportsVersionNavigation: false
    },
    {
        url: 'https://crates.io/crates/',
        repoFormat: FORMATS.cargo,
        repoID: REPOS.cratesIo,       
        titleSelector: "div[class*='heading'] h1",
        versionPath: '{artifactId}/{version}', // https://crates.io/crates/claxon/0.4.0
        pathRegex: /^(?<artifactId>[^/#?]*)\/(?<version>v[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'h1 small',
        supportsVersionNavigation: true
    },
    {
        //old gocenter path ->// https://search.gocenter.io/github.com~2Fgo-gitea~2Fgitea/info?version=v1.5.1
        //https://pkg.go.dev/github.com/etcd-io/etcd
        //https://pkg.go.dev/github.com/etcd-io/etcd@v3.3.25+incompatible
        url: 'https://pkg.go.dev/',
        repoFormat: FORMATS.golang,
        repoID: REPOS.pkgGoDev,
        titleSelector: 'body > main > header > div.go-Main-headerContent > div.go-Main-headerTitle.js-stickyHeader > h1',
        versionPath: '{groupAndArtifactId}/@{version}',
        pathRegex:
            /^(?<groupId>.+)\/(?<artifactId>[^/]*)\/(?<version>v[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: false
    },
    {
        url: 'https://central.sonatype.com/artifact/',
        repoFormat: FORMATS.maven,
        repoID: REPOS.centralSonatypeCom,
        titleSelector: 'h1',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex:
            /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)\/(?<version>[^/#?]*)(\/[^#?]*)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: true
    },
    {
        url: 'https://repo.maven.apache.org/maven2/',
        repoFormat: FORMATS.maven,
        repoID: REPOS.repoMavenApacheOrg,
        titleSelector: 'h1',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex:
            /^(?<groupArtifactId>([^#?&]*)+)\/(?<version>[^/#&?]+)?\/?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?/,
        versionDomPath: '',
        supportsVersionNavigation: false
    },
    {
        url: 'https://repo1.maven.org/maven2/',
        repoFormat: FORMATS.maven,
        repoID: REPOS.repo1MavenOrg,
        titleSelector: 'h1',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex:
            /^(?<groupArtifactId>([^#?&]*)+)\/(?<version>[^/#&?]+)\/?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?/,
        versionDomPath: '',
        supportsVersionNavigation: false
    },
    {
        url: 'https://search.maven.org/artifact/',
        repoFormat: FORMATS.maven,
        repoID: REPOS.searchMavenOrg,
        titleSelector: '.artifact-title',
        versionPath: '{groupId}/{artifactId}/{version}/{extension}',
        pathRegex:
            /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)(\/(?<version>[^/#?]*)\/(?<type>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: true
    },
    {
        url: 'https://mvnrepository.com/artifact/',
        repoFormat: FORMATS.maven,
        repoID: REPOS.mvnRepositoryCom,
        titleSelector: 'h2.im-title',
        versionPath: '{groupId}/{artifactId}/{version}',
        pathRegex: /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)\/(?<version>[^/#?]*)(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '',
        supportsVersionNavigation: true
    },
    {
        url: 'https://www.npmjs.com/package/',
        repoFormat: FORMATS.npm,
        repoID: REPOS.npmJs,
        titleSelector: '#top > div > h1 > span',
        versionPath: '{groupAndArtifactId}/v/{version}',
        pathRegex: /^((?<groupId>@[^/]*)\/)?(?<artifactId>[^/?#]*)(\/v\/(?<version>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '#top > div > span',
        supportsVersionNavigation: true
    },
    {
        url: 'https://www.nuget.org/packages/',
        repoFormat: FORMATS.nuget,
        repoID: REPOS.nugetOrg,
        titleSelector: '.package-title > h1',
        versionPath: '{artifactId}/{version}',
        pathRegex: /^(?<artifactId>[^/?#]*)(\/(?<version>[^/?#]*)\/?)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: 'span.version-title',
        supportsVersionNavigation: true
    },
    {
        url: 'https://packagist.org/packages/',
        repoFormat: FORMATS.composer,
        repoID: REPOS.packagistOrg,
        titleSelector: 'h2.title',
        versionPath: '{groupAndArtifactId}#{version}',
        pathRegex: /^(?<groupId>[^/]*)\/(?<artifactId>[^/?#]*)(\?(?<query>([^#]*)))?(#(?<version>(.*)))?$/,
        versionDomPath: '#view-package-page .versions-section .title .version-number',
        supportsVersionNavigation: true
    },
    {
        url: 'https://pypi.org/project/',
        repoFormat: FORMATS.pypi,
        repoID: REPOS.pypiOrg,
        titleSelector: 'h1.package-header__name',
        versionPath: '{artifactId}/{version}',
        pathRegex: /^(?<artifactId>[^/?#]*)\/((?<version>[^?#]*)\/)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '#content > div.banner > div > div.package-header__left > h1',
        supportsVersionNavigation: true
    },
    {
        url: 'https://rubygems.org/gems/',
        repoFormat: FORMATS.gem,
        repoID: REPOS.rubyGemsOrg,
        titleSelector: 'h1.t-display',
        versionPath: '{artifactId}/versions/{version}',
        pathRegex: /^(?<artifactId>[^/?#]*)(\/versions\/(?<version>[^?#-]*)-?(?<platform>[^?#]*))?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/,
        versionDomPath: '.page__subheading',
        supportsVersionNavigation: true
    }
]
