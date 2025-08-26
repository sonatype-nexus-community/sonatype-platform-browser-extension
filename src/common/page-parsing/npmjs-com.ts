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
import { generatePackageURLWithNamespace } from '../purl-utils'
import { stripHtmlComments } from '../string'
import { BasePageParser } from './base'

export class NpmJsComPageParser extends BasePageParser {
    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const pageVersion = stripHtmlComments($(this.repoType.versionDomPath).first().text()).split('•')[0].trim()
            const p = generatePackageURLWithNamespace(
                this.repoType.purlType,
                pathResults.groups.artifactId,
                pathResults.groups.version ?? pageVersion,
                pathResults.groups.groupId
            )
            this.annotateDomForPurl(p)
            return [p]
        }
        return []
    }
}
