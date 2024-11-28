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
    'recommended-non-breaking-with-dependencies': 'Golden Version',
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
    huggingface: 'huggingface',
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
    npmJsCom: 'npmJsCom',
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
    huggingfaceCo: 'huggingfaceCo'
}