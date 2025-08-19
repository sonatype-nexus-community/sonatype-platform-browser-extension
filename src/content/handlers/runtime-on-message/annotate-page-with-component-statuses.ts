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
import { logger, LogLevel } from "../../../common/logger"
import { MessageResponseStatus } from "../../../common/message/constants"
import { MessageRequestAnnotatePageWithComponentStatuses, MessageResponseFunction } from "../../../common/message/types"
import { getPurlHash } from '../../../common/purl-utils'
import { MessageSender } from "../../../common/types"
import { BaseRuntimeOnMessageHandler } from "./base"
import { PolicyThreatLevelUtil } from '../../../common/policy/policy-util'
import { DefaultRepoRegistry } from '../../../common/repo-registry'

export class AnnotatePageWithComponentStatusesMessageHandler extends BaseRuntimeOnMessageHandler {
    
    handleMessage(message: MessageRequestAnnotatePageWithComponentStatuses, sender: MessageSender, sendResponse: MessageResponseFunction): Promise<void> {
        logger.logContent('Requested to Annotate current Page', LogLevel.DEBUG, message)
        const repoType = DefaultRepoRegistry.getRepoById(message.repoTypeId)

        // Annotate Page Title
        $(repoType.titleSelector).removeClass('sonatype-pending')
        $(repoType.titleSelector).addClass(PolicyThreatLevelUtil.getAnnotationCssClassForThreatLevel(message.maxThreatLevel))
        
        // Annotate each Purl / Component
        for (const purl in message.purlsWithThreatLevel) {
            const purlDomSelector = `.purl-${getPurlHash(PackageURL.fromString(purl))}`
            logger.logContent(`Annotating Purl ${purl}`, LogLevel.DEBUG, purlDomSelector)
            const domElementForPurl = $(purlDomSelector)
            domElementForPurl.removeClass('sonatype-pending')
            domElementForPurl.addClass(PolicyThreatLevelUtil.getAnnotationCssClassForThreatLevel(message.purlsWithThreatLevel[purl]))
        }

        sendResponse({
            status: MessageResponseStatus.SUCCESS
        })
        return Promise.resolve()
    } 
    
}