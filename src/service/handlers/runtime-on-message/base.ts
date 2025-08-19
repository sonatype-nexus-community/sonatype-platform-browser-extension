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
import { ExtensionConfigurationState } from '../../../common/configuration/extension-configuration'
import { ExtensionConfiguration } from '../../../common/configuration/types'
import {
    ThisBrowser,
    STORAGE_KEY_SETTINGS,
    STORAGE_KEY_VULNERABILITIES,
    STORAGE_KEY_TABS,
} from '../../../common/constants'
import { ExtensionTabsData, ExtensionVulnerabilitiesData } from '../../../common/data/types'
import { logger, LogLevel } from '../../../common/logger'
import { MessageResponseStatus } from '../../../common/message/constants'
import {
    AnyMessageRequest,
    MessageResponse,
    MessageResponseExtensionConfigurationUpdated,
    MessageResponseFunction,
} from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { IqMessageHelper } from '../helpers/iq'

export abstract class BaseRuntimeOnMessageHandler {
    constructor(
        protected readonly extensionConfigurationState: ExtensionConfigurationState,
        protected readonly iqMessageHelper: IqMessageHelper
    ) {}

    abstract handleMessage(
        message: AnyMessageRequest,
        sender: MessageSender,
        sendResponse: MessageResponseFunction
    ): Promise<void>

    protected updateExtensionConfiguration = async (
        newExtensionConfiguration: ExtensionConfiguration
    ): Promise<MessageResponseExtensionConfigurationUpdated> => {
        logger.logServiceWorker(
            'Request to persist new Extension Configuration',
            LogLevel.DEBUG,
            newExtensionConfiguration
        )
        try {
            await ThisBrowser.storage.local.set({ [STORAGE_KEY_SETTINGS]: newExtensionConfiguration })
            return {
                status: MessageResponseStatus.SUCCESS,
                newConfiguration: newExtensionConfiguration,
            }
        } catch (err) {
            return {
                status: MessageResponseStatus.FAILURE,
                status_detail: err.message,
                status_error: err,
                newConfiguration: newExtensionConfiguration,
            }
        }
    }

    protected updateExtensionTabData = async (newExtensionData: ExtensionTabsData): Promise<MessageResponse> => {
        try {
            await ThisBrowser.storage.local.set({ [STORAGE_KEY_TABS]: newExtensionData })
            return {
                status: MessageResponseStatus.SUCCESS,
            }
        } catch (err) {
            return {
                status: MessageResponseStatus.FAILURE,
                status_detail: err.message,
                status_error: err,
            }
        }
    }

    protected updateExtensionVulnerabilityData = async (
        newVulnerabilityData: ExtensionVulnerabilitiesData
    ): Promise<MessageResponse> => {
        try {
            await ThisBrowser.storage.local.set({ [STORAGE_KEY_VULNERABILITIES]: newVulnerabilityData })
            return {
                status: MessageResponseStatus.SUCCESS,
            }
        } catch (err) {
            return {
                status: MessageResponseStatus.FAILURE,
                status_detail: err.message,
                status_error: err,
            }
        }
    }
}
