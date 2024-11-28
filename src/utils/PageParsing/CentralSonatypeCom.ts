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
import { FORMATS } from '../Constants'
import { generatePackageURLComplete } from './PurlUtils'
import { BasePageParser } from './BasePageParser'

const PACKAGING_FORMATS_NOT_JAR = new Set<string>(['aar', 'ear', 'war'])
const POM_PACKAGING_REGEX = /<packaging>(?<packaging>(.*))<\/packaging>/

export class CentralSonatypeComPageParser extends BasePageParser {    
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
        if (pathResults?.groups) {
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
