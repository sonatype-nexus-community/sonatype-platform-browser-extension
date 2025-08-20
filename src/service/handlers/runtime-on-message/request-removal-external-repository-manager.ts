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
import { ExternalRepositoryManager, ExternalRepositoryManagerStatus, ExternalRepositoryManagerType } from '../../../common/configuration/types'
import { logger, LogLevel } from '../../../common/logger'
import { MessageResponseStatus } from '../../../common/message/constants'
import { MessageRequestRequestRemovalExternalRepositoryManager, MessageResponseFunction } from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { BaseRuntimeOnMessageHandler } from './base'

export class RequestRemovalExternalRepositoryManagerMessageHandler extends BaseRuntimeOnMessageHandler {
    handleMessage(
        message: MessageRequestRequestRemovalExternalRepositoryManager,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): Promise<void> {
        logger.logServiceWorker('Handling request for removal of External Repository Manager...', LogLevel.DEBUG, message.url)
        
        if (!Object.keys(this.extensionConfigurationState.getExtensionConfig().externalRepositoryManagers).includes(message.url)) {
            sendResponse({
                status: MessageResponseStatus.FAILURE,
                status_detail: "External Repository Manager is not registered"
            })
            return Promise.resolve()
        }

        const newExtensionConfig = this.extensionConfigurationState.getExtensionConfig()
        delete newExtensionConfig.externalRepositoryManagers[message.url]
        return this.updateExtensionConfiguration(newExtensionConfig).then(() => {
            this.extensionConfigurationState.setExtensionConfig(newExtensionConfig)
        }).then(() => {
            sendResponse({
                status: MessageResponseStatus.SUCCESS
            })
        })
            // .then(() => {
        //     this.updateInSettings(message.url, {
        //         id: message.url,
        //         type: ExternalRepositoryManagerType.UNKNOWN,
        //         status: ExternalRepositoryManagerStatus.REQEUESTED,
        //         url: message.url,
        //         version: ''
        //     })
        // }).then(() => {
        //     return this.detectExternalRepositoryTypeAndVersion(message.url)
        // }).then((extRepoManager) => {
        //     this.updateInSettings(message.url, extRepoManager)
        // })
    }

    // detectExternalRepositoryTypeAndVersion = async (url: string): Promise<ExternalRepositoryManager> => {
    //     try {
    //         const nxrm3SwaggerResponse = await fetch(url + 'service/rest/swagger.json')
    //         const nxrm3Swagger = await nxrm3SwaggerResponse.json()
    //         return {
    //             id: url,
    //             type: ExternalRepositoryManagerType.NXRM3,
    //             status: ExternalRepositoryManagerStatus.READY,
    //             url: url,
    //             version: nxrm3Swagger['info']['version']
    //         }
    //     } catch (err) {
    //         logger.logServiceWorker("Failed to determine External Respoitory Type and Version", LogLevel.WARN, url, err)
    //         return await Promise.reject(err)
    //     }
    // }

    updateInSettings = async (url: string, extRepoManager: ExternalRepositoryManager): Promise<void> => {
        const newExtensionConfig = this.extensionConfigurationState.getExtensionConfig()
        newExtensionConfig.externalRepositoryManagers[url] = extRepoManager
        await this.updateExtensionConfiguration(newExtensionConfig)
        this.extensionConfigurationState.setExtensionConfig(newExtensionConfig)
    }
}
