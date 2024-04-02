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
import { PackageURL } from 'packageurl-js'

describe('crates.io Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.cratesIo)
    expect(repoType).toBeDefined()

    test('should parse a valid create.io page - no version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/crates-io-cargo-pants.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://crates.io/crates/cargo-pants'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.cargo)
        expect(packageURL?.name).toBe('cargo-pants')
        expect(packageURL?.version).toBe('0.4.25')
    })

    test('should parse a valid create.io page - version in URL', () => {
        const html = readFileSync(join(__dirname, 'testdata/crates-io-cargo-pants-0.4.24.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://crates.io/crates/cargo-pants/0.4.24'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.cargo)
        expect(packageURL?.name).toBe('cargo-pants')
        expect(packageURL?.version).toBe('0.4.24')
    })

    test('should parse a valid create.io page - version in URL + query + fragement', () => {
        const html = readFileSync(join(__dirname, 'testdata/crates-io-cargo-pants-0.4.24.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://crates.io/crates/cargo-pants/0.4.24?some=rubbish#elswhere'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.cargo)
        expect(packageURL?.name).toBe('cargo-pants')
        expect(packageURL?.version).toBe('0.4.24')
    })

})
