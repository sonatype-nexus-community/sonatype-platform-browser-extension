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
import { generatePackageURL, generatePackageURLComplete, generatePackageURLWithNamespace } from './PurlUtils'
import { FORMATS, REPOS, REPO_TYPES } from '../Constants'
import { stripHtmlComments } from '../Helpers'

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

const parseHuggingface = (url: string): PackageURL | undefined => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.huggingfaceCo)
    console.debug('*** REPO TYPE: ', repoType)
    if (repoType) {
        const pathResult = repoType.pathRegex.exec(url.replace(repoType.url, ''))
        console.debug(pathResult?.groups)
        if (pathResult && pathResult.groups) {
            const artifactName = pathResult.groups.artifactId
            const artifactNamespace = pathResult.groups.namespace
            const pageDomFileRows = $(FILE_ROW_SELECTOR)
            console.debug(`DOM File Rows: ${pageDomFileRows.length}`)

            for (const domFileRow of pageDomFileRows) {
                const domFileRowATags = $('a', domFileRow)
                if (domFileRowATags.length < 4) {
                    continue
                }

                const fileName = stripHtmlComments(domFileRowATags.first().text()).trim()
                const fileDownloadUrl = domFileRowATags.get(3)?.getAttribute('href')
                const fileVersion = fileDownloadUrl?.split('/').pop()
                console.debug(`    Filename: ${fileName}, File Version: ${fileVersion}, Download URL: ${fileDownloadUrl}`)

                if (fileVersion != undefined) {
                    for (const i in Object.keys(FILE_EXTENSION_MAP)) {
                        const candidateExtension = Object.keys(FILE_EXTENSION_MAP)[i]
                        if (fileName.endsWith(candidateExtension)) {
                            return generatePackageURLComplete(
                                FORMATS.huggingface,
                                artifactName,
                                fileVersion,
                                artifactNamespace,
                                FILE_EXTENSION_MAP[candidateExtension]['qualifiers'],
                                undefined
                            )
                        }
                    }
                }
            }

            return undefined
        }
    } else {
        console.error('Unable to determine REPO TYPE.')
    }

    return undefined
}

export { parseHuggingface }
