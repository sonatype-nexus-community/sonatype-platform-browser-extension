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
import { PackagistOrgPageParser } from './Packagist'
import { PackagistOrgRepo } from '../RepoType/Packagist'

const parser = new PackagistOrgPageParser(new PackagistOrgRepo)

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
        expect(p?.namespace).toBe(e?.namespace)
        expect(p?.name).toBe(e?.name)
        expect(p?.version).toBe(e?.version)
        expect(p?.qualifiers).toBeUndefined()
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('packagist.org Page Parsing', () => {
    
    test('/fomvasss/laravel-its-lte', () => {
        assertPageParsing(
            'https://packagist.org/packages/fomvasss/laravel-its-lte',
            'packagist.org/fomvasss-laravel-its-lte-4.22.html',
            [PackageURL.fromString('pkg:composer/fomvasss/laravel-its-lte@4.22')]
        )
    })

    test('/fomvasss/laravel-its-lte#4.23.0', () => {
        assertPageParsing(
            'https://packagist.org/packages/fomvasss/laravel-its-lte#4.23.0',
            undefined,
            [PackageURL.fromString('pkg:composer/fomvasss/laravel-its-lte@4.23.0')]
        )
    })

    test('/fomvasss/laravel-its-lte?a=b#4.22', () => {
        assertPageParsing(
            'https://packagist.org/packages/fomvasss/laravel-its-lte?a=b#4.22',
            undefined,
            [PackageURL.fromString('pkg:composer/fomvasss/laravel-its-lte@4.22')]
        )
    })
})
