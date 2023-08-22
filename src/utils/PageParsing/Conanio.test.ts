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
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { ensure } from '../Helpers'

describe('conan.io Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.conanIo)
    expect(repoType).toBeDefined()

    test('should parse a valid conan.io page', () => {
        const html = readFileSync(join(__dirname, 'testdata/conanio-proj-8.2.1.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://conan.io/center/recipes/proj?version=8.2.1'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.conan)
        expect(PackageURL?.name).toBe('proj')
        expect(PackageURL?.version).toBe('8.2.1')
    })

    test('should parse a valid conan.io page with no version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/conanio-libxft-2.3.8.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://conan.io/center/recipes/libxft'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.conan)
        expect(PackageURL?.name).toBe('libxft')
        expect(PackageURL?.version).toBe('2.3.8')
    })

    test('should parse a valid conan.io page with incorrect version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/conanio-libxft-2.3.6.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://conan.io/center/recipes/libxft?version=2.3.8'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.conan)
        expect(PackageURL?.name).toBe('libxft')
        expect(PackageURL?.version).toBe('2.3.6')
    })
})
