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
import { MessageResponseStatus } from '../../../common/message/constants'
import {
    MessageRequestRequestRemovalExternalRepositoryManager,
    MessageResponseFunction,
} from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { BaseRuntimeOnMessageHandler } from './base'

export class RequestRemovalExternalRepositoryManagerMessageHandler extends BaseRuntimeOnMessageHandler {
    handleMessage(
        message: MessageRequestRequestRemovalExternalRepositoryManager,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): Promise<void> {
        logger.logServiceWorker(
            'Handling request for removal of External Repository Manager...',
            LogLevel.DEBUG,
            message.url
        )

        if (
            !Object.keys(this.extensionConfigurationState.getExtensionConfig().externalRepositoryManagers).includes(
                message.url
            )
        ) {
            sendResponse({
                status: MessageResponseStatus.FAILURE,
                status_detail: 'External Repository Manager is not registered',
            })
            return Promise.resolve()
        }

        const newExtensionConfig = this.extensionConfigurationState.getExtensionConfig()
        delete newExtensionConfig.externalRepositoryManagers[message.url]
        return this.updateExtensionConfiguration(newExtensionConfig)
            .then(() => {
                this.extensionConfigurationState.setExtensionConfig(newExtensionConfig)
            })
            .then(() => {
                sendResponse({
                    status: MessageResponseStatus.SUCCESS,
                })
            })
    }
}
