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

export class TensorFlowHuggingFaceParser extends BaseHuggingFaceParser {

    protected loadPurlAdapter(): BaseHuggingFacePurlAdapter {
        return new BasicHuggingFacePurlAdapter('h5', 'tf_model', 'tensorflow')
    }

    hasMatches(filename: string): boolean {
        // Match *.h5
        if (filename.toLowerCase().endsWith('.h5')) {
            return true
        }

        return false
    }
}