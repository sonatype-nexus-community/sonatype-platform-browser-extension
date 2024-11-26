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
import { REPOS, REPO_TYPES } from '../Constants'
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { ensure } from '../Helpers'

describe('Golang Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.pkgGoDev)
    expect(repoType).toBeDefined()

    test('Parse golang.org/x/text no version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/pkg.go.dev/golang.org-x-text-0.20.0.html'))
        window.document.body.innerHTML = html.toString()
        
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/golang.org/x/text'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe('v0.20.0')
        expect(packageURL?.namespace).toBe('golang.org/x')
        expect(packageURL?.name).toBe('text')
    })

    test('Parse golang.org/x/text with version in URL', () => {       
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/golang.org/x/text@v0.19.0'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe('v0.19.0')
        expect(packageURL?.namespace).toBe('golang.org/x')
        expect(packageURL?.name).toBe('text')
    })

    test('Parse github.com/etcd-io/etcd with version in URL', () => {       
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/github.com/etcd-io/etcd@v0.3.0'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe('v0.3.0')
        expect(packageURL?.namespace).toBe('github.com/etcd-io')
        expect(packageURL?.name).toBe('etcd')
    })

    test('Parse golang.org/x/text no version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/pkg.go.dev/go.etcd.io-etcd-client-v3-3.5.17.html'))
        window.document.body.innerHTML = html.toString()
        
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/go.etcd.io/etcd/client/v3'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe('v3.5.17')
        expect(packageURL?.namespace).toBe('go.etcd.io/etcd/client')
        expect(packageURL?.name).toBe('v3')
    })

    test('+incompatible version URL fails to parse', () => {       
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/github.com/etcd-io/etcd@v3.3.27+incompatible'
        )

        expect(packageURL).not.toBeDefined()
    })

    test('Parse google.golang.org/protobuf with Version & Subpath', () => {
        const PackageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/google.golang.org/protobuf@v1.26.0/runtime/protoimpl'
        )
        expect(PackageURL).toBeDefined()
        expect(PackageURL?.version).toBe('v1.26.0')
        expect(PackageURL?.namespace).toBe('google.golang.org')
        expect(PackageURL?.name).toBe('protobuf')
        expect(PackageURL?.toString()).toBe('pkg:golang/google.golang.org/protobuf@v1.26.0')
    })

    test('Parse gopkg.in/ini.v1 no version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/pkg.go.dev/gopkg.in-ini.v1-1.67.0.html'))
        window.document.body.innerHTML = html.toString()
        
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/gopkg.in/ini.v1'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe('v1.67.0')
        expect(packageURL?.namespace).toBe('github.com/go-ini')
        expect(packageURL?.name).toBe('ini')
    })

    test('Parse golang.org/x/text with version in URL', () => {       
        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pkg.go.dev/gopkg.in/ini.v1@v1.65.0'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe('v1.65.0')
        expect(packageURL?.namespace).toBe('github.com/go-ini')
        expect(packageURL?.name).toBe('ini')
    })
})
