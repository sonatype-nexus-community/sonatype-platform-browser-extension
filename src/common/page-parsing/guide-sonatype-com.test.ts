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
import { PackageURL } from 'packageurl-js'
import { join } from 'path'

import { GuideSonatypeComRepo } from '../repo-type/guide-sonatype-com'
import { GuideSonatypeComPageParser } from './guide-sonatype-com'

const parser = new GuideSonatypeComPageParser(new GuideSonatypeComRepo())

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
        expect(p?.toString()).toBe(e?.toString())
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('guide.sonatype.com Page Parsing', () => {
    test('npm package', () => {
        assertPageParsing(
            'https://guide.sonatype.com/component/npm/react/18.2.0',
            undefined,
            [PackageURL.fromString('pkg:npm/react@18.2.0')]
        )
    })

    test('npm scoped package', () => {
        assertPageParsing(
            'https://guide.sonatype.com/component/npm/@types/react/18.2.0',
            undefined,
            [PackageURL.fromString('pkg:npm/%40types/react@18.2.0')]
        )
    })

    test('pypi package', () => {
        assertPageParsing(
            'https://guide.sonatype.com/component/pypi/requests/2.28.1',
            undefined,
            [PackageURL.fromString('pkg:pypi/requests@2.28.1')]
        )
    })

    test('invalid url', () => {
        assertPageParsing(
            'https://guide.sonatype.com/component/unknown/format',
            undefined,
            undefined
        )
    })
})
