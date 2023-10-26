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
import { describe, expect, test } from '@jest/globals'
import { findPublicOssRepoType } from './UrlParsing'
import { REPOS, REPO_TYPES } from './Constants'


describe('Utils: UrlParsing: findPublicOssRepoType', () => {
   
    test('VALID: alpinelinux.org no version', () => {
        const repoType = findPublicOssRepoType('https://pkgs.alpinelinux.org/package/edge/main/x86_64/curl')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.alpineLinux))
    })

    test('VALID: cocoapods.org no version', () => {
        const repoType = findPublicOssRepoType('https://cocoapods.org/pods/Log4swift')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.cocoaPodsOrg))
    })

    test('VALID: cran.r-project.org no version', () => {
        const repoType = findPublicOssRepoType('https://cran.r-project.org/web/packages/xgboost/index.html')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.cranRProject))
    })

    test('VALID: crates.io no version', () => {
        const repoType = findPublicOssRepoType('https://crates.io/crates/claxon')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.cratesIo))
    })

    test('VALID: crates.io with version', () => {
        const repoType = findPublicOssRepoType('https://crates.io/crates/claxon/0.4.3')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.cratesIo))
    })

    test('VALID: central.sonatype.com no version', () => {
        const repoType = findPublicOssRepoType('https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j-core')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.centralSonatypeCom))
    })

    test('VALID: central.sonatype.com with version', () => {
        const repoType = findPublicOssRepoType('https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j-core/2.13.2')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.centralSonatypeCom))
    })

    test('VALID: repo.maven.apache.org no version', () => {
        const repoType = findPublicOssRepoType('https://repo.maven.apache.org/maven2/org/apache/logging/log4j/log4j-core')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.repoMavenApacheOrg))
    })

    test('VALID: repo.maven.apache.org with version', () => {
        const repoType = findPublicOssRepoType('https://repo.maven.apache.org/maven2/org/apache/logging/log4j/log4j-core/2.13.1/')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.repoMavenApacheOrg))
    })

    test('VALID: repo1.maven.org no version', () => {
        const repoType = findPublicOssRepoType('https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-core')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.repo1MavenOrg))
    })

    test('VALID: repo1.maven.org with version', () => {
        const repoType = findPublicOssRepoType('https://repo1.maven.org/maven2/org/apache/logging/log4j/log4j-core/2.13.1/')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.repo1MavenOrg))
    })

    test('VALID: search.maven.org no version', () => {
        const repoType = findPublicOssRepoType('https://search.maven.org/artifact/org.apache.logging.log4j/log4j-core')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.searchMavenOrg))
    })

    test('VALID: search.maven.org with version', () => {
        const repoType = findPublicOssRepoType('https://search.maven.org/artifact/org.apache.logging.log4j/log4j-core/2.12.2/jar')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.searchMavenOrg))
    })

    test('VALID: mvnrepository.com no version', () => {
        const repoType = findPublicOssRepoType('https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-core')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.mvnRepositoryCom))
    })

    test('VALID: mvnrepository.com with version', () => {
        const repoType = findPublicOssRepoType('https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-core/2.13.1')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.mvnRepositoryCom))
    })

    test('VALID: npmjs.org no version', () => {
        const repoType = findPublicOssRepoType('https://www.npmjs.com/package/lodash')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.npmJs))
    })

    test('VALID: npmjs.org with version', () => {
        const repoType = findPublicOssRepoType('https://www.npmjs.com/package/lodash/v/4.17.21')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.npmJs))
    })

    test('VALID: www.nuget.org no version', () => {
        const repoType = findPublicOssRepoType('https://www.nuget.org/packages/Newtonsoft.Json')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.nugetOrg))
    })

    test('VALID: www.nuget.org with version', () => {
        const repoType = findPublicOssRepoType('https://www.nuget.org/packages/Newtonsoft.Json/13.0.3')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.nugetOrg))
    })

    test('VALID: packagist.org no version', () => {
        const repoType = findPublicOssRepoType('https://packagist.org/packages/cyclonedx/cyclonedx-library')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.packagistOrg))
    })

    test('VALID: packagist.org with version', () => {
        const repoType = findPublicOssRepoType('https://packagist.org/packages/cyclonedx/cyclonedx-library#v2.3.0')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.packagistOrg))
    })

    test('VALID: pypi.org no version', () => {
        const repoType = findPublicOssRepoType('https://pypi.org/project/PyJWT')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.pypiOrg))
    })

    test('VALID: pypi.org with version', () => {
        const repoType = findPublicOssRepoType('https://pypi.org/project/PyJWT/1.7.1')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.pypiOrg))
    })

    test('VALID: rubygems.org no version', () => {
        const repoType = findPublicOssRepoType('https://rubygems.org/gems/cyclonedx-ruby')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.rubyGemsOrg))
    })

    test('VALID: rubygems.org with version', () => {
        const repoType = findPublicOssRepoType('https://rubygems.org/gems/cyclonedx-ruby/versions/1.1.0')
        expect(repoType).toBeDefined()
        expect(repoType).toBe(REPO_TYPES.find((e) => e.repoID == REPOS.rubyGemsOrg))
    })

})