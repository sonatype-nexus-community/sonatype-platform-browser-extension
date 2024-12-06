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
import { AlpineLinuxOrgPageParser } from './Alpine'
import { AlpineLinuxOrgRepo } from '../RepoType/Alpine'

const parser = new AlpineLinuxOrgPageParser(new AlpineLinuxOrgRepo())

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
        expect(p?.version).toBe(e?.version)
        expect(p?.name).toBe(e?.name)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('pkgs.alpinelinux.org Page Parsing', () => {
    
    test('openssl', () => {
        assertPageParsing(
            'https://pkgs.alpinelinux.org/package/edge/main/x86/openssl',
            'pkgs.alpinelinux.org/openssl-3.3.2-r4.html',
            [PackageURL.fromString('pkg:alpine/openssl@3.3.2-r4')]
        )
    })

    test('openssl with query string', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:alpine/openssl@3.3.2-r4')
        assertPageParsing('https://pkgs.alpinelinux.org/package/edge/main/x86/openssl?something=else', 'pkgs.alpinelinux.org/openssl-3.3.2-r4.html', [expectedPackageUrl])
    })
})
