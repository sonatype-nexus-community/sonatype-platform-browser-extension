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
import { ComponentDataAllVersions } from '../../../common/data/types'
import { logger, LogLevel } from '../../../common/logger'
import { MessageResponseStatus } from '../../../common/message/constants'
import { MessageRequestLoadComponentVersions, MessageResponseFunction } from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { IqMessageHelper } from '../helpers/iq'
import { BaseRuntimeOnMessageHandler } from './base'

export class LoadComponentVersionsMessageHandler extends BaseRuntimeOnMessageHandler {
    constructor(
        protected readonly extensionConfigurationState: ExtensionConfigurationState,
        protected readonly iqMessageHelper: IqMessageHelper,
        protected readonly analytics: Analytics,
        protected readonly extensionDataState: ExtensionDataState
    ) {
        super(extensionConfigurationState, iqMessageHelper, analytics)
    }

    async handleMessage(
        message: MessageRequestLoadComponentVersions,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): Promise<void> {
        logger.logServiceWorker(
            'Request to load Component Versions',
            LogLevel.DEBUG,
            message.componentIdentifier,
            message.tabId
        )
        const allComponentVersions = await this.iqMessageHelper.getComponentVersions(message.componentIdentifier)

        const newExtensionTabsData = this.extensionDataState.tabsData
        const componentVersions: ComponentDataAllVersions = Object.fromEntries(
            allComponentVersions.map((key) => [key, undefined])
        )
        logger.logServiceWorker('   Component Versions --> ', LogLevel.DEBUG, allComponentVersions, componentVersions)
        newExtensionTabsData.tabs[message.tabId].components[message.componentIdentifier.packageUrl as string].allComponentVersions = componentVersions

        await this.updateExtensionTabData(newExtensionTabsData)
        // if (storageUpdateResponse.status === MessageResponseStatus.SUCCESS) {
            sendResponse({
                status: MessageResponseStatus.SUCCESS,
                // versions: componentVersions,
            })
        // } else {
        //     sendResponse(storageUpdateResponse)
        // }
    }
}
