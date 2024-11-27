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
import { generatePackageURLComplete } from './PurlUtils'
import { BaseRepo } from '../Types'

const PACKAGING_FORMATS_NOT_JAR = new Set<string>(['aar', 'ear', 'war'])
const POM_PACKAGING_REGEX = /<packaging>(?<packaging>(.*))<\/packaging>/

export class CentralSonatypeComRepo extends BaseRepo {
    id(): string {
        return REPOS.centralSonatypeCom
    }
    format(): string {
        return FORMATS.maven
    }
    baseUrl(): string {
        return 'https://central.sonatype.com/artifact/'
    }
    titleSelector(): string {
        return 'h1'
    }
    versionPath(): string {
        return '{groupId}/{artifactId}/{version}'
    }
    pathRegex(): RegExp {
        return /^(?<groupId>[^/]*)\/(?<artifactId>[^/]*)\/(?<version>[^/#?]*)(\/[^#?]*)?(\?(?<query>([^#]*)))?(#(?<fragment>(.*)))?$/
    }
    versionDomPath(): string {
        return ''
    }
    supportsVersionNavigation(): boolean {
        return true
    }
    supportsMultiplePurlsPerPage(): boolean {
        return false
    }
    
    parsePage(url: string): PackageURL[] {
        const pomResult = POM_PACKAGING_REGEX.exec($('pre[data-test="pom-file"]').text())
        let type = 'jar'
        if (pomResult?.groups !== undefined) {
            if (PACKAGING_FORMATS_NOT_JAR.has(pomResult.groups.packaging)) {
                type = pomResult.groups.packaging
            }
        }

        const purlText = $('label[data-test="component-purl"]>span').last().text()
        if (purlText != undefined) {
            const purl = PackageURL.fromString(purlText)
            purl.qualifiers = { type: type }
            console.debug(`*** Got centralSonatypeCom purl from page purlText '${purlText} : ${purl.toString()}`)
            return [purl]
        }
        
        const pathResults = this.parsePath(url)
        if (pathResults && pathResults.groups) {
            return [generatePackageURLComplete(
                FORMATS.maven,
                encodeURIComponent(pathResults.groups.artifactId),
                encodeURIComponent(pathResults.groups.version),
                encodeURIComponent(pathResults.groups.groupId),
                { type: type },
                undefined
            )]
        }

        return []
    }
}
