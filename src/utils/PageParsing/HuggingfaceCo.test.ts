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
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { PackageURL } from 'packageurl-js'
import { HuggingfaceCoRepo } from './HuggingfaceCo'

const repo = new HuggingfaceCoRepo

function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = getArtifactDetailsFromDOM(repo, url)
    if (expected) {
        expect(packageURLs).toBeDefined()
        expect(packageURLs?.length).toBe(expected.length)
        const p = packageURLs?.pop()
        const e = expected.pop()
        expect(p).toBeDefined()
        expect(p?.namespace).toBe(e?.namespace)
        expect(p?.name).toBe(e?.name)
        expect(p?.version).toBe(e?.version)
        expect(p?.qualifiers).toEqual(e?.qualifiers)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('huggingface.co Page Parsing', () => {
    test('MODEL: Should Parse Tensorflow from distilbert/distilbert-base-uncased', () => {
        assertPageParsing(
            'https://huggingface.co/distilbert/distilbert-base-uncased',
            'huggingface.co/distilbert-distilbert-base-uncased-home.html',
            undefined)
    })

    test('MODEL: Should Parse Tensorflow from distilbert/distilbert-base-uncased/tree/main', () => {
        assertPageParsing(
            'https://huggingface.co/distilbert/distilbert-base-uncased/tree/main',
            'huggingface.co/distilbert-distilbert-base-uncased-tree-main.html',
            [PackageURL.fromString('pkg:huggingface/distilbert/distilbert-base-uncased@1c4513b2eedbda136f57676a34eea67aba266e5c?extension=safetensors&model=model&model_format=safetensors')]
        )
    })
})
