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
import { generatePackageURL } from '../purl-utils'
import { logger, LogLevel } from '../logger'
import { BasePageParser } from './base'
import { RepoFormat } from '../repo-type/types'

const PYPI_DEFAULT_EXTENSION = 'tar.gz'
const PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS = [PYPI_DEFAULT_EXTENSION, 'tar.bz2']
const PYPI_EXTENSION_SELECTOR = '#files > div.file div.file__card'

export class PypiOrgPageParser extends BasePageParser {
    parsePage(url: string): PackageURL[] {
        let allPagePurls: PackageURL[] = []
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const pageVersion = $(this.repoType.versionDomPath).text().trim().split(' ')[1]
            logger.logContent(`URL Version: ${pathResults.groups.version}, Page Version: ${pageVersion}`, LogLevel.DEBUG)

            const thisVersion = pathResults.groups.version ?? pageVersion
            const distributionFilenames = $(PYPI_EXTENSION_SELECTOR)
            for (const distributionFilename of distributionFilenames) {
                allPagePurls = allPagePurls.concat(
                    this.processDomFileCard(pathResults.groups.artifactId, thisVersion, $(distributionFilename))
                )
            }
        }
        
        return allPagePurls
    }

    private processDomFileCard(artifactName: string, artifactVersion: string, distributionFilename: Cash): PackageURL[] {
        const distributionFilenameSafe = $('a:nth-child(1)', distributionFilename).text().trim()

        let candidateExtension: string | undefined = undefined
        for (const i in PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS) {
            if (distributionFilenameSafe.endsWith(PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS[i])) {
                candidateExtension = PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS[i]
                break
            }
        }
        let extension: string
        if (candidateExtension === undefined) {
            extension = distributionFilenameSafe.split('.').pop() as string
        } else {
            extension = candidateExtension
        }

        logger.logContent(
            `Parsing ${distributionFilenameSafe} - given: Artifact ID = ${artifactName}, Version = ${artifactVersion}, Extension = ${extension}`,
            LogLevel.DEBUG
        )
        const start = artifactName.length + artifactVersion.length + 2
        const end = distributionFilenameSafe.length - extension.length - 1
        const qualifier = distributionFilenameSafe.substring(start, end)

        const qualifiers = {
            extension: extension,
        }
        if (qualifier.length > 1) {
            qualifiers['qualifier'] = qualifier
        }
        
        const p = generatePackageURL(
            RepoFormat.PYPI,
            artifactName,
            artifactVersion,
            qualifiers
        )
        this.annotateDomForPurl(p, $(distributionFilename))
        
        return [p]
    }
}
