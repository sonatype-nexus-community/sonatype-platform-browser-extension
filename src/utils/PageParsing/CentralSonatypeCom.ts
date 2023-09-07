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
import { FORMATS, REPOS, REPO_TYPES } from '../Constants'
import { generatePackageURLComplete } from './PurlUtils'

const PACKAGING_FORMATS_TO_JAR = new Set<string>(['bundle', 'pom'])
const POM_PACKAGING_REGEX = /<packaging>(?<packaging>(.*))<\/packaging>/

//pkg:type/namespace/name@version?qualifiers#subpath
const parseCentralSonatypeCom = (url: string): PackageURL | undefined => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.centralSonatypeCom)
    console.debug('*** REPO TYPE: ', repoType)
    if (repoType) {
        if (repoType.pathRegex) {
            const pathResult = repoType.pathRegex.exec(url.replace(repoType.url, ''))
            const pomResult = POM_PACKAGING_REGEX.exec($('pre[data-test="pom-file"]').text())
            let type = 'jar'
            if (pomResult?.groups !== undefined) {
                console.log('Found a POM to obtain pacakging from')
                if (PACKAGING_FORMATS_TO_JAR.has(pomResult.groups.packaging)) {
                    console.log(`    Coercing type to jar from ${pomResult.groups.packaging}`)
                } else {
                    console.log('    Using packaging from POM ')
                    type = pomResult.groups.packaging
                }
            }
            if (pathResult && pathResult.groups) {
                return generatePackageURLComplete(
                    FORMATS.maven,
                    encodeURIComponent(pathResult.groups.artifactId),
                    encodeURIComponent(pathResult.groups.version),
                    encodeURIComponent(pathResult.groups.groupId),
                    { type: type },
                    undefined
                )
            }
        }
    } else {
        console.error('Unable to determine REPO TYPE.')
    }

    return undefined
}

export { parseCentralSonatypeCom }
