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

export interface HuggingFaceQualifiers {
    [key: string]: string
}

export abstract class BaseHuggingFacePurlAdapter {
    protected extension: string
    protected model: string
    protected modelFormat: string

    constructor(extension: string, model?: string, modelFormat?: string) { 
        this.extension = extension
        this.model = model ?? ''
        this.modelFormat = modelFormat ?? ''
    }
    abstract qualifiers(filename: string): HuggingFaceQualifiers
}

export class BasicHuggingFacePurlAdapter extends BaseHuggingFacePurlAdapter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    qualifiers(_filename: string): HuggingFaceQualifiers {
        return {
            extension: this.extension,
            model: this.model,
            model_format: this.modelFormat
        }
    }
}

export class FilenameHuggingFacePurlAdapter extends BaseHuggingFacePurlAdapter {
    constructor(extension: string, modelFormat?: string) {
        super(extension, '', modelFormat)
    }

    qualifiers(filename: string): HuggingFaceQualifiers {
        return {
            extension: this.extension,
            model: filename.substring(0, filename.length - this.extension.length - 1),
            model_format: this.modelFormat
        }
    }
}