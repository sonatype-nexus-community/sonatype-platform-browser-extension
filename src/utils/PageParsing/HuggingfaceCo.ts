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

import $ from 'cash-dom'
import { PackageURL } from 'packageurl-js'
import { generatePackageURLComplete } from './PurlUtils'
import { FORMATS } from '../Constants'
import { stripHtmlComments } from '../Helpers'
import { logger, LogLevel } from '../../logger/Logger'
import { BasePageParser } from './BasePageParser'

const FILE_ROW_SELECTOR = 'div.contents > ul > li'
const FILE_EXTENSION_MAP = {
    ".safetensors": {
        "qualifiers": {
            "extension": "safetensors",
            "model": "model",
            "model_format": "safetensors"
        }
    }
}

export class HuggingfaceCoPageParser extends BasePageParser {
    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults && pathResults.groups) {
            const artifactName = pathResults.groups.artifactId
            const artifactNamespace = pathResults.groups.namespace
            const pageDomFileRows = $(FILE_ROW_SELECTOR)
            logger.logMessage(`DOM File Rows: ${pageDomFileRows.length}`, LogLevel.DEBUG)

            for (const domFileRow of pageDomFileRows) {
                const domFileRowATags = $('a', domFileRow)
                if (domFileRowATags.length < 4) {
                    continue
                }

                const fileName = stripHtmlComments(domFileRowATags.first().text()).trim()
                const fileDownloadUrl = domFileRowATags.get(3)?.getAttribute('href')
                const fileVersion = fileDownloadUrl?.split('/').pop()
                logger.logMessage(`    Filename: ${fileName}, File Version: ${fileVersion}, Download URL: ${fileDownloadUrl}`, LogLevel.DEBUG)

                if (fileVersion != undefined) {
                    for (const i in Object.keys(FILE_EXTENSION_MAP)) {
                        const candidateExtension = Object.keys(FILE_EXTENSION_MAP)[i]
                        if (fileName.endsWith(candidateExtension)) {
                            return [generatePackageURLComplete(
                                FORMATS.huggingface,
                                artifactName,
                                fileVersion,
                                artifactNamespace,
                                FILE_EXTENSION_MAP[candidateExtension]['qualifiers'],
                                undefined
                            )]
                        }
                    }
                }
            }
        }

        return []
    }
}
