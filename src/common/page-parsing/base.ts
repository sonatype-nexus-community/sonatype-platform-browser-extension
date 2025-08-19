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
import $, { Cash } from "cash-dom"
import { PackageURL } from "packageurl-js"
import { logger, LogLevel } from "../logger"
import { getPurlHash } from "../purl-utils"
import { BaseRepo } from "../repo-type/base"

export abstract class BasePageParser {

    constructor(readonly repoType: BaseRepo, readonly enableDomAnnotation: boolean = true) {
        if (repoType === undefined) {
            throw new Error("RepoType cannot be undefined")
        }

        if (this.enableDomAnnotation) this.annotateDomPageTitle()
    }

    annotateDomPageTitle = () => {
        $(this.repoType.titleSelector).addClass('sonatype-extension sonatype-page-title sonatype-pending')
    }

    annotateDomForPurl(purl: PackageURL, e?: Cash) {
        if (this.enableDomAnnotation) {
            const domClass = `purl-${getPurlHash(purl)}`
            if (e === undefined) {
                return
            }
            logger.logGeneral(`Adding class '${domClass}' to `, LogLevel.DEBUG, e)
            e?.addClass('sonatype-extension sonatype-component sonatype-pending')
            e?.addClass(domClass)
        }
    }

    getDomNodeForPurl(url: string, purl: PackageURL): Cash {
        return $(`purl-${getPurlHash(purl)}`)
    }

    abstract parsePage(url: string): PackageURL[]

    parsePath(url: string): RegExpExecArray | null {
        const results = this.repoType?.pathRegex.exec(url.replace(this.repoType?.baseUrl, ''))
        logger.logGeneral(`${this.repoType?.id} Path Results: ${results}`, LogLevel.DEBUG)
        if (results) {
            return results
        } else {
            return null
        }
    }
}