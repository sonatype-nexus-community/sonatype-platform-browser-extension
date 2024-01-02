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
import { ensure } from '../Helpers'
import { getArtifactDetailsFromDOM } from '../PageParsing'

describe('PyPI Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.pypiOrg)
    expect(repoType).toBeDefined()

    test('should parse a valid PyPI page', () => {
        const html = readFileSync(join(__dirname, 'testdata/pypi-Django-4.2.1.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromDOM(ensure(repoType), 'https://pypi.org/project/Django/')

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pypi)
        expect(packageURL?.name).toBe('Django')
        expect(packageURL?.version).toBe('4.2.1')
        expect(packageURL?.qualifiers).toEqual({ extension: 'tar.gz' })
    })

    test('should parse valid PyPI page with the version', () => {
        const html = readFileSync(join(__dirname, 'testdata/pypi-Django-4.2.1.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromDOM(ensure(repoType), 'https://pypi.org/project/Django/4.2/')

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pypi)
        expect(packageURL?.name).toBe('Django')
        expect(packageURL?.version).toBe('4.2')
        expect(packageURL?.qualifiers).toEqual({ extension: 'tar.gz' })
    })

    test('should parse valid PyPI page with the version, query string and fragment', () => {
        const html = readFileSync(join(__dirname, 'testdata/pypi-Django-4.2.1.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pypi.org/project/Django/4.2/?some=thing#else'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pypi)
        expect(packageURL?.name).toBe('Django')
        expect(packageURL?.version).toBe('4.2')
        expect(packageURL?.qualifiers).toEqual({ extension: 'tar.gz' })
    })

    test('should parse valid PyPI page where the SOURCE format is .zip', () => {
        const html = readFileSync(join(__dirname, 'testdata/pypi-numpy-1.14.0.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pypi.org/project/numpy/1.14.0/'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pypi)
        expect(packageURL?.name).toBe('numpy')
        expect(packageURL?.version).toBe('1.14.0')
        expect(packageURL?.qualifiers).toEqual({ extension: 'zip' })
    })

    test('should parse valid PyPI page where the SOURCE format is .tar.bz2', () => {
        const html = readFileSync(join(__dirname, 'testdata/pypi-Twisted-19.2.0.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://pypi.org/project/Twisted/19.2.0/'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe(FORMATS.pypi)
        expect(packageURL?.name).toBe('Twisted')
        expect(packageURL?.version).toBe('19.2.0')
        expect(packageURL?.qualifiers).toEqual({ extension: 'tar.bz2' })
    })
})
