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
import { FORMATS, REPOS } from '../Constants'
import { generatePackageURL } from './PurlUtils'
import { BaseRepo } from '../Types'
import { logger, LogLevel } from '../../logger/Logger'

const PYPI_DEFAULT_EXTENSION = 'tar.gz'
const PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS = [PYPI_DEFAULT_EXTENSION, 'tar.bz2']
const PYPI_EXTENSION_SELECTOR = '#files > div.file div.file__card a:nth-child(1)'

export class PypiOrgRepo extends BaseRepo {
    id(): string {
        return REPOS.pypiOrg
    }
    format(): string {
        return FORMATS.pypi
    }
    baseUrl(): string {
        return 'https://pypi.org/project/'
    }
    titleSelector(): string {
        return 'h1.package-header__name1'
    }
    versionPath(): string {
        return '{artifactId}/{version}'
    }
    pathRegex(): RegExp {
        return /^(?<artifactId>[^/?#]*)\/((?<version>[^?#]*)\/)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return '#content > div.banner > div > div.package-header__left > h1'
    }
    supportsVersionNavigation(): boolean {
        return true
    }
    supportsMultiplePurlsPerPage(): boolean {
        return false
    }
    
    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults && pathResults.groups) {
            const pageVersion = $(this.versionDomPath()).text().trim().split(' ')[1]
            logger.logMessage(`URL Version: ${pathResults.groups.version}, Page Version: ${pageVersion}`, LogLevel.DEBUG)

            const thisVersion = pathResults.groups.version !== undefined ? pathResults.groups.version : pageVersion

            const firstDistributionFilename = $(PYPI_EXTENSION_SELECTOR).first().text().trim()
            let candidateExtension: string | undefined = undefined
            for (const i in PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS) {
                if (firstDistributionFilename.endsWith(PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS[i])) {
                    candidateExtension = PYPI_KNOWN_SOURCE_DISTRIBUTION_EXTENSIONS[i]
                    break
                }
            }
            let extension: string
            if (candidateExtension === undefined) {
                extension = firstDistributionFilename.split('.').pop() as string
            } else {
                extension = candidateExtension
            }

            logger.logMessage(
                `Parsing ${firstDistributionFilename} - given: Artifact ID = ${pathResults.groups.artifactId}, Version = ${pageVersion}, Extension = ${extension}`,
                LogLevel.DEBUG
            )
            const start = pathResults.groups.artifactId.length + thisVersion.length + 2
            const end = firstDistributionFilename.length - extension.length - 1
            const qualifier = firstDistributionFilename.substring(start, end)

            const qualifiers = {
                extension: extension,
            }
            if (qualifier.length > 1) {
                qualifiers['qualifier'] = qualifier
            }
            
            return [generatePackageURL(
                FORMATS.pypi,
                pathResults.groups.artifactId,
                thisVersion,
                qualifiers
            )]
        }
        return []
    }
}
