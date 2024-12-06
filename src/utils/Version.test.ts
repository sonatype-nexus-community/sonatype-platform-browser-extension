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
import { getNewSelectedVersionUrl } from './Version'
import { PackageURL } from 'packageurl-js'


describe('Utils: Helpers: getNewSelectedVersionUrl', () => {

    it.each([
        // Conan
        // TBC
        {
            registry: 'central.sonatype.com',
            registryUrl: 'https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j-core', 
            currentPurl: 'pkg:maven/org.apache.logging.log4j/log4j-core@2.12.1', 
            newVersion: '3.0.0-alpha1'
        },
        {
            registry: 'crates.io',
            registryUrl: 'https://crates.io/crates/claxon',
            currentPurl: 'pkg:cargo/claxon@0.4.3',
            newVersion: '3.2.1'
        },
        {
            registry: 'mvnrepository.com',
            registryUrl: 'https://mvnrepository.com/artifact/org.apache.logging.log4j/log4j-core',
            currentPurl: 'pkg:maven/org.apache.logging.log4j/log4j-core@2.14.0', 
            newVersion: '2.15.0'
        },
        {
            registry: 'npmjs.com',
            registryUrl: 'https://www.npmjs.com/package/lodash',
            currentPurl: 'pkg:npm/lodash@4.17.21',
            newVersion: '4.17.22',
            expectedUrl: 'https://www.npmjs.com/package/lodash/v/4.17.22'
        },
        {
            registry: 'packagist.org',
            registryUrl: 'https://packagist.org/packages/cyclonedx/cyclonedx-library',
            currentPurl: 'pkg:composer/cyclonedx/cyclonedx-library@2.1.0',
            newVersion: '2.2.2',
            expectedUrl: 'https://packagist.org/packages/cyclonedx/cyclonedx-library#2.2.2'
        },
        {
            registry: 'pypi.org',
            registryUrl: 'https://pypi.org/project/PyJWT',
            currentPurl: 'pkg:pypi/pyjwt@1.7.1',
            newVersion: '1.7.5',
            expectedUrl: 'https://pypi.org/project/pyjwt/1.7.5'
        },
        {
            registry: 'search.maven.org',
            registryUrl: 'https://search.maven.org/artifact/org.apache.struts/struts2-core',
            currentPurl: 'pkg:maven/org.apache.struts/struts2-core@2.3.30?extension=jar',
            newVersion: '2.3.31',
            expectedUrl: 'https://search.maven.org/artifact/org.apache.struts/struts2-core/2.3.31/jar'
        },
        {
            registry: 'www.nuget.org',
            registryUrl: 'https://www.nuget.org/packages/moq',
            currentPurl: 'pkg:nuget/moq@4.20.1',
            newVersion: '4.20.2'
        }
    ])('$registry', ({registryUrl, currentPurl, newVersion, expectedUrl}) => {
        const registry = new URL(registryUrl)
        const currentPackageUrl = PackageURL.fromString(currentPurl)

        // Test return same URL
        const newUrl = getNewSelectedVersionUrl(registry, currentPackageUrl)
        expect(newUrl).toBeDefined()
        expect(newUrl).toEqual(registry)

        // Test with new version
        const newVersionUrl = getNewSelectedVersionUrl(registry, currentPackageUrl, newVersion)
        let expectedNewUrl = new URL(`${registryUrl}/${newVersion}`)
        if (expectedUrl !== undefined) {
            expectedNewUrl = new URL(expectedUrl)
        }
        expect(newVersionUrl).toBeDefined()
        expect(newVersionUrl.toString()).toEqual(expectedNewUrl.toString())
    })
})