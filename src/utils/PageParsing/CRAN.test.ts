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

describe('CRAN Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.cranRProject)
    expect(repoType).toBeDefined()

    test('should parse a valid CRAN page', () => {
        const html = readFileSync(join(__dirname, 'testdata/cran.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://cran.r-project.org/web/packages/oysteR/index.html'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.cran)
        expect(PackageURL?.name).toBe('oysteR')
        expect(PackageURL?.version).toBe('0.1.1')
    })

    test('should parse a valid CRAN page with query string', () => {
        const html = readFileSync(join(__dirname, 'testdata/cran.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://cran.r-project.org/web/packages/oysteR/index.html?something=else'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.cran)
        expect(PackageURL?.name).toBe('oysteR')
        expect(PackageURL?.version).toBe('0.1.1')
    })

    test('should parse a valid CRAN page with query string and fragment', () => {
        const html = readFileSync(join(__dirname, 'testdata/cran.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://cran.r-project.org/web/packages/oysteR/index.html?something=else#anchor'
        )

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.cran)
        expect(PackageURL?.name).toBe('oysteR')
        expect(PackageURL?.version).toBe('0.1.1')
    })
})
