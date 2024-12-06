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
import { readFileSync } from 'fs'
import { join } from 'path'
import { PackageURL } from 'packageurl-js'
import { Nxrm3PageParser } from './Nxrm3'
import { Nxrm3Repo } from '../RepoType/Nxrm3'

const NXRM_BASE_URL = 'https://repo.tld/'
const parser = new Nxrm3PageParser(new Nxrm3Repo('http-repo.tld/', NXRM_BASE_URL, '3.70.0-01'))

function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = parser.parsePage(url)
    if (expected) {
        expect(packageURLs).toBeDefined()
        expect(packageURLs?.length).toBe(expected.length)
        const p = packageURLs?.pop()
        const e = expected.pop()
        expect(p).toBeDefined()
        expect(p?.version).toBe(e?.version)
        expect(p?.name).toBe(e?.name)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('NXRM3 Page Parsing', () => {
    
    /**
     * CocoaPods FORMAT TESTS
     */
    test('cocoapods: #browse/browse:cocoapods-proxy:Specs%2Fc%2Fb%2F0%2FIgor%2F0.5.0', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:cocoapods-proxy:Specs%2Fc%2Fb%2F0%2FIgor%2F0.5.0`,
            'nxrm3/browse-cocoapod-folder.html',
            undefined
        )
    })

    test('cocoapods: #browse/browse:cocoapods-proxy:Specs%2Fc%2Fb%2F0%2FIgor%2F0.5.0%2FIgor.podspec.json', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:cocoapods-proxy:Specs%2Fc%2Fb%2F0%2FIgor%2F0.5.0%2FIgor.podspec.json`,
            'nxrm3/browse-cocoapod.html',
            [PackageURL.fromString('pkg:cocoapods/Igor@0.5.0')]
        )
    })

    /**
     * MAVEN(2) FORMAT TESTS
     */
    test('maven2: #browse/browse:maven-central:commons-collections', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:maven-central:commons-collections`,
            'nxrm3/browse-maven2-folder.html',
            undefined
        )
    })

    test('maven2: #browse/browse:maven-central:commons-logging%2Fcommons-logging%2F1.1.3%2Fcommons-logging-1.1.3.jar', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:maven-central:commons-logging%2Fcommons-logging%2F1.1.3%2Fcommons-logging-1.1.3.jar`,
            'nxrm3/browse-maven2.html',
            [PackageURL.fromString('pkg:maven/commons-logging/commons-logging@1.1.3?type=jar')]
        )
    })

    test('maven2: #browse/browse:maven-central:org%2Fapache%2Flogging%2Flog4j%2Flog4j-core%2F2.12.0%2Flog4j-core-2.12.0.jar', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:maven-central:org%2Fapache%2Flogging%2Flog4j%2Flog4j-core%2F2.12.0%2Flog4j-core-2.12.0.jar`,
            'nxrm3/browse-maven2.html',
            [PackageURL.fromString('pkg:maven/org.apache.logging.log4j/log4j-core@2.12.0?type=jar')]
        )
    })


    /**
     * NPM FORMAT TESTS
     */
    test('npm: #browse/browse:npm-proxy:%40sonatype', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:npm-proxy:%40sonatype`,
            'nxrm3/browse-npm-folder.html',
            undefined
        )
    })

    // Failing?
    test('npm: #browse/browse:npm-proxy:braces%2Fbraces-1.8.5.tgz', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:npm-proxy:braces%2Fbraces-1.8.5.tgz`,
            undefined,
            [PackageURL.fromString('pkg:npm/braces@1.8.5')]
        )
    })

    test('npm: #browse/browse:npm-proxy:%40sonatype%2Fnexus-iq-api-client', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:npm-proxy:%40sonatype%2Fnexus-iq-api-client`,
            'nxrm3/browse-npm-no-version.html',
            undefined
        )
    })

    test('npm: #browse/browse:npm-proxy:%40sonatype%2Fpolicy-demo%2Fpolicy-demo-2.0.0.tgz', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:npm-proxy:%40sonatype%2Fpolicy-demo%2Fpolicy-demo-2.0.0.tgz`,
            'nxrm3/browse-npm.html',
            [PackageURL.fromString('pkg:npm/%40sonatype/policy-demo@2.0.0')]
        )
    })

    /**
     * PYPI FORMAT TESTS
     */
    test('pypi: #browse/browse:pupy-proxy:asynctest', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:pupy-proxy:asynctest`,
            'nxrm3/browse-pypi-folder.html',
            undefined
        )
    })

    test('pypi: #browse/browse:pupy-proxy:babel%2F2.12.1', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:pupy-proxy:babel%2F2.12.1`,
            'nxrm3/browse-pypi-component.html',
            undefined
        )
    })

     test('pypi: #browse/browse:pupy-proxy:asynctest%2F0.13.0%2Fasynctest-0.13.0-py3-none-any.whl', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:pupy-proxy:asynctest%2F0.13.0%2Fasynctest-0.13.0-py3-none-any.whl`,
            'nxrm3/browse-pypi.html',
            [PackageURL.fromString('pkg:pypi/asynctest@0.13.0?extension=tar.gz')]
        )
    })

    /**
     * R FORMAT TESTS
     */
    test('r: #browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3`,
            'nxrm3/browse-r-folder.html',
            undefined
        )
    })

    test('r: #browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3%2Fxgboost%2F1.7.5.1', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3%2Fxgboost%2F1.7.5.1`,
            'nxrm3/browse-r-version.html',
            undefined
        )
    })

    test('r: #browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3%2Fxgboost%2F1.7.5.1%2Fxgboost_1.7.5.1.tgz', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3%2Fxgboost%2F1.7.5.1%2Fxgboost_1.7.5.1.tgz`,
            'nxrm3/browse-r.html',
            [PackageURL.fromString('pkg:cran/xgboost@1.7.5.1')]
        )
    })

    /**
     * RubyGem FORMAT TESTS
     */
    test('rubygem: #browse/browse:ruby-proxy:logstash-input-tcp', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:ruby-proxy:logstash-input-tcp`,
            'nxrm3/browse-ruby-folder.html',
            undefined
        )
    })

    test('rubygem: #browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.0', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.0`,
            'nxrm3/browse-ruby-component.html',
            undefined
        )
    })

    test('rubygem: #browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.1%2Flogstash-input-tcp-0.1.1.gemspec.rz', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.1%2Flogstash-input-tcp-0.1.1.gemspec.rz`,
            'nxrm3/browse-ruby.html',
            [PackageURL.fromString('pkg:gem/logstash-input-tcp@0.1.1')]
        )
    })

    test('rubygem: #browse/browse:ruby-proxy:logstash-input-tcp%2F6.0.9%2Flogstash-input-tcp-6.0.9-java.gemspec.rz', () => {
        assertPageParsing(
            `${NXRM_BASE_URL}#browse/browse:ruby-proxy:logstash-input-tcp%2F6.0.9%2Flogstash-input-tcp-6.0.9-java.gemspec.rz`,
            'nxrm3/browse-ruby-with-platform.html',
            [PackageURL.fromString('pkg:gem/logstash-input-tcp@6.0.9?platform=java')]
        )
    })
})
