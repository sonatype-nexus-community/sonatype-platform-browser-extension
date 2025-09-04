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

import { BaseHuggingFaceParser } from "./base"
import { BaseHuggingFacePurlAdapter, BasicHuggingFacePurlAdapter } from "./purl-adapter"

export class RustHuggingFaceParser extends BaseHuggingFaceParser {

    protected loadPurlAdapter(): BaseHuggingFacePurlAdapter {
        return new BasicHuggingFacePurlAdapter('ot', 'rust_model', 'rust')
    }

    hasMatches(filename: string): boolean {
        // Match *.ot
        if (filename.toLowerCase().endsWith('.ot')) {
            return true
        }

        return false
    }
}