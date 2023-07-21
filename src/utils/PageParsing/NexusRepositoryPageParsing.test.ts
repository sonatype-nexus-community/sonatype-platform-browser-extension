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
import { FORMATS } from '../Constants'
import { getArtifactDetailsFromNxrmDom } from './NexusRepositoryPageParsing'
import exp from 'constants'

describe('NXRM3 Page Parsing', () => {
    const repoType = {
        url: 'https://repo.tld/',
        repoFormat: FORMATS.NXRM,
        repoID: 'NXRM-https://repo.tld/',
    }

    /**
     * MAVEN(2) FORMAT TESTS
     */

    test('#browse/browse:maven-central:commons-collections', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-maven2-folder.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:maven-central:commons-collections'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:maven-central:commons-collections%2Fcommons-collections%2F2.0', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-maven2-component.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            '#browse/browse:maven-central:commons-collections%2Fcommons-collections%2F2.0'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:maven-central:commons-logging%2Fcommons-logging%2F1.1.3%2Fcommons-logging-1.1.3.jar', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-maven2.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            '#browse/browse:maven-central:commons-logging%2Fcommons-logging%2F1.1.3%2Fcommons-logging-1.1.3.jar'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.maven)
        expect(packageURL?.namespace).toBe('commons-logging')
        expect(packageURL?.name).toBe('commons-logging')
        expect(packageURL?.version).toBe('1.1.3')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('#browse/browse:maven-central:org%2Fapache%2Flogging%2Flog4j%2Flog4j-core%2F2.12.0%2Flog4j-core-2.12.0.jar', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-maven2.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            '#browse/browse:maven-central:org%2Fapache%2Flogging%2Flog4j%2Flog4j-core%2F2.12.0%2Flog4j-core-2.12.0.jar'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.maven)
        expect(packageURL?.namespace).toBe('org.apache.logging.log4j')
        expect(packageURL?.name).toBe('log4j-core')
        expect(packageURL?.version).toBe('2.12.0')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    /**
     * NPM FORMAT TESTS
     */

    test('#browse/browse:npm-proxy:%40sonatype', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-npm-folder.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:npm-proxy:%40sonatype'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:npm-proxy:%40sonatype%2Fnexus-iq-api-client', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-npm-no-version.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:npm-proxy:%40sonatype%2Fnexus-iq-api-client'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:npm-proxy:%40sonatype%2Fpolicy-demo%2Fpolicy-demo-2.0.0.tgz', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-npm.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:npm-proxy:%40sonatype%2Fpolicy-demo%2Fpolicy-demo-2.0.0.tgz'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.npm)
        expect(packageURL?.namespace).toBe('%40sonatype')
        expect(packageURL?.name).toBe('policy-demo')
        expect(packageURL?.version).toBe('2.0.0')
    })

    /**
     * PYPI FORMAT TESTS
     */

    test('#browse/browse:pupy-proxy:asynctest', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-pypi-folder.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:pupy-proxy:asynctest'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:pupy-proxy:babel%2F2.12.1', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-pypi-component.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:pupy-proxy:babel%2F2.12.1'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:pupy-proxy:asynctest%2F0.13.0%2Fasynctest-0.13.0-py3-none-any.whl', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-pypi.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            '#browse/browse:pupy-proxy:asynctest%2F0.13.0%2Fasynctest-0.13.0-py3-none-any.whl'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pypi)
        expect(packageURL?.namespace).toBeUndefined()
        expect(packageURL?.name).toBe('asynctest')
        expect(packageURL?.version).toBe('0.13.0')
        expect(packageURL?.qualifiers).toEqual({ extension: 'tar.gz' })
        expect(packageURL?.toString()).toBe('pkg:pypi/asynctest@0.13.0?extension=tar.gz')
    })

    /**
     * RubyGem FORMAT TESTS
     */

    test('#browse/browse:ruby-proxy:logstash-input-tcp', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-ruby-folder.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:ruby-proxy:logstash-input-tcp'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.0', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-ruby-component.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.0'
        )

        expect(packageURL).toBeUndefined()
    })

    test('#browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.1%2Flogstash-input-tcp-0.1.1.gemspec.rz', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-ruby.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:ruby-proxy:logstash-input-tcp%2F0.1.1%2Flogstash-input-tcp-0.1.1.gemspec.rz'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.gem)
        expect(packageURL?.namespace).toBeUndefined()
        expect(packageURL?.name).toBe('logstash-input-tcp')
        expect(packageURL?.version).toBe('0.1.1')
        expect(packageURL?.qualifiers).toBeUndefined()
        expect(packageURL?.toString()).toBe('pkg:gem/logstash-input-tcp@0.1.1')
    })

    test('#browse/browse:ruby-proxy:logstash-input-tcp%2F6.0.9%2Flogstash-input-tcp-6.0.9-java.gemspec.rz', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3/browse-ruby-with-platform.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromNxrmDom(
            repoType,
            'https://repo.tld/#browse/browse:ruby-proxy:logstash-input-tcp%2F6.0.9%2Flogstash-input-tcp-6.0.9-java.gemspec.rz'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.gem)
        expect(packageURL?.namespace).toBeUndefined()
        expect(packageURL?.name).toBe('logstash-input-tcp')
        expect(packageURL?.version).toBe('6.0.9')
        expect(packageURL?.qualifiers).toEqual({ platform: 'java' })
        expect(packageURL?.toString()).toBe('pkg:gem/logstash-input-tcp@6.0.9?platform=java')
    })
})
