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

import { PackageURL } from "packageurl-js"
import { logger, LogLevel } from "../../logger/Logger"
import { BaseRepo } from "../RepoType/BaseRepo"
import $, { Cash } from "cash-dom"
import { getPurlHash } from "../Helpers"

export abstract class BasePageParser {

    constructor(readonly repoType: BaseRepo) {
        if (repoType === undefined) {
            throw new Error("RepoType cannot be undefined")
        }
    }

    annotateDomForPurl(purl: PackageURL, e?: Cash) {
        const domClass = `purl-${getPurlHash(purl)}`
        if (e === undefined) {
            e = $(this.repoType.titleSelector())
        }
        logger.logMessage(`Adding class '${domClass}' to `, LogLevel.DEBUG, e)
        e?.addClass(domClass)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDomNodeForPurl(url: string, purl: PackageURL): Cash {
        const e = $(this.repoType.titleSelector())
        return e
    }

    abstract parsePage(url: string): PackageURL[]

    parsePath(url: string): RegExpExecArray | null {
        const results = this.repoType?.pathRegex().exec(url.replace(this.repoType?.baseUrl(), ''))
        logger.logMessage(`${this.repoType?.id()} Path Results: ${results}`, LogLevel.DEBUG)
        if (results) {
            return results
        } else {
            return null
        }
    }
}