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
import { FORMATS, REPOS, REPO_TYPES } from '../Constants'
import { generatePackageURL } from './PurlUtils'

const PYPI_DEFAULT_EXTENSION = 'tar.gz'
const PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS = [PYPI_DEFAULT_EXTENSION, 'tar.bz2']
const PYPI_EXTENSION_SELECTOR = '#files > div.file div.file__card A:nth-child(1)'

const parsePyPIURL = (url: string): PackageURL | undefined => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.pypiOrg)
    console.debug('*** REPO TYPE: ', repoType)
    if (repoType) {
        const pathResult = repoType.pathRegex.exec(url.replace(repoType.url, ''))
        console.debug(pathResult?.groups)
        if (pathResult && pathResult.groups) {
            console.debug($(repoType.versionDomPath))
            const pageVersion = $(repoType.versionDomPath).text().trim().split(' ')[1]
            console.debug(`URL Version: ${pathResult.groups.version}, Page Version: ${pageVersion}`)
            const firstDistributionFilename = $(PYPI_EXTENSION_SELECTOR).first().text().trim()
            let candidateExtension: string | undefined = undefined
            for (const i in PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS) {
                if (firstDistributionFilename.endsWith(PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS[i])) {
                    candidateExtension = PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS[i]
                    break
                }
            }
            let extension
            if (candidateExtension === undefined) {
                extension = firstDistributionFilename.split('.').pop() as string
            } else {
                extension = candidateExtension
            }

            console.debug(
                `Parsing ${firstDistributionFilename} - given: Artifact ID = ${pathResult.groups.artifactId}, Version = ${pageVersion}, Extension = ${extension}`
            )
            const start = pathResult.groups.artifactId.length + pageVersion.length + 2
            const end = firstDistributionFilename.length - extension.length - 1
            const qualifier = firstDistributionFilename.substring(start, end)

            const qualifiers = {
                extension: extension,
            }
            if (qualifier.length > 1) {
                qualifiers['qualifier'] = qualifier
            }
            
            return generatePackageURL(
                FORMATS.pypi,
                pathResult.groups.artifactId,
                pathResult.groups.version !== undefined ? pathResult.groups.version : pageVersion,
                qualifiers
            )
        }
    } else {
        console.error('Unable to determine REPO TYPE.')
    }

    return undefined
}

export { parsePyPIURL }
