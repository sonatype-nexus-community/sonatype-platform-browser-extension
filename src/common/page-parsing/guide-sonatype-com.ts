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
import { PackageURL } from 'packageurl-js'
import { generatePackageURLWithNamespace } from '../purl-utils'
import { BasePageParser } from './base'

const FORMAT_TO_PURL_TYPE: Record<string, string> = {
    npm: 'npm',
    maven: 'maven',
    pypi: 'pypi',
    nuget: 'nuget',
    gem: 'gem',
    cargo: 'cargo',
    cocoapods: 'cocoapods',
    composer: 'composer',
    conan: 'conan',
    cran: 'cran',
    golang: 'golang',
    huggingface: 'huggingface',
    apk: 'apk',
}

export class GuideSonatypeComPageParser extends BasePageParser {
    async parsePage(url: string): Promise<PackageURL[]> {
        const pathResults = this.parsePath(url)
        if (pathResults?.groups) {
            const format = pathResults.groups.format
            const purlType = FORMAT_TO_PURL_TYPE[format] ?? format

            const p = generatePackageURLWithNamespace(
                purlType,
                pathResults.groups.artifactId,
                pathResults.groups.version,
                pathResults.groups.groupId
            )
            this.annotateDomForPurl(p)
            return [p]
        }
        return []
    }
}
