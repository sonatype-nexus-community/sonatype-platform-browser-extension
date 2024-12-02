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

import $, { Cash } from 'cash-dom'
import { PackageURL } from 'packageurl-js'
import { generatePackageURLComplete } from './PurlUtils'
import { FORMATS } from '../Constants'
import { stripHtmlComments } from '../Helpers'
import { logger, LogLevel } from '../../logger/Logger'
import { BasePageParser } from './BasePageParser'
import { BaseRepo } from '../RepoType/BaseRepo'

const FILE_ROW_SELECTOR = 'div.contents > ul > li'

interface HuggingFaceQualifiers {
    [key: string]: string
}

abstract class BaseHuggingFacePurlAdapter {
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

class BasicHuggingFacePurlAdapter extends BaseHuggingFacePurlAdapter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    qualifiers(_filename: string): HuggingFaceQualifiers {
        return {
            extension: this.extension,
            model: this.model,
            model_format: this.modelFormat
        }
    }
}

class FilenameHuggingFacePurlAdapter extends BaseHuggingFacePurlAdapter {
    qualifiers(filename: string): HuggingFaceQualifiers {
        return {
            extension: this.extension,
            model: filename.substring(0, filename.length - this.extension.length - 1),
            model_format: this.modelFormat
        }
    }
}

export class HuggingfaceCoPageParser extends BasePageParser {

    ADAPTER_MAP: Map<string, BaseHuggingFacePurlAdapter> = new Map<string, BaseHuggingFacePurlAdapter>()
    SUPPORTED_FILE_EXTENSIONS

    constructor(readonly repoType: BaseRepo) {
        super(repoType)
        // Safetensors
        this.ADAPTER_MAP.set('.safetensors', new BasicHuggingFacePurlAdapter('safetensors', 'model', 'safetensors'))
        // Tensorflow
        this.ADAPTER_MAP.set('.h5', new BasicHuggingFacePurlAdapter('h5', 'tf_model', 'tensorflow'))
        // GGUF
        this.ADAPTER_MAP.set('.gguf', new FilenameHuggingFacePurlAdapter('gguf', undefined, 'gguf'))

        this.SUPPORTED_FILE_EXTENSIONS = Array.from(this.ADAPTER_MAP.keys())
    }

    parsePage(url: string): PackageURL[] {
        let allPagePurls: PackageURL[] = []
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const artifactName = pathResults.groups.artifactId
            const artifactNamespace = pathResults.groups.namespace
            const pageDomFileRows = $(FILE_ROW_SELECTOR)
            logger.logMessage(`DOM File Rows: ${pageDomFileRows.length}`, LogLevel.DEBUG)

            for (const domFileRow of pageDomFileRows) {
                const foundPurls = this.processDomRowATags(artifactName, artifactNamespace, $('a', domFileRow))
                allPagePurls = allPagePurls.concat(foundPurls)
            }
        }

        logger.logMessage(`Discovered ${allPagePurls.length} PURLs`, LogLevel.DEBUG)
        return allPagePurls
    }

    private processDomRowATags(artifactName: string, artifactNamespace: string, domFileRowATags: Cash): PackageURL[] {
        if (domFileRowATags.length < 4) {
            return []
        }

        const fileName = stripHtmlComments(domFileRowATags.first().text()).trim()
        const fileDownloadUrl = domFileRowATags.get(3)?.getAttribute('href')
        const fileVersion = fileDownloadUrl?.split('/').pop()
        const matchedPurls: PackageURL[] = []
        if (fileVersion != undefined) {
            this.SUPPORTED_FILE_EXTENSIONS.forEach((candidateExtension: string) => { 
                if (fileName.endsWith(candidateExtension)) {
                    const adapter = this.ADAPTER_MAP.get(candidateExtension)
                    if (adapter) {
                        logger.logMessage(`    PURL Match for Filename: ${fileName}, File Version: ${fileVersion}, Download URL: ${fileDownloadUrl}`, LogLevel.DEBUG)
                        const qualifiers = adapter.qualifiers(fileName)
                        const p = generatePackageURLComplete(
                            FORMATS.huggingface,
                            artifactName,
                            fileVersion,
                            artifactNamespace,
                            qualifiers,
                            undefined
                        )
                        matchedPurls.push(p)
                    }
                }
            })
        }

        return matchedPurls
    }
}
