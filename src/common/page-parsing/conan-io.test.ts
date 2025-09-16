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
import { ConanIoPageParser } from './conan-io'
import { ConanIoRepo } from '../repo-type/conan-io'

const parser = new ConanIoPageParser(new ConanIoRepo)

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

describe('conan.io Page Parsing', () => {
    
    test('proj no URL version', () => {
        assertPageParsing(
            'https://conan.io/center/recipes/proj',
            'conan.io/proj-9.5.0.html',
            [PackageURL.fromString('pkg:conan/proj@9.5.0')]
        )
    })

    test('proj with URL version', () => {
        assertPageParsing(
            'https://conan.io/center/recipes/proj?version=8.2.1',
            'conan.io/proj-8.2.1.html',
            [PackageURL.fromString('pkg:conan/proj@8.2.1')]
        )
    })

    test('libxft incorrect URL version', () => {
        assertPageParsing(
            'https://conan.io/center/recipes/libxft?version=2.3.8',
            'conan.io/libxft-2.3.6.html',
            [PackageURL.fromString('pkg:conan/libxft@2.3.6')]
        )
    })
})