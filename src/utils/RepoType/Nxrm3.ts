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

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

import { FORMATS } from '../Constants'
import { BaseRepo } from './BaseRepo'

export class Nxrm3Repo extends BaseRepo {

    constructor(readonly nxrmBaseUrl: string) {
        super()
    }

    id(): string {
        return `nxrm3-${this.nxrmBaseUrl}`
    }
    format(): string {
        return FORMATS.NXRM
    }
    baseUrl(): string {
        return this.nxrmBaseUrl
    }
    titleSelector(): string {
        return ''
    }
    versionPath(): string {
        return ''
    }
    pathRegex(): RegExp {
        return /^$/
    }
    versionDomPath(): string {
        return ''
    }
    supportsVersionNavigation(): boolean {
        return false
    }
    supportsMultiplePurlsPerPage(): boolean {
        return false
    }
}
