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
import { Analytics } from '../../../common/analytics/analytics'
import { ExtensionConfigurationState } from '../../../common/configuration/extension-configuration'
import { ExtensionDataState } from '../../../common/data/extension-data'
import { ComponentDataAllVersions, TabDataStatus } from '../../../common/data/types'
import { logger, LogLevel } from '../../../common/logger'
import { MessageResponseStatus } from '../../../common/message/constants'
import { MessageRequestLoadComponentVersions, MessageResponseFunction } from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { deepCopy } from '../../../common/utils'
import { IqMessageHelper } from '../helpers/iq'
import { BaseRuntimeOnMessageHandler } from './base'
import { ApiComponentDetailsDTOV2 } from '@sonatype/nexus-iq-api-client'

export class LoadComponentVersionsMessageHandler extends BaseRuntimeOnMessageHandler {
    constructor(
        protected readonly extensionConfigurationState: ExtensionConfigurationState,
        protected readonly iqMessageHelper: IqMessageHelper,
        protected readonly analytics: Analytics,
        protected readonly extensionDataState: ExtensionDataState
    ) {
        super(extensionConfigurationState, iqMessageHelper, analytics, extensionDataState)
    }

    async handleMessage(
        message: MessageRequestLoadComponentVersions,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): Promise<void> {
        try {
            logger.logServiceWorker(
                'Request to load Component Versions',
                LogLevel.DEBUG,
                message.componentIdentifier,
                message.tabId
            )
            const allComponentVersions = await this.iqMessageHelper.getComponentVersions(message.componentIdentifier)

            // CRITICAL: Use null instead of undefined - Chrome messaging strips undefined values!
            const componentVersions: ComponentDataAllVersions = Object.fromEntries(
                allComponentVersions.map((key) => [key, {} as ApiComponentDetailsDTOV2])
            )
            logger.logServiceWorker(
                '   Component Versions --> ',
                LogLevel.DEBUG,
                allComponentVersions,
                componentVersions
            )

            // Create a deep copy of the current tabs data to avoid mutating the original
            const newExtensionTabsData = deepCopy(this.extensionDataState.tabsData)

            // Ensure the tab exists with proper structure
            if (!newExtensionTabsData.tabs[message.tabId]) {
                newExtensionTabsData.tabs[message.tabId] = {
                    tabId: message.tabId,
                    repoTypeId: '',
                    status: TabDataStatus.EVALUATING,
                    components: {},
                }
            }

            const packageUrl = message.componentIdentifier.packageUrl as string

            // Ensure the component exists with proper structure
            if (!newExtensionTabsData.tabs[message.tabId].components[packageUrl]) {
                newExtensionTabsData.tabs[message.tabId].components[packageUrl] = {
                    allComponentVersions: undefined,
                    componentDetails: undefined,
                    componentEvaluationDateTime: '',
                    componentLegalDegtails: [],
                    componentRemediationDetails: undefined,
                }
            }

            // Apply the change to the copied data
            newExtensionTabsData.tabs[message.tabId].components[packageUrl].allComponentVersions = componentVersions
            const updateResult = await this.updateExtensionTabData(newExtensionTabsData)

            // Return versions directly in response for immediate UI update
            if (updateResult.status === MessageResponseStatus.SUCCESS) {
                const response = {
                    status: MessageResponseStatus.SUCCESS,
                    versions: componentVersions,
                }
                sendResponse(response)
            } else {
                sendResponse(updateResult)
            }
        } catch (error) {
            sendResponse({
                status: MessageResponseStatus.FAILURE,
                status_detail: error.message,
                status_error: error,
            })
        }
    }
}
