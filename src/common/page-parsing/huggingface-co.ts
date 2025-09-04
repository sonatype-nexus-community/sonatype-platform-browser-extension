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
import { logger, LogLevel } from '../logger'
import { generatePackageURLComplete } from '../purl-utils'
import { BaseRepo } from '../repo-type/base'
import { stripHtmlComments } from '../string'
import { BasePageParser } from './base'
import { BaseHuggingFaceParser } from './hugging-face/base'
import { GGUFHuggingFaceParser } from './hugging-face/gguf'
import { PytorchHuggingFaceParser } from './hugging-face/pytorch'
import { SafetensorsHuggingFaceParser } from './hugging-face/safetensors'
import { TensorFlowHuggingFaceParser } from './hugging-face/tensor-flow'
import { OpenVinoHuggingFaceParser } from './hugging-face/openvino'
import { RustHuggingFaceParser } from './hugging-face/rust'
import { FlaxJaxHuggingFaceParser } from './hugging-face/flax-jax'
import { OnnxHuggingFaceParser } from './hugging-face/onnx'
import { MlcLlmHuggingFaceParser } from './hugging-face/mlc-llm'

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
        // Rust
        this.PARSERS.push(new RustHuggingFaceParser())
        // OpenVino
        this.PARSERS.push(new OpenVinoHuggingFaceParser())
        // Flax/Jax
        this.PARSERS.push(new FlaxJaxHuggingFaceParser())
        // ONNX
        this.PARSERS.push(new OnnxHuggingFaceParser())
        // MLC-LLM
        this.PARSERS.push(new MlcLlmHuggingFaceParser())
    }

    async parsePage(url: string): Promise<PackageURL[]> {
        let allPagePurls: PackageURL[] = []
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const artifactName = pathResults.groups.artifactId
            const artifactNamespace = pathResults.groups.namespace
            const pageDomFileRows = $(FILE_ROW_SELECTOR)
            logger.logContent(`DOM File Rows: ${pageDomFileRows.length}`, LogLevel.DEBUG)

            for (const domFileRow of pageDomFileRows) {
                const foundPurls = this.processDomRowATags(artifactName, artifactNamespace, $(domFileRow))
                allPagePurls = allPagePurls.concat(foundPurls)
            }
        }

        logger.logContent(`Discovered ${allPagePurls.length} PURLs`, LogLevel.DEBUG)
        return allPagePurls
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
                    logger.logContent(`    PURL Match for Filename: ${fileName}, File Version: ${fileVersion}, Download URL: ${fileDownloadUrl}`, LogLevel.DEBUG)
                    const qualifiers = hfParser.getPurlAdapter().qualifiers(fileName)
                    const p = generatePackageURLComplete(
                        this.repoType.purlType,
                        artifactName,
                        fileVersion,
                        artifactNamespace,
                        qualifiers,
                        undefined
                    )
                    // Disabled for now - see https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/191
                    // this.annotateDomForPurl(p, domFileRow)
                    matchedPurls.push(p)
                }
            })
        }

        return matchedPurls
    }
}
