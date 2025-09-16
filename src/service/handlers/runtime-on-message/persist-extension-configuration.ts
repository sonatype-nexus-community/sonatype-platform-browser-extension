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
import { logger, LogLevel } from '../../../common/logger'
import { MessageRequestSetNewExtensionConfiguration, MessageResponseFunction } from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { BaseRuntimeOnMessageHandler } from './base'

export class PersistExtensionConfigurationMessageHandler extends BaseRuntimeOnMessageHandler {
    handleMessage(
        message: MessageRequestSetNewExtensionConfiguration,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): Promise<void> {
        logger.logServiceWorker('Persisting new Extension Configuration', LogLevel.DEBUG, message.newExtensionConfig)
        return this.updateExtensionConfiguration(message.newExtensionConfig).then((msgResp) => {
            this.extensionConfigurationState.setExtensionConfig(message.newExtensionConfig)
            sendResponse(msgResp)
        })
    }
}
