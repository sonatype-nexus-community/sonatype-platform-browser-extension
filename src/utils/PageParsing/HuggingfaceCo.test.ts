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
import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { PackageURL } from 'packageurl-js'
import { HuggingfaceCoPageParser } from './HuggingfaceCo'
import { HuggingfaceCoRepo } from '../RepoType/HuggingfaceCo'

const parser = new HuggingfaceCoPageParser(new HuggingfaceCoRepo)

describe('huggingface.co Page Parsing', () => {
    it.each([
        {
            name: 'MODEL: Should Parse Tensorflow from distilbert/distilbert-base-uncased',
            url: 'https://huggingface.co/distilbert/distilbert-base-uncased',
            testFile: 'distilbert-distilbert-base-uncased-home.html',
            expectedPurls: []
        },
        {
            name: 'MODEL: Should Parse Tensorflow from distilbert/distilbert-base-uncased/tree/main',
            url: 'https://huggingface.co/distilbert/distilbert-base-uncased/tree/main',
            testFile: 'distilbert-distilbert-base-uncased-tree-main.html',
            expectedPurls: [
                PackageURL.fromString('pkg:huggingface/distilbert/distilbert-base-uncased@1c4513b2eedbda136f57676a34eea67aba266e5c?extension=safetensors&model=model&model_format=safetensors'),
                PackageURL.fromString('pkg:huggingface/distilbert/distilbert-base-uncased@00c3efe70d39bd4d70341e7ac77ad94e2d95783f?extension=bin&model=pytorch_model&model_format=pytorch'),
                PackageURL.fromString('pkg:huggingface/distilbert/distilbert-base-uncased@54625747c4a205b4dd4f2a14a0709eb4382edcb4?extension=h5&model=tf_model&model_format=tensorflow')
            ]
        },
        {
            name: 'MODEL: Should Parse GGUF from OuteAI/OuteTTS-0.2-500M-GGUF/tree/main',
            url: 'https://huggingface.co/OuteAI/OuteTTS-0.2-500M-GGUF/tree/main',
            testFile: 'OuteTTS-0.2-500M-GGUF-tree-main.html',
            expectedPurls: [
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-FP16&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q2_K&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q3_K_L&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q3_K_M&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q3_K_S&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q4_0&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q4_1&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q4_K_M&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q4_K_S&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q5_0&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q5_1&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q5_K_M&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q5_K_S&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q6_K&model_format=gguf'),
                PackageURL.fromString('pkg:huggingface/OuteAI/OuteTTS-0.2-500M-GGUF@ee3de04a4d6ca4b41d7f2598734636c08c82c713?extension=gguf&model=OuteTTS-0.2-500M-Q8_0&model_format=gguf'),
            ]
        },
        {
            name: 'MODEL: Should Parse Pytorch BIN from mohsen2/pytorch_model.bin/tree/main',
            url: 'https://huggingface.co/mohsen2/pytorch_model.bin/tree/main',
            testFile: 'mohsen2-pytorch-tree-main.html',
            expectedPurls: [
                PackageURL.fromString('pkg:huggingface/mohsen2/pytorch_model.bin@802c755142cb8be0c10e3673c0bddc8004791f81?extension=bin&model=pytorch_model&model_format=pytorch')
            ]
         }
    ])('$name', ({url, testFile, expectedPurls}) => { 
        if (testFile) {
            const html = readFileSync(join(__dirname, 'testdata', 'huggingface.co', testFile))
            window.document.body.innerHTML = html.toString()
        }
            
        const packageURLs = getArtifactDetailsFromDOM(parser, url)
        expect(packageURLs).toBeDefined()
        expect(packageURLs?.length).toBe(expectedPurls.length)

        if (expectedPurls.length > 0) {
            // All expected Purls
            let allExpectedPurlStrings: string[] = expectedPurls.map((p) => p.toString())
            let matched = 0
            packageURLs?.forEach((p) => {
                if (allExpectedPurlStrings.includes(p.toString())) {
                    matched += 1
                    allExpectedPurlStrings = allExpectedPurlStrings.filter((ps) => { return ps !== p.toString() })
                }
            })
            if (allExpectedPurlStrings.length > 0) {
                console.error("Unmatched PURLS:", allExpectedPurlStrings)
                console.error("Discovered PURLS:", packageURLs?.map((p) => p.toString()))
            }
            expect(matched).toEqual(expectedPurls.length)
        }
    })
})
