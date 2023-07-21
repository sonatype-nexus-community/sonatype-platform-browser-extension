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
import { FORMATS, RepoType } from '..//Constants'
import { LogLevel, logger } from '../../logger/Logger'
import { generatePackageURLComplete } from './PurlUtils'

const DOM_SELECTOR_BROWSE_REPO_FORMAT = 'div.nx-info > table > tbody > tr:nth-child(2) > td.nx-info-entry-value'

const DOM_BROWSE_GROUP = 'div.nx-info > table > tbody > tr:nth-child(3) > td.nx-info-entry-value'
const DOM_BROWSE_COMPONENT = 'div.nx-info > table > tbody > tr:nth-child(4) > td.nx-info-entry-value'
const DOM_BROWSE_VERSION = 'div.nx-info > table > tbody > tr:nth-child(5) > td.nx-info-entry-value'

export const getArtifactDetailsFromNxrmDom = (repoType: RepoType, url: string): PackageURL | undefined => {
    logger.logMessage('In getArtifactDetailsFromNxrmDom', LogLevel.DEBUG, repoType, url)

    const uriPath = url.replace(repoType.url, '')
    logger.logMessage('Normalised URI Path: ', LogLevel.DEBUG, uriPath)

    if (uriPath.startsWith('#browse/browse')) {
        // Browse Mode
        const formatDomNode = $(DOM_SELECTOR_BROWSE_REPO_FORMAT)
        if (formatDomNode === undefined) {
            return undefined
        }

        const format = formatDomNode.first().text().trim()
        logger.logMessage(`Detected format ${format}`, LogLevel.DEBUG, formatDomNode)

        const group = $(DOM_BROWSE_GROUP).first().text().trim()
        const component = $(DOM_BROWSE_COMPONENT).first().text().trim()
        const version = $(DOM_BROWSE_VERSION).first().text().trim()

        if (component.includes('/')) {
            // When browsing and selecting the tree node before the version, this contains
            // the content type - e.g. 'application/json'
            return undefined
        }

        switch (format) {
            case 'maven2':
                if (group == '' || component == '' || version == '') {
                    return undefined
                }
                return generatePackageURLComplete(
                    FORMATS.maven,
                    encodeURIComponent(component),
                    encodeURIComponent(version),
                    encodeURIComponent(group),
                    { type: 'jar' },
                    undefined
                )
                break
            case FORMATS.npm:
                if (component == '' || version == '') {
                    return undefined
                }
                return generatePackageURLComplete(
                    FORMATS.npm,
                    encodeURIComponent(component),
                    encodeURIComponent(version),
                    '@' + encodeURIComponent(group),
                    {},
                    undefined
                )
                break
        }
    } else if (uriPath.startsWith('#/browse/search')) {
        // Search Mode
    }

    return undefined
}
