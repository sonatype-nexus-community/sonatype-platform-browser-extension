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
import { FORMATS, REPOS, REPO_TYPES } from '../Constants'
import { ensure } from '../Helpers'
import { getArtifactDetailsFromDOM } from '../PageParsing'

describe('NPM Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.npmJs)
    const RSC_VERSION = "13.3.2"
    expect(repoType).toBeDefined()

    test('should parse a valid NPM page: @sonatype/react-shared-components', () => {
        const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://www.npmjs.com/package/@sonatype/react-shared-components'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBe('@sonatype')
        expect(PackageURL?.name).toBe('react-shared-components')
        expect(PackageURL?.version).toBe(RSC_VERSION)
    })

    test(`should parse a valid NPM page: @sonatype/react-shared-components/v/${RSC_VERSION}`, () => {
        const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            `https://www.npmjs.com/package/@sonatype/react-shared-components/v/${RSC_VERSION}`
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBe('@sonatype')
        expect(PackageURL?.name).toBe('react-shared-components')
        expect(PackageURL?.version).toBe(RSC_VERSION)
    })

    test(`should parse a valid NPM page: @sonatype/react-shared-components/v/${RSC_VERSION}?something#fragment`, () => {
        const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            `https://www.npmjs.com/package/@sonatype/react-shared-components/v/${RSC_VERSION}?something#fragment`
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBe('@sonatype')
        expect(PackageURL?.name).toBe('react-shared-components')
        expect(PackageURL?.version).toBe(RSC_VERSION)
    })

    test('should parse a valid NPM page: test', () => {
        const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(ensure(repoType), 'https://www.npmjs.com/package/test')

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBeUndefined()
        expect(PackageURL?.name).toBe('test')
        expect(PackageURL?.version).toBe(RSC_VERSION)
    })

    test('should parse a valid NPM page: test/v/1.2.3', () => {
        const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(ensure(repoType), 'https://www.npmjs.com/package/test/v/1.2.3')

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBeUndefined()
        expect(PackageURL?.name).toBe('test')
        expect(PackageURL?.version).toBe('1.2.3')
    })

    test('should parse a valid NPM page: test/v/1.2.3?abc=123#headline', () => {
        const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(ensure(repoType), 'https://www.npmjs.com/package/test/v/1.2.3')

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBeUndefined()
        expect(PackageURL?.name).toBe('test')
        expect(PackageURL?.version).toBe('1.2.3')
    })

    test('should parse a valid NPM page: @sonatype/policy-demo', () => {
        const html = readFileSync(join(__dirname, 'testdata/npm2.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://www.npmjs.com/package/@sonatype/policy-demo'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBe('@sonatype')
        expect(PackageURL?.name).toBe('policy-demo')
        expect(PackageURL?.version).toBe('2.3.0')
    })

    test('Valid NPM page for deprecated component: path-is-absolute', () => {
        const html = readFileSync(join(__dirname, 'testdata/npm-deprecated.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://www.npmjs.com/package/path-is-absolute'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.npm)
        expect(PackageURL?.namespace).toBeUndefined()
        expect(PackageURL?.name).toBe('path-is-absolute')
        expect(PackageURL?.version).toBe('2.0.0')
    })
})
