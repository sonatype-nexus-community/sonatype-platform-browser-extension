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
import { LogLevel, logger } from '../logger'
import { generatePackageURLComplete } from '../purl-utils'
import { BasePageParser } from './base'
import { PURL_TYPE_COCOAPODS, PURL_TYPE_CRAN, PURL_TYPE_GEM, PURL_TYPE_MAVEN, PURL_TYPE_NPM, PURL_TYPE_PYPI } from '../purl-types'

const DOM_SELECTOR_BROWSE_REPO_FORMAT = 'div.nx-info > table > tbody > tr:nth-child(2) > td.nx-info-entry-value'

export class Nxrm3PageParser extends BasePageParser {

    annotateDomPageTitle = () => {
        if (this.enableDomAnnotation) {
            logger.logContent(`Adding classes to ${this.repoType.titleSelector}`, LogLevel.DEBUG)
            $(this.repoType.titleSelector).first().addClass('sonatype-extension sonatype-nxrm3 sonatype-page-title sonatype-pending')
        }
    }

    parsePage(url: string): PackageURL[] {
        const uriPath = url.replace(this.repoType.baseUrl, '')
        logger.logContent('Normalised URI Path: ', LogLevel.DEBUG, uriPath)

        if (uriPath.startsWith('#browse/browse')) {
            // Browse Mode
            const formatDomNode = $(DOM_SELECTOR_BROWSE_REPO_FORMAT)
            if (formatDomNode === undefined) {
                return []
            }

            const format = formatDomNode.first().text().trim()
            logger.logContent(`Detected format ${format}`, LogLevel.DEBUG, formatDomNode)

            switch (format) {
                case 'cocoapods':
                    return this.attemptPackageUrlCocoaPodsUrl(uriPath)
                case 'r':
                    return this.attemptPackageUrlRUrl(uriPath)
                case 'maven2':
                    return this.attemptPackageUrlMavenUrl(uriPath)
                case 'npm':
                    return this.attemptPackageUrlNpmUrl(uriPath)
                case 'pypi':
                    return this.attemptPackageUrlPyPiUrl(uriPath)
                case 'rubygems':
                    return this.attemptPackageUrlRubyUrl(uriPath)
                default:
                    logger.logContent('Unknown or unsupported format on NXRM3', LogLevel.DEBUG, format)
            }
        }
        // else if (uriPath.startsWith('#/browse/search')) {
        //     // Search Mode
        // }

        return []
    }

    private attemptPackageUrlCocoaPodsUrl(uriPath: string): PackageURL[] {
        // #browse/browse:cocoapods-proxy:Specs%2Fc%2Fb%2F0%2FIgor%2F0.5.0%2FIgor.podspec.json
        // ==> Specs/c/b/0/Igor/0.5.0/Igor.podspec.json
        const urlParts = uriPath.split(':')
        const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

        if (componentParts.length >= 4) {
            const filename = componentParts.pop() as string
            if (!filename.endsWith('.podspec.json')) {
                return []
            }

            const version = componentParts.pop() as string
            const componentName = componentParts.pop() as string

            return [generatePackageURLComplete(
                PURL_TYPE_COCOAPODS,
                encodeURIComponent(componentName),
                encodeURIComponent(version),
                undefined,
                undefined,
                undefined
            )]
        }

        return []
    }

    private attemptPackageUrlMavenUrl(uriPath: string): PackageURL[] {
        // #browse/browse:maven-proxy:org%2Fapache%2Flogging%2Flog4j%2Flog4j%2F2.17.2
        // #browse/browse:maven-central:org%2Fapache%2Flogging%2Flog4j%2Flog4j-core%2F2.12.0%2Flog4j-core-2.12.0.jar
        const urlParts = uriPath.split(':')
        const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

        if (componentParts.length >= 4) {
            const lastComponentPart = componentParts.pop() as string
            const version = componentParts.pop() as string
            const componentName = componentParts.pop() as string
            const componentGroup = componentParts.join('.')

            if (!lastComponentPart.includes(componentName)) {
                return []
            }

            const fileExtension = lastComponentPart.split('.').pop() as string

            return [generatePackageURLComplete(
                PURL_TYPE_MAVEN,
                encodeURIComponent(componentName),
                encodeURIComponent(version),
                encodeURIComponent(componentGroup),
                { type: fileExtension },
                undefined
            )]
        }
        return []
    }

    private attemptPackageUrlNpmUrl(uriPath: string): PackageURL[] {
        // #browse/browse:npm-proxy:%40sonatype%2Fpolicy-demo%2Fpolicy-demo-2.0.0.tgz
        const urlParts = uriPath.split(':')
        const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

        if (componentParts.length >= 2) {
            const filename = componentParts.pop() as string
            if (!filename.endsWith('.tgz')) {
                return []
            }
            const componentName = componentParts.pop() as string
            const componentNamespace = componentParts.pop() as string

            const filenameParts = (filename.split('-').pop() as string).split('.')
            filenameParts.pop()
            const version = filenameParts.join('.')

            return [generatePackageURLComplete(
                PURL_TYPE_NPM,
                encodeURIComponent(componentName),
                encodeURIComponent(version),
                componentNamespace ?? componentNamespace,
                undefined,
                undefined
            )]
        }
        return []
    }

    private attemptPackageUrlPyPiUrl(uriPath: string): PackageURL[] {
        // #browse/browse:pupy-proxy:zipp%2F3.15.0%2Fzipp-3.15.0.tar.gz
        // #browse/browse:pupy-proxy:babel%2F2.12.1%2FBabel-2.12.1-py3-none-any.whl
        const urlParts = uriPath.split(':')
        const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

        if (componentParts.length >= 3) {
            const filename = componentParts.pop() as string
            const version = componentParts.pop() as string
            const componentName = componentParts.pop() as string

            const qualifiers = {
                extension: filename.split('.').pop() as string
            }

            return [generatePackageURLComplete(
                PURL_TYPE_PYPI,
                encodeURIComponent(componentName),
                encodeURIComponent(version),
                undefined,
                qualifiers,
                undefined
            )]
        }
        return []
    }

    private attemptPackageUrlRUrl(uriPath: string): PackageURL[] {
        // #browse/browse:r-proxy:bin%2Fmacosx%2Fbig-sur-arm64%2Fcontrib%2F4.3%2Fxgboost%2F1.7.5.1%2Fxgboost_1.7.5.1.tgz
        const urlParts = uriPath.split(':')
        const componentParts = decodeURIComponent(urlParts.pop() as string).split('/')

        if (componentParts.length >= 3) {
            const filename = componentParts.pop() as string
            if (!filename.endsWith('.tgz')) {
                return []
            }
            const version = componentParts.pop() as string
            const componentName = componentParts.pop() as string

            return [generatePackageURLComplete(
                PURL_TYPE_CRAN,
                encodeURIComponent(componentName),
                encodeURIComponent(version),
                undefined,
                undefined,
                undefined
            )]
        }

        return []
    }

    private attemptPackageUrlRubyUrl(uriPath: string): PackageURL[] {
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

            return [generatePackageURLComplete(
                PURL_TYPE_GEM,
                encodeURIComponent(componentName),
                encodeURIComponent(version),
                undefined,
                platform !== undefined ? { platform: platform } : undefined,
                undefined
            )]
        }

        return []
    }
}
