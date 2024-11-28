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

import { describe, expect, it } from '@jest/globals'
import { findRepoType } from './UrlParsing'
import { FORMATS, REPOS } from './Constants'


describe('Utils: UrlParsing: findRepoType', () => {
    it.each([
        {
            url: 'https://pkgs.alpinelinux.org/package/edge/main/x86_64/curl',
            expectedId: REPOS.alpineLinux,
            expectedFormat: FORMATS.alpine
        },
        {
            url: 'https://cocoapods.org/pods/Log4swift',
            expectedId: REPOS.cocoaPodsOrg,
            expectedFormat: FORMATS.cocoapods
        },
        {
            url: 'https://cran.r-project.org/web/packages/xgboost/index.html',
            expectedId: REPOS.cranRProject,
            expectedFormat: FORMATS.cran
        },
        {
            url: 'https://crates.io/crates/claxon',
            expectedId: REPOS.cratesIo,
            expectedFormat: FORMATS.cargo
        },
        {
            url: 'https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j-core',
            expectedId: REPOS.centralSonatypeCom,
            expectedFormat: FORMATS.maven
        },
        {
            url: 'https://repo.maven.apache.org/maven2/org/apache/logging/log4j/log4j-core/2.13.1/',
            expectedId: REPOS.repoMavenApacheOrg,
            expectedFormat: FORMATS.maven
        },
        {
            url: 'https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-core',
            expectedId: REPOS.repo1MavenOrg,
            expectedFormat: FORMATS.maven
        },
        {
            url: 'https://search.maven.org/artifact/org.apache.logging.log4j/log4j-core',
            expectedId: REPOS.searchMavenOrg,
            expectedFormat: FORMATS.maven
        },
        {
            url: 'https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-core/2.13.1',
            expectedId: REPOS.mvnRepositoryCom,
            expectedFormat: FORMATS.maven
        },
        {
            url: 'https://www.npmjs.com/package/lodash',
            expectedId: REPOS.npmJsCom,
            expectedFormat: FORMATS.npm
        },
        {
            url: 'https://www.nuget.org/packages/Newtonsoft.Json/13.0.3',
            expectedId: REPOS.nugetOrg,
            expectedFormat: FORMATS.nuget
        },
        {
            url: 'https://packagist.org/packages/cyclonedx/cyclonedx-library',
            expectedId: REPOS.packagistOrg,
            expectedFormat: FORMATS.composer
        },
        {
            url: 'https://pypi.org/project/PyJWT',
            expectedId: REPOS.pypiOrg,
            expectedFormat: FORMATS.pypi
        },
        {
            url: 'https://rubygems.org/gems/cyclonedx-ruby',
            expectedId: REPOS.rubyGemsOrg,
            expectedFormat: FORMATS.gem
        }
    ])('$url', ({ url, expectedId, expectedFormat }) => { 
        const repoType = findRepoType(url)
        expect(repoType).toBeDefined()
        expect(repoType?.RepoType.id()).toEqual(expectedId)
        expect(repoType?.RepoType.format()).toEqual(expectedFormat)
    })
})