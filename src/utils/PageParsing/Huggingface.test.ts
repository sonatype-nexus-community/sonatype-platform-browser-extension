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
import { FORMATS, REPOS, REPO_TYPES, RepoType } from '../Constants'
import { ensure } from '../Helpers'
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { PackageURL } from 'packageurl-js'

function assertPageParsing(repoType: RepoType, url: string, domFile: string | undefined, expected: PackageURL | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(repoType, url)
    if (expected) {
        expect(packageURL).toBeDefined()
        expect(packageURL?.version).toBe(expected.version)
        expect(packageURL?.namespace).toBe(expected.namespace)
        expect(packageURL?.name).toBe(expected.name)
    } else {
        expect(packageURL).not.toBeDefined()
    }
} 

describe('Huggingface Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.huggingfaceCo)
    expect(repoType).toBeDefined()

    test('MODEL: Should Parse Tensorflow from distilbert/distilbert-base-uncased', () => {
        const expectedPackageUrl = PackageURL.fromString('pkg:huggingface/distilbert/distilbert-base-uncased@1c4513b2eedbda136f57676a34eea67aba266e5c?extension=safetensors&model=model&model_format=safetensors')
        assertPageParsing(ensure(repoType), 'https://huggingface.co/distilbert/distilbert-base-uncased', 'huggingface.co/distilbert-distilbert-base-uncased-1.html', expectedPackageUrl)
    })
})
