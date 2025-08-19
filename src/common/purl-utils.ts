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
import { RepoFormat } from './repo-type/types'
import { logger, LogLevel } from './logger'

const friendlyPackageUrlString = (purl: PackageURL): string => {
    switch (purl.type) {
        case 'huggingface':
            return `${getQualifiersString(purl)} (${purl.version?.substring(0, 20)})`
        case 'pypi':
            return `${purl.name}@${purl.version} (${getQualifiersString(purl)})`
    }

    return purl.toString()
}

const generatePackageURL = (
    format: RepoFormat,
    name: string,
    version: string,
    qualifiers?: { [key: string]: string }
): PackageURL => {
    return generatePackageURLComplete(format, name, version, undefined, qualifiers, undefined)
}

const generatePackageURLWithNamespace = (
    format: RepoFormat,
    name: string,
    version: string,
    namespace: string | undefined
): PackageURL => {
    return generatePackageURLComplete(format, name, version, namespace, undefined, undefined)
}

const generatePackageURLComplete = (
    format: RepoFormat,
    name: string,
    version: string,
    namespace: string | undefined,
    qualifiers:
        | {
              [key: string]: string
          }
        | undefined
        | null,
    subpath: string | undefined | null
): PackageURL => {
    return new PackageURL(format.toString(), namespace, name, version, qualifiers, subpath)
}

function getPurlHash(purl: PackageURL): number {
    const purlString = purl.toString()
    let hash = 0,
        i: number,
        chr: number

    if (purlString.length === 0) return hash
    for (i = 0; i < purlString.length; i++) {
        chr = purlString.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

function getQualifiersString(purl: PackageURL): string {
    const allQualifiers = Object.keys(purl.qualifiers ?? {})
    logger.logGeneral('All Qualifiers', LogLevel.DEBUG, allQualifiers, purl.qualifiers)
    let qS = ''

    if (purl.type === 'huggingface') {
        if (allQualifiers.includes('extension') && allQualifiers.includes('model')) {
            return `${purl.qualifiers ? purl.qualifiers['model'] : 'Unknown'}.${purl.qualifiers ? purl.qualifiers['extension'] : 'Unknown'}`
        }
    }

    if (purl.type === 'pypi') {
        if (allQualifiers.includes('extension')) {
            const extension = purl.qualifiers ? purl.qualifiers['extension'] : ''
            logger.logGeneral('--> Extension', LogLevel.DEBUG, extension)
            if (extension === 'whl') {
                qS = `Wheel: ${purl.qualifiers ? purl.qualifiers['qualifier'] : 'Unknown'}`
            } else {
                qS = `Source: ${extension}`
            }
        }
    }

    return qS
}

export { friendlyPackageUrlString, generatePackageURL, generatePackageURLComplete, generatePackageURLWithNamespace, getPurlHash, getQualifiersString }
