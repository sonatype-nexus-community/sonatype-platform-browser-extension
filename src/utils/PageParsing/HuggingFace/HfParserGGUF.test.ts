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
import { GGUFHuggingFaceParser } from './HfParserGGUF'

describe('HF Parsing: GGUFHuggingFaceParser', () => {
    const parser = new GGUFHuggingFaceParser()
    
    it.each([
        {
            name: 'MATCH: OuteTTS-0.2-500M-FP16.gguf',
            filename: 'OuteTTS-0.2-500M-FP16.gguf',
            matches: true
        },
        {
            name: 'NO-MATCH: README.md',
            filename: 'README.md',
            matches: false
        }
    ])('$name', ({ filename, matches }) => { 
        expect(parser.hasMatches(filename)).toEqual(matches)
    })
})