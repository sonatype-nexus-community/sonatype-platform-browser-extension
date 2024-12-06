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
import { FORMATS, REPOS } from '../Constants'
import { stripHtmlComments } from '../Helpers'
import { logger, LogLevel } from '../../logger/Logger'
import { BasePageParser } from './BasePageParser'
import { BaseRepo } from '../RepoType/BaseRepo'
import { BaseHuggingFaceParser } from './HuggingFace/HfParser'
import { PytorchHuggingFaceParser } from './HuggingFace/HfParserPytorch'
import { SafetensorsHuggingFaceParser } from './HuggingFace/HfParserSafetensors'
import { TensorFlowHuggingFaceParser } from './HuggingFace/HfParserTensorFlow'
import { GGUFHuggingFaceParser } from './HuggingFace/HfParserGGUF'

const FILE_ROW_SELECTOR = 'div.contents > ul > li'

export class HuggingfaceCoPageParser extends BasePageParser {

    PARSERS: BaseHuggingFaceParser[] = []

    constructor(readonly repoType: BaseRepo) {
        super(repoType)
        // Pytorch
        this.PARSERS.push(new PytorchHuggingFaceParser())
        // Safetensors
        this.PARSERS.push(new SafetensorsHuggingFaceParser())
        // Tensorflow
        this.PARSERS.push(new TensorFlowHuggingFaceParser())
        // GGUF
        this.PARSERS.push(new GGUFHuggingFaceParser())
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
                const foundPurls = this.processDomRowATags(artifactName, artifactNamespace, $(domFileRow))
                allPagePurls = allPagePurls.concat(foundPurls)
            }
        }

        logger.logMessage(`Discovered ${allPagePurls.length} PURLs`, LogLevel.DEBUG)
        return allPagePurls
    }

    getDomNodeForPurl(url: string, purl: PackageURL): Cash {
        let targetDomNode: Cash | undefined
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const artifactName = pathResults.groups.artifactId
            const artifactNamespace = pathResults.groups.namespace
            const pageDomFileRows = $(FILE_ROW_SELECTOR)
            logger.logMessage(`DOM File Rows: ${pageDomFileRows.length}`, LogLevel.DEBUG)

            for (const domFileRow of pageDomFileRows) {
                const foundPurls = this.processDomRowATags(artifactName, artifactNamespace, $(domFileRow))
                foundPurls.forEach((p) => {
                    if (p.toString() == purl.toString()) {
                        targetDomNode = $(domFileRow)
                    }
                })
            }
        }

        if (targetDomNode) {
            return targetDomNode
        }

        return super.getDomNodeForPurl(url, purl)
    }

    private processDomRowATags(artifactName: string, artifactNamespace: string, domFileRow: Cash): PackageURL[] {
        const domFileRowATags = $('a', domFileRow)
        if (domFileRowATags.length < 4) {
            return []
        }

        const fileName = stripHtmlComments(domFileRowATags.first().text()).trim()
        const fileDownloadUrl = domFileRowATags.get(3)?.getAttribute('href')
        const fileVersion = fileDownloadUrl?.split('/').pop()
        const matchedPurls: PackageURL[] = []
        if (fileVersion != undefined) {
            this.PARSERS.forEach((hfParser: BaseHuggingFaceParser) => { 
                if (hfParser.hasMatches(fileName)) {
                    logger.logMessage(`    PURL Match for Filename: ${fileName}, File Version: ${fileVersion}, Download URL: ${fileDownloadUrl}`, LogLevel.DEBUG)
                    const qualifiers = hfParser.getPurlAdapter().qualifiers(fileName)
                    const p = generatePackageURLComplete(
                        FORMATS.huggingface,
                        artifactName,
                        fileVersion,
                        artifactNamespace,
                        qualifiers,
                        undefined
                    )
                    this.annotateDomForPurl(p, domFileRow)
                    matchedPurls.push(p)
                }
            })
        }

        return matchedPurls
    }
}
