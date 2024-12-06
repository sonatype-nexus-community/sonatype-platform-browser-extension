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
import { logger, LogLevel } from '../logger/Logger'
import { ExtensionConfigurationState } from '../settings/extension-configuration'
import { ComponentState, ComponentStateUtil } from '../types/Component'
import { MESSAGE_REQUEST_TYPE, MessageRequestPropogateComponentState, MessageResponseFunction } from '../types/Message'
import { DefaultPageParserRegistry } from '../utils/PageParserRegistry'
import { DefaultRepoRegistry } from '../utils/RepoRegistry'
import { Cash } from 'cash-dom'
import { REPOS } from '../utils/Constants'

export class ContentScriptUpdateComponentState {

    constructor(private readonly extensionConfiguration: ExtensionConfigurationState) {
        this.extensionConfiguration = extensionConfiguration
    }

    public handleMessage(
        request: MessageRequestPropogateComponentState,
        sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
        sendResponse: MessageResponseFunction
    ): void {
        logger.logMessage(`ContentScriptUpdateComponentState.handleMessage`, LogLevel.DEBUG, request, sender, sendResponse)    

        if (request.type == MESSAGE_REQUEST_TYPE.PROPOGATE_COMPONENT_STATE) {
            logger.logMessage('Content Script - Handle Received Message', LogLevel.DEBUG, request.type, request.params)
            const repoType = DefaultRepoRegistry.getRepoForUrl(window.location.href)

            if (repoType !== undefined) {
                logger.logMessage('Propogate - Repo Type', LogLevel.DEBUG, repoType)
                // const domClass = `purl-${getPurlHash(PackageURL.fromString(request.params.purl))}`
                // $(function () { console.debug('DOM READY', $(`.${domClass}`)) })
                const domElement = DefaultPageParserRegistry.getParserByRepoId(repoType.id())
                    .getDomNodeForPurl(window.location.href, PackageURL.fromString(request.params.purl))
                logger.logMessage(`Finding DOM Element for PURL '${request.params.purl}' yields...`, LogLevel.DEBUG, domElement)

                if (request.params.componentState == ComponentState.CLEAR) {
                    this.removeClasses(domElement)
                    return
                }

                logger.logMessage('Adding CSS Classes', LogLevel.DEBUG, request.params.componentState)
                // let vulnClass = 'sonatype-iq-extension-vuln-unspecified'
                const vulnClass = ComponentStateUtil.toCssClass(request.params.componentState)

                logger.logMessage('Propogate - domElement', LogLevel.DEBUG, domElement)
                if (domElement.length > 0) {
                    this.removeClasses(domElement)
                    if (repoType.id() === REPOS.huggingfaceCo) {
                        logger.logMessage('Huggingface.co - Adding CSS Classes', LogLevel.DEBUG, vulnClass)
                        domElement.addClass('sonatype-iq-extension-huggingface')
                    }
                    domElement.addClass('sonatype-iq-extension-vuln')
                    domElement.addClass(vulnClass)
                }
                logger.logMessage("CSS CLASSES ARE NOW: ", LogLevel.DEBUG, domElement.attr('class'))
            }
        }
    }

    private removeClasses(e: Cash): void {
        logger.logMessage(`Removing Sonatype added classes`, LogLevel.DEBUG, e)
        e.removeClass('sonatype-iq-extension-vuln')
        Object.values(ComponentState).forEach((v) => { 
            e.removeClass(ComponentStateUtil.toCssClass(v))
        })
    }
}