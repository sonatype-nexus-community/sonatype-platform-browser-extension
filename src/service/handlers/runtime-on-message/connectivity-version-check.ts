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
import { ANALYTICS_EVENT_TYPES } from '../../../common/analytics/analytics'
import { ExtensionConfiguration } from '../../../common/configuration/types'
import { logger, LogLevel } from '../../../common/logger'
import { MessageRequestIqConnectivityAndVersionCheck, MessageResponseFunction } from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { BaseRuntimeOnMessageHandler } from './base'

export class ConnectivityAndVersionCheckMessageHandler extends BaseRuntimeOnMessageHandler {
    handleMessage(message: MessageRequestIqConnectivityAndVersionCheck, sender: MessageSender, sendResponse: MessageResponseFunction): Promise<void> {
        return this.iqMessageHelper
            .checkConnectivityAndDetermineIqVersion()
            .then((msgResp) => {
                logger.logServiceWorker('Response to CONNECTIVITY_AND_VERSION_CHECK', LogLevel.DEBUG, msgResp)
                const newExtensionConfig = this.extensionConfigurationState.getExtensionConfig()
                newExtensionConfig.iqAuthenticated = msgResp.iqAuthenticated
                newExtensionConfig.iqLastAuthenticated = msgResp.iqLastAuthenticated.getTime()
                newExtensionConfig.iqVersion = msgResp.iqVersion
                newExtensionConfig.supportsFirewall = msgResp.supportsFirewall
                newExtensionConfig.supportsLifecycle = msgResp.supportsLifecycle
                newExtensionConfig.supportsLifecycleAlp = msgResp.supportsLifecycleAlp
                return newExtensionConfig
            })
            .then(async (newExtensionConfig: ExtensionConfiguration) => {
                const msgResp = await this.updateExtensionConfiguration(newExtensionConfig)
                await this.analytics.fireEvent(
                    ANALYTICS_EVENT_TYPES.IQ_CONNECTION_CHECK,
                    {
                        iq_version: msgResp.newConfiguration.iqVersion,
                    }
                )
                sendResponse(msgResp)
            })
    }
}
