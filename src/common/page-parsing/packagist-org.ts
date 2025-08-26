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
import { logger, LogLevel } from '../logger'
import { generatePackageURLWithNamespace } from '../purl-utils'
import { BasePageParser } from './base'

export class PackagistOrgPageParser extends BasePageParser {
    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const pageVersion = $(this.repoType.versionDomPath).text().trim()
            logger.logContent(`URL Version: ${pathResults.groups.version}, Page Version: ${pageVersion}`, LogLevel.DEBUG)
            const p = generatePackageURLWithNamespace(
                this.repoType.purlType,
                encodeURIComponent(pathResults.groups.artifactId),
                pathResults.groups.version ?? pageVersion,
                encodeURIComponent(pathResults.groups.groupId)
            )
            this.annotateDomForPurl(p)
            return [p]
        }
        return []
    }
}
