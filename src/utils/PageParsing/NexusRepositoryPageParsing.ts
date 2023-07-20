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
import { RepoType } from '..//Constants'
import { LogLevel, logger } from '../../logger/Logger'

const DOM_SELECTOR_BROWSE_FORMAT = '#nx-info-1204 tbody tr:nth-child(2) td:nth-child(2)'
const DOM_SELECTOR_BROWSE_SHA1 = 'DIV:contains(sha1)'

export const getArtifactDetailsFromNxrmDom = (repoType: RepoType, url: string): PackageURL | undefined => {
    logger.logMessage('In getArtifactDetailsFromNxrmDom', LogLevel.DEBUG, repoType, url)

    const uriPath = url.replace(repoType.url, '')
    logger.logMessage('Normalised URI Path: ', LogLevel.DEBUG, uriPath)

    if (uriPath.startsWith('#browse/browse')) {
        // Browse Mode
        // const checksumDomNode = $('DIV.x-grid-group-title').filter(function (i, e) {
        //     logger.logMessage(` Filtering Node`, LogLevel.DEBUG, i, e)
        //     return e.innerText === 'Checksum'
        // })
        const checksumDomNode = $("td[data-qtip|='sha1']")
        logger.logMessage(` SHA1`, LogLevel.DEBUG, checksumDomNode.html())
        // const parentNode = $(checksumDomNode).parent()
        // logger.logMessage(` Parent`, LogLevel.DEBUG, parentNode.html())
        logger.logMessage(` SHA1 VALUE`, LogLevel.DEBUG, checksumDomNode.next().html())

        const formatDomNode = $(DOM_SELECTOR_BROWSE_FORMAT)
        if (formatDomNode !== undefined) {
            const format = formatDomNode.get(0)?.innerHTML
            logger.logMessage(` Detected format ${format}`, LogLevel.DEBUG, formatDomNode)
        }
    } else if (uriPath.startsWith('#/browse/search')) {
        // Search Mode
    }

    return undefined
}
