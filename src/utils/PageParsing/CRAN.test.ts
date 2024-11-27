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
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { PackageURL } from 'packageurl-js'
import { CranRRepo } from './CRAN'

const repo = new CranRRepo

function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = getArtifactDetailsFromDOM(repo, url)
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

describe('cran.r-project.org Page Parsing', () => {
    
    test('oysteR (no query or fragment)', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:cran/oysteR@0.1.1')
        assertPageParsing('https://cran.r-project.org/web/packages/oysteR/index.html', 'cran.r-project.org/oysteR-0.1.1.html', [expectedPackageUrl])
    })

    test('oysteR (with query no fragment)', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:cran/oysteR@0.1.1')
        assertPageParsing('https://cran.r-project.org/web/packages/oysteR/index.html?something=else', 'cran.r-project.org/oysteR-0.1.1.html', [expectedPackageUrl])
    })

    test('oysteR (with query and fragment)', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:cran/oysteR@0.1.1')
        assertPageParsing('https://cran.r-project.org/web/packages/oysteR/index.html?something=other#nothing', 'cran.r-project.org/oysteR-0.1.1.html', [expectedPackageUrl])
    })
})