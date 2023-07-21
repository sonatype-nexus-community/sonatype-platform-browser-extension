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

describe('NXRM3 Page Parsing', () => {
    const repoType = {
        url: 'https://repo.tld/',
        repoFormat: FORMATS.NXRM,
        repoID: 'NXRM-https://repo.tld/',
    }

    test('#browse/browse:maven-central:commons-logging%2Fcommons-logging%2F1.1.3%2Fcommons-logging-1.1.3.jar', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3-browse-maven2.html'))

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

    test('#browse/browse:npm-proxy:%40sonatype%2Fnexus-iq-api-client NO VERSION', () => {
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
        expect(packageURL?.namespace).toBe('@sonatype')
        expect(packageURL?.name).toBe('policy-demo')
        expect(packageURL?.version).toBe('2.0.0')
    })
})
