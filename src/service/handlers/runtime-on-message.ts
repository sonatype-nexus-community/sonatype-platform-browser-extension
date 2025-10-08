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
import { Analytics } from '../../common/analytics/analytics'
import { ExtensionConfigurationStateServiceWorker } from '../../common/configuration/extension-configuration-sw'
import { ThisBrowser } from '../../common/constants'
import { ExtensionDataState } from '../../common/data/extension-data'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType } from '../../common/message/constants'
import { AnyMessageRequest, MessageResponseFunction } from '../../common/message/types'
import { MessageSender } from '../../common/types'
import { BaseServiceWorkerHandler } from './base'
import { IqMessageHelper } from './helpers/iq'
import { BaseRuntimeOnMessageHandler } from './runtime-on-message/base'
import { ConnectivityAndVersionCheckMessageHandler } from './runtime-on-message/connectivity-version-check'
import { LoadApplicationsMessageHandler } from './runtime-on-message/load-applications'
import { LoadComponentVersionsMessageHandler } from './runtime-on-message/load-component-versions'
import { LoadVulnerabilityMessageHandler } from './runtime-on-message/load-vulnerability'
import { PersistExtensionConfigurationMessageHandler } from './runtime-on-message/persist-extension-configuration'
import { RequestNewExternalRepositoryManagerMessageHandler } from './runtime-on-message/request-new-external-repository-manager'
import { RequestRemovalExternalRepositoryManagerMessageHandler } from './runtime-on-message/request-removal-external-repository-manager'

export class ServiceWorkerRuntimeOnMessageHandler extends BaseServiceWorkerHandler {
    private readonly iqMessageHelper: IqMessageHelper

    constructor(
        protected readonly analytics: Analytics,
        protected extensionConfigurationState: ExtensionConfigurationStateServiceWorker,
        protected extensionDataState: ExtensionDataState
    ) {
        super(analytics, extensionConfigurationState, extensionDataState)
        this.iqMessageHelper = new IqMessageHelper(this.extensionConfigurationState)
    }

    public setExtensionConfigurationState = (state: ExtensionConfigurationStateServiceWorker) => {
        this.extensionConfigurationState = state
    }

    public setExtensionDataState = (state: ExtensionDataState) => {
        this.extensionDataState = state
    }

    public handleOnMessage = (
        request: AnyMessageRequest,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): boolean => {
        logger.logServiceWorker(
            `ExtensionServiceOnMessage.handleMessage: `,
            LogLevel.DEBUG,
            request.messageType,
            request,
            sender
        )
        let messageHandler: BaseRuntimeOnMessageHandler | undefined = undefined

        switch (request.messageType) {
            case MessageRequestType.CONNECTIVITY_AND_VERSION_CHECK:
                messageHandler = new ConnectivityAndVersionCheckMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics
                )
                break
            case MessageRequestType.LOAD_APPLICATIONS:
                messageHandler = new LoadApplicationsMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics
                )
                break
            case MessageRequestType.LOAD_COMPONENT_VERSIONS:
                messageHandler = new LoadComponentVersionsMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics,
                    this.extensionDataState
                )
                break
            case MessageRequestType.LOAD_VULNERABILITY:
                messageHandler = new LoadVulnerabilityMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics,
                    this.extensionDataState.vulnerabilityData
                )
                break
            case MessageRequestType.REQUEST_NEW_EXTERNAL_REPOSITORY_MANAGER:
                messageHandler = new RequestNewExternalRepositoryManagerMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics
                )
                break
            case MessageRequestType.REQUEST_REMOVAL_EXTERNAL_REPOSITORY_MANAGER:
                messageHandler = new RequestRemovalExternalRepositoryManagerMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics
                )
                break
            case MessageRequestType.SET_NEW_EXTENSION_CONFIGURATION:
                messageHandler = new PersistExtensionConfigurationMessageHandler(
                    this.extensionConfigurationState,
                    this.iqMessageHelper,
                    this.analytics
                )
                break
        }

        if (messageHandler !== undefined) {
            messageHandler.handleMessage(request, sender, sendResponse).then(() => {
                logger.logServiceWorker(`Message Handled ${request.messageType}`, LogLevel.DEBUG, request)
            }).catch((err: Error) => {
                logger.logServiceWorker('Error whilst Service Worker handled Message', LogLevel.ERROR, err, request)
                ThisBrowser.notifications.create({
                    type: 'basic',
                    iconUrl: '/images/pink-icon-alert.png',
                    title: 'Error',
                    message: `Extension Error: ${err.message}`,
                    priority: 0,
                }).finally(() => {
                    throw err
                })
            })
        } else {
            logger.logServiceWorker(
                `No message handler for message type: ${request.messageType}`,
                LogLevel.DEBUG,
                request
            )
        }

        // Handlers are async - so return true
        return true
    }
}
