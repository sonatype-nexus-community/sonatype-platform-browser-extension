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
import { logger, LogLevel } from "../logger/Logger"

export abstract class BaseRepo {

    abstract id(): string
    abstract format(): string
    abstract baseUrl(): string
    abstract titleSelector(): string
    abstract versionPath(): string
    abstract pathRegex(): RegExp
    abstract versionDomPath(): string
    abstract supportsVersionNavigation(): boolean
    abstract supportsMultiplePurlsPerPage(): boolean
    abstract parsePage(url: string): PackageURL[]

    parsePath(url: string): RegExpExecArray | null {
        const results = this.pathRegex().exec(url.replace(this.baseUrl(), ''))
        logger.logMessage(`${this.id()} Path Results: ${results}`, LogLevel.DEBUG)
        return results
    }
}