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
import { FORMATS, REPO_TYPES, REPOS } from '../Constants'
import { ensure } from '../Helpers'
import { getArtifactDetailsFromDOM } from '../PageParsing'

describe('Pub Dev Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.pubDev)
    expect(repoType).toBeDefined()

    test('should parse a valid Pub Dev Dart package page', () => {
        const html = readFileSync(join(__dirname, 'testdata/dart-http.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            "https://pub.dev/packages/http"
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pub)
        expect(packageURL?.name).toBe('http')
        expect(packageURL?.version).toBe('1.3.0')
    })

    test('should parse a valid Pub Dev Dart package page with version in path', () => {
        const html = readFileSync(join(__dirname, 'testdata/dart-http-1.2.1.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            "https://pub.dev/packages/http/versions/1.2.1"
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pub)
        expect(packageURL?.name).toBe('http')
        expect(packageURL?.version).toBe('1.2.1')
    })

    test('should parse a valid Pub Dev Dart package page with url encoded characters in version', () => {
        const html = readFileSync(join(__dirname, 'testdata/dart-http-0.11.3+15.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            "https://pub.dev/packages/http/versions/0.11.3+15"
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pub)
        expect(packageURL?.name).toBe('http')
        expect(packageURL?.version).toBe('0.11.3+15')
    })

    test('should parse a valid Pub Dev Dart package page with dash in version', () => {
        const html = readFileSync(join(__dirname, 'testdata/dart-fpdart-2.0.0-dev.1.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            "https://pub.dev/packages/fpdart/versions/2.0.0-dev.1"
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pub)
        expect(packageURL?.name).toBe('fpdart')
        expect(packageURL?.version).toBe('2.0.0-dev.1')
    })
})
