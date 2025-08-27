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
import { generatePackageURLComplete } from '../purl-utils'
import { BasePageParser } from './base'
import { BaseRepo } from '../repo-type/base'
import { EmberDOMSelector } from '../../content/frameworks/ember'
import { DEFAULT_EMBER_DOM_SELECTOR_TIMEOUT } from '../constants'

export class CratesIoPageParser extends BasePageParser {

    private emberDomSelector: EmberDOMSelector

    constructor(readonly repoType: BaseRepo, readonly enableDomAnnotation: boolean = true) {
        super(repoType, enableDomAnnotation)
        this.emberDomSelector = new EmberDOMSelector({timeout: DEFAULT_EMBER_DOM_SELECTOR_TIMEOUT})
    }

    annotateDomPageTitle = () => {
        if (this.enableDomAnnotation) {
            logger.logContent(`Adding classes to ${this.repoType.titleSelector}`, LogLevel.DEBUG)
            const titleElements = this.emberDomSelector.selectElementsSync('h1')
            logger.logContent(`Found Title Elements`, LogLevel.DEBUG, titleElements)
            for (const e of titleElements) {
                $(e).addClass('sonatype-extension sonatype-page-title sonatype-pending')
            }
            // $(this.repoType.titleSelector).first().addClass('sonatype-extension sonatype-page-title sonatype-pending')
        }
    }

    parsePage(url: string): PackageURL[] {
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const pageVersionElements = this.emberDomSelector.selectElementsSync(this.repoType.versionDomPath)
            let pageVersion = ''
            if (pageVersionElements.length > 0) {
                const e = pageVersionElements.pop() as Element
                if (e) pageVersion = (e.textContent || '').trim()
            }
                
            // $(this.repoType.versionDomPath).text().trim()
            logger.logContent(`URL Version: ${pathResults.groups.version}, Page Version: ${pageVersion}`, LogLevel.DEBUG)
            const p = generatePackageURLComplete(
                this.repoType.purlType,
                encodeURIComponent(pathResults.groups.artifactId),
                pathResults.groups.version ?? pageVersion.replace('v', ''),
                undefined,
                {},
                undefined
            )
            this.annotateDomForPurl(p)
            return [p]
        }
        return []
    }
}