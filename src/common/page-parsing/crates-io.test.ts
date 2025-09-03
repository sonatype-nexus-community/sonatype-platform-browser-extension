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
import { CratesIoPageParser } from './crates-io'
import { CratesIoRepo } from '../repo-type/crates-io'

const parser = new CratesIoPageParser(new CratesIoRepo)

async function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = await parser.parsePage(url)
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

describe('crates.io Page Parsing', () => {
    
    test('cargo-pants (no version in URL)', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:cargo/cargo-pants@0.4.25')
        assertPageParsing('https://crates.io/crates/cargo-pants', 'crates.io/cargo-pants-0.4.25.html', [expectedPackageUrl])
    })

    test('cargo-pants (version in URL)', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:cargo/cargo-pants@0.4.24')
        assertPageParsing('https://crates.io/crates/cargo-pants/0.4.24', 'crates.io/cargo-pants-0.4.24.html', [expectedPackageUrl])
    })

    test('cargo-pants (version in URL + query & fragment)', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:cargo/cargo-pants@0.4.24')
        assertPageParsing('https://crates.io/crates/cargo-pants/0.4.24?some=rubbish#elswhere', undefined, [expectedPackageUrl])
    })
})
