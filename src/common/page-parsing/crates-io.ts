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
import { EmberDOMSelector } from '../../content/frameworks/ember'
import { DEFAULT_EMBER_DOM_SELECTOR_TIMEOUT } from './constants'
import { logger, LogLevel } from '../logger'
import { generatePackageURLComplete } from '../purl-utils'
import { BaseRepo } from '../repo-type/base'
import { BasePageParser } from './base'

export class CratesIoPageParser extends BasePageParser {

    private readonly emberDomSelector: EmberDOMSelector

    constructor(readonly repoType: BaseRepo, readonly enableDomAnnotation: boolean = true) {
        super(repoType, enableDomAnnotation)

        // This can be moved to BasePageParser later - keeping it isolated for crates for the time being
        this.emberDomSelector = new EmberDOMSelector({timeout: DEFAULT_EMBER_DOM_SELECTOR_TIMEOUT})
    }

    annotateDomPageTitle = () => {
        if (this.enableDomAnnotation) {
            logger.logContent(`Adding classes to ${this.repoType.titleSelector}`, LogLevel.DEBUG)
            this.emberDomSelector.selectElements(this.repoType.titleSelector).then((elements) => { 
                logger.logContent(`Found Title Elements`, LogLevel.DEBUG, elements)
                for (const e of elements) {
                    $(e).addClass('sonatype-extension sonatype-page-title sonatype-pending')
                }
            })
        }
    }

    async parsePage(url: string): Promise<PackageURL[]> {
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const elements = await this.emberDomSelector.selectElements(this.repoType.versionDomPath)
            let pageVersion = ''
            if (elements.length > 0) {
                const e = elements.pop()
                if (e) pageVersion = (e.textContent || '').trim()
            }
            
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