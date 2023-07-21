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

        switch (format) {
            case 'maven2':
                return attemptPackageUrlMavenUrl(uriPath)
            case FORMATS.npm:
                return attemptPackageUrlNpmUrl(uriPath)
            case FORMATS.pypi:
                return attemptPackageUrlPyPiUrl(uriPath)
            case 'rubygems':
                return attemptPackageUrlRubyUrl(uriPath)
        }
    } else if (uriPath.startsWith('#/browse/search')) {
        // Search Mode
    }

    return undefined
}

function attemptPackageUrlMavenUrl(uriPath: string): PackageURL | undefined {
    // #browse/browse:maven-central:org%2Fapache%2Flogging%2Flog4j%2Flog4j-core%2F2.12.0%2Flog4j-core-2.12.0.jar
    const urlParts = uriPath.split(':')
    const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

    if (componentParts.length >= 4) {
        const fileExtension = (componentParts.pop() as string).split('.').pop() as string
        const version = componentParts.pop() as string
        const componentName = componentParts.pop() as string
        const componentGroup = componentParts.join('.')

        return generatePackageURLComplete(
            FORMATS.maven,
            encodeURIComponent(componentName),
            encodeURIComponent(version),
            encodeURIComponent(componentGroup),
            { type: fileExtension },
            undefined
        )
    }
    return undefined
}

function attemptPackageUrlNpmUrl(uriPath: string): PackageURL | undefined {
    // #browse/browse:npm-proxy:%40sonatype%2Fpolicy-demo%2Fpolicy-demo-2.0.0.tgz
    const urlParts = uriPath.split(':')
    const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

    if (componentParts.length >= 2) {
        const filename = componentParts.pop() as string
        const componentName = componentParts.pop() as string
        const componentNamespace = componentParts.pop() as string

        const filenameParts = (filename.split('-').pop() as string).split('.')
        filenameParts.pop()
        const version = filenameParts.join('.')

        return generatePackageURLComplete(
            FORMATS.npm,
            encodeURIComponent(componentName),
            encodeURIComponent(version),
            encodeURIComponent(componentNamespace),
            undefined,
            undefined
        )
    }
    return undefined
}

function attemptPackageUrlPyPiUrl(uriPath: string): PackageURL | undefined {
    // #browse/browse:pupy-proxy:babel%2F2.12.1%2FBabel-2.12.1-py3-none-any.whl
    const urlParts = uriPath.split(':')
    const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

    if (componentParts.length >= 3) {
        componentParts.pop() as string // drop filename
        const version = componentParts.pop() as string
        const componentName = componentParts.pop() as string

        return generatePackageURLComplete(
            FORMATS.pypi,
            encodeURIComponent(componentName),
            encodeURIComponent(version),
            undefined,
            { extension: 'tar.gz' },
            undefined
        )
    }
    return undefined
}

function attemptPackageUrlRubyUrl(uriPath: string): PackageURL | undefined {
    // #browse/browse:ruby-proxy:logstash-input-tcp%2F6.0.9%2Flogstash-input-tcp-6.0.9-java.gemspec.rz
    const urlParts = uriPath.split(':')
    const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

    if (componentParts.length >= 3) {
        const filename = componentParts.pop() as string
        const version = componentParts.pop() as string
        const componentName = componentParts.pop() as string

        let platform: string | undefined = undefined
        const detectPlatformInFilename = filename.replace(`${componentName}-`, '').replace(`${version}`, '')
        if (detectPlatformInFilename != '.gemspec.rz') {
            platform = (detectPlatformInFilename.split('.').shift() as string).substring(1)
        }

        return generatePackageURLComplete(
            FORMATS.gem,
            encodeURIComponent(componentName),
            encodeURIComponent(version),
            undefined,
            platform !== undefined ? { platform: platform } : undefined,
            undefined
        )
    }

    return undefined
}
