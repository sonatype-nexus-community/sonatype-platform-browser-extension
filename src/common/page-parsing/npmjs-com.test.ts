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
import { NpmJsComPageParser } from './npmjs-com'
import { NpmJsComRepo } from '../repo-type/npmjs-com'

const parser = new NpmJsComPageParser(new NpmJsComRepo)

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
        if (e?.namespace != undefined) {
            expect(p?.namespace).toBe(e?.namespace)
        } else {
            expect(p?.namespace).toBeUndefined()
        }
        expect(p?.name).toBe(e?.name)
        expect(p?.version).toBe(e?.version)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('npmjs.com Page Parsing', () => {
    const RSC_VERSION = "13.3.2"
    
    test('@sonatype/react-shared-components (no version in URL)', () => {
        assertPageParsing(
            'https://www.npmjs.com/package/@sonatype/react-shared-components',
            `npmjs.com/sonatype-react-shared-components-${RSC_VERSION}.html`,
            [PackageURL.fromString(`pkg:npm/%40sonatype/react-shared-components@${RSC_VERSION}`)]
        )
    })

    test(`@sonatype/react-shared-components/v/${RSC_VERSION}`, () => {
        assertPageParsing(
            `https://www.npmjs.com/package/@sonatype/react-shared-components/v/${RSC_VERSION}`,
            undefined,
            [PackageURL.fromString(`pkg:npm/%40sonatype/react-shared-components@${RSC_VERSION}`)]
        )
    })

    test(`@sonatype/react-shared-components/v/${RSC_VERSION} + query & fragment`, () => {
        assertPageParsing(
            `https://www.npmjs.com/package/@sonatype/react-shared-components/v/${RSC_VERSION}?a=b#c`,
            undefined,
            [PackageURL.fromString(`pkg:npm/%40sonatype/react-shared-components@${RSC_VERSION}`)]
        )
    })

    test('path-is-absolute (deprecated)', () => {
        assertPageParsing(
            'https://www.npmjs.com/package/path-is-absolute',
            `npmjs.com/path-is-absolute-2.0.0.html`,
            [PackageURL.fromString(`pkg:npm/path-is-absolute@2.0.0`)]
        )
    })
})
