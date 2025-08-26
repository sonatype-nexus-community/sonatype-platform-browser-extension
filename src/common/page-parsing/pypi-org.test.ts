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
import { PypiOrgPageParser } from './pypi-org'
import { PypiOrgRepo } from '../repo-type/pypi-org'

const parser = new PypiOrgPageParser(new PypiOrgRepo)

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
        expect(p?.qualifiers).toEqual(e?.qualifiers)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('pypi.org Page Parsing', () => {
    
    test('Django/', () => {
        assertPageParsing(
            'https://pypi.org/project/Django/',
            'pypi.org/Django-4.2.1.html',
            [
                PackageURL.fromString('pkg:pypi/django@4.2.1?extension=tar.gz'),
                PackageURL.fromString('pkg:pypi/django@4.2.1?extension=whl&qualifier=py3-none-any')
            ]
        )
    })

    test('Django/4.2.1/', () => {
        assertPageParsing(
            'https://pypi.org/project/Django/4.2.1/',
            'pypi.org/Django-4.2.1.html',
            [
                PackageURL.fromString('pkg:pypi/django@4.2.1?extension=tar.gz'),
                PackageURL.fromString('pkg:pypi/django@4.2.1?extension=whl&qualifier=py3-none-any')
            ]
        )
    })

    test('Django/4.2.1/ + Query & Fragment', () => {
        assertPageParsing(
            'https://pypi.org/project/Django/4.2.1/?a=c#r',
            'pypi.org/Django-4.2.1.html',
            [
                PackageURL.fromString('pkg:pypi/django@4.2.1?extension=tar.gz'),
                PackageURL.fromString('pkg:pypi/django@4.2.1?extension=whl&qualifier=py3-none-any')
            ]
        )
    })

    test('numpy/1.14.0/ (source = ZIP)', () => {
        assertPageParsing(
            'https://pypi.org/project/numpy/1.14.0/',
            'pypi.org/numpy-1.14.0.html',
            [
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=zip'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp36-none-win_amd64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp36-none-win32'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp36-cp36m-manylinux1_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp36-cp36m-manylinux1_i686'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp36-cp36m-macosx_10_6_intel.macosx_10_9_intel.macosx_10_9_x86_64.macosx_10_10_intel.macosx_10_10_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp35-none-win_amd64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp35-none-win32'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp35-cp35m-manylinux1_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp35-cp35m-manylinux1_i686'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp35-cp35m-macosx_10_6_intel.macosx_10_9_intel.macosx_10_9_x86_64.macosx_10_10_intel.macosx_10_10_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp34-none-win_amd64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp34-none-win32'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp34-cp34m-manylinux1_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp34-cp34m-manylinux1_i686'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp34-cp34m-macosx_10_6_intel.macosx_10_9_intel.macosx_10_9_x86_64.macosx_10_10_intel.macosx_10_10_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-none-win_amd64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-none-win32'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-cp27mu-manylinux1_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-cp27mu-manylinux1_i686'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-cp27m-manylinux1_x86_64'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-cp27m-manylinux1_i686'),
                PackageURL.fromString('pkg:pypi/numpy@1.14.0?extension=whl&qualifier=cp27-cp27m-macosx_10_6_intel.macosx_10_9_intel.macosx_10_9_x86_64.macosx_10_10_intel.macosx_10_10_x86_64'),
            ]
        )
    })

    test('Twisted/19.2.0/ (source = tar.bz2)', () => {
        assertPageParsing(
            'https://pypi.org/project/Twisted/19.2.0/',
            'pypi.org/Twisted-19.2.0.html',
            [
                PackageURL.fromString('pkg:pypi/twisted@19.2.0?extension=tar.bz2'),
                PackageURL.fromString('pkg:pypi/twisted@19.2.0?extension=whl&qualifier=cp27-cp27m-win_amd64')
            ]
        )
    })

    test('mediapipe/0.10.14/ (No Source Dist))', () => {
        assertPageParsing(
            'https://pypi.org/project/mediapipe/0.10.14/',
            'pypi.org/mediapipe-0.10.14.html',
            [
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp312-cp312-win_amd64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp312-cp312-manylinux_2_17_x86_64.manylinux2014_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp312-cp312-manylinux_2_17_aarch64.manylinux2014_aarch64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp312-cp312-macosx_11_0_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp312-cp312-macosx_11_0_universal2'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp311-cp311-win_amd64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp311-cp311-manylinux_2_17_aarch64.manylinux2014_aarch64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp311-cp311-macosx_11_0_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp311-cp311-macosx_11_0_universal2'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp310-cp310-win_amd64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp310-cp310-manylinux_2_17_aarch64.manylinux2014_aarch64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp310-cp310-macosx_11_0_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp310-cp310-macosx_11_0_universal2'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp39-cp39-win_amd64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp39-cp39-manylinux_2_17_x86_64.manylinux2014_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp39-cp39-manylinux_2_17_aarch64.manylinux2014_aarch64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp39-cp39-macosx_11_0_x86_64'),
                PackageURL.fromString('pkg:pypi/mediapipe@0.10.14?extension=whl&qualifier=cp39-cp39-macosx_11_0_universal2')
            ]
        )
    })
})
