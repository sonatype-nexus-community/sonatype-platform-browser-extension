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
import { PackageURL } from 'packageurl-js'
import { friendlyPackageUrlString, getPurlHash, getQualifiersString } from './purl-utils'

describe('Common : PURL Utils', () => {
    // friendlyPackageUrlString
    test('friendlyPackageUrlString HuggingFace PyTorch Bin', () => {
        expect(
            friendlyPackageUrlString(PackageURL.fromString('pkg:huggingface/distilbert/distilbert-base-uncased@00c3efe70d39bd4d70341e7ac77ad94e2d95783f?extension=bin&model=pytorch_model&model_format=pytorch'))
        ).toEqual('pytorch_model.bin (00c3efe70d39bd4d7034)')
    })

    test('friendlyPackageUrlString PyPi .tar.gz', () => {
        expect(
            friendlyPackageUrlString(PackageURL.fromString('pkg:pypi/feedparser@6.0.10?extension=tar.gz'))
        ).toEqual('feedparser@6.0.10 (Source: tar.gz)')
    })

    // getPurlHash
    test('getPurlHash Is Deterministic', () => {
        expect(getPurlHash(PackageURL.fromString('pkg:pypi/feedparser@6.0.10?extension=tar.gz'))).toEqual(1678437504)
    })

    // getQualifiersString
    test('getQualifiersString PyPi tar.gz', () => {
        expect(
            getQualifiersString(PackageURL.fromString('pkg:pypi/feedparser@6.0.10?extension=tar.gz'))
        ).toEqual('Source: tar.gz')
    })
     test('getQualifiersString PyPi WHL', () => {
        expect(
            getQualifiersString(PackageURL.fromString('pkg:pypi/feedparser@6.0.10?extension=whl&qualifier=py3-none-any'))
        ).toEqual('Wheel: py3-none-any')
    })
})
