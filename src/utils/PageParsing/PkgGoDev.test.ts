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
import { PkgGoDevPageParser } from './PkgGoDev'
import { PkgGoDevRepo } from '../RepoType/PkgGoDev'

const parser = new PkgGoDevPageParser(new PkgGoDevRepo)

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
        expect(p?.namespace).toBe(e?.namespace)
        expect(p?.name).toBe(e?.name)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('pkg.go.dev Page Parsing', () => {
    
    test('Parse golang.org/x/text no version in URL', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/golang.org/x/text@v0.20.0')
        assertPageParsing('https://pkg.go.dev/golang.org/x/text', 'pkg.go.dev/golang.org-x-text-0.20.0.html', [expectedPackageUrl])
    })

    test('Parse golang.org/x/text with version in URL', () => { 
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/golang.org/x/text@v0.19.0')
        assertPageParsing('https://pkg.go.dev/golang.org/x/text@v0.19.0', undefined, [expectedPackageUrl])
    })

    test('Parse github.com/etcd-io/etcd with version in URL', () => {       
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/github.com/etcd-io/etcd@v0.3.0')
        assertPageParsing('https://pkg.go.dev/github.com/etcd-io/etcd@v0.3.0', undefined, [expectedPackageUrl])
    })

    test('Parse golang.org/x/text no version in URL', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/go.etcd.io/etcd/client/v3@v3.5.17')
        assertPageParsing('https://pkg.go.dev/go.etcd.io/etcd/client/v3', 'pkg.go.dev/go.etcd.io-etcd-client-v3-3.5.17.html', [expectedPackageUrl])
    })

    test('+incompatible version URL fails to parse', () => {      
        assertPageParsing('https://pkg.go.dev/github.com/etcd-io/etcd@v3.3.27+incompatible', undefined, undefined)
    })

    test('Parse google.golang.org/protobuf with Version & Subpath', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/google.golang.org/protobuf@v1.26.0')
        assertPageParsing('https://pkg.go.dev/google.golang.org/protobuf@v1.26.0/runtime/protoimpl', undefined, [expectedPackageUrl])
    })

    test('Parse gopkg.in/ini.v1 no version in URL', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/github.com/go-ini/ini@v1.67.0')
        assertPageParsing('https://pkg.go.dev/gopkg.in/ini.v1', 'pkg.go.dev/gopkg.in-ini.v1-1.67.0.html', [expectedPackageUrl])
    })

    test('Parse golang.org/x/text with version in URL', () => {       
        const expectedPackageUrl = PackageURL.fromString('pkg:golang/github.com/go-ini/ini@v1.65.0')
        assertPageParsing('https://pkg.go.dev/gopkg.in/ini.v1@v1.65.0', undefined, [expectedPackageUrl])
    })
})
