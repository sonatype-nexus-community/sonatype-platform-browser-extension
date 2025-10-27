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
import { ExtensionConfiguration } from '../../../common/configuration/types'
import {
    STORAGE_KEY_SETTINGS,
    STORAGE_KEY_TABS,
    STORAGE_KEY_VULNERABILITIES,
    ThisBrowser,
} from '../../../common/constants'
import { ExtensionDataState } from '../../../common/data/extension-data'
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
import { Mutex, deepCopy } from '../../../common/utils'
import { IqMessageHelper } from '../helpers/iq'

export abstract class BaseRuntimeOnMessageHandler {
    private static readonly storageMutex = new Mutex();

    constructor(
        protected readonly extensionConfigurationState: ExtensionConfigurationState,
        protected readonly iqMessageHelper: IqMessageHelper,
        protected readonly analytics: Analytics,
        protected readonly extensionDataState?: ExtensionDataState
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

        const unlock = await BaseRuntimeOnMessageHandler.storageMutex.acquire();
        try {
            // Create a deep copy to avoid mutations during storage
            const configToStore = deepCopy(newExtensionConfiguration);

            await ThisBrowser.storage.local.set({ [STORAGE_KEY_SETTINGS]: configToStore })

            // Only update in-memory state after successful storage
            this.extensionConfigurationState.setExtensionConfig(configToStore);

            return {
                status: MessageResponseStatus.SUCCESS,
                newConfiguration: configToStore,
            }
        } catch (err) {
            logger.logServiceWorker(
                'Failed to update extension configuration',
                LogLevel.ERROR,
                err
            )
            return {
                status: MessageResponseStatus.FAILURE,
                status_detail: err.message,
                status_error: err,
                newConfiguration: newExtensionConfiguration,
            }
        } finally {
            unlock();
        }
    }

    protected updateExtensionTabData = async (newExtensionData: ExtensionTabsData): Promise<MessageResponse> => {
        const unlock = await BaseRuntimeOnMessageHandler.storageMutex.acquire();
        try {
            // Create a deep copy to avoid mutations during storage
            const dataToStore = deepCopy(newExtensionData);

            await ThisBrowser.storage.local.set({ [STORAGE_KEY_TABS]: dataToStore })

            // Only update in-memory state after successful storage
            if (this.extensionDataState) {
                this.extensionDataState.tabsData = dataToStore;
            }

            logger.logServiceWorker('updateExtensionTabData Completed', LogLevel.WARN, {
                newExtensionData: dataToStore,
            })
            return {
                status: MessageResponseStatus.SUCCESS,
            }
        } catch (err) {
            logger.logServiceWorker(
                'Failed to update extension tab data',
                LogLevel.ERROR,
                err
            )
            return {
                status: MessageResponseStatus.FAILURE,
                status_detail: err.message,
                status_error: err,
            }
        } finally {
            unlock();
        }
    }

    protected updateExtensionVulnerabilityData = async (
        newVulnerabilityData: ExtensionVulnerabilitiesData
    ): Promise<MessageResponse> => {
        const unlock = await BaseRuntimeOnMessageHandler.storageMutex.acquire();
        try {
            // Create a deep copy to avoid mutations during storage
            const dataToStore = deepCopy(newVulnerabilityData);

            await ThisBrowser.storage.local.set({ [STORAGE_KEY_VULNERABILITIES]: dataToStore })

            // Only update in-memory state after successful storage
            if (this.extensionDataState) {
                this.extensionDataState.vulnerabilityData = dataToStore;
            }

            return {
                status: MessageResponseStatus.SUCCESS,
            }
        } catch (err) {
            logger.logServiceWorker(
                'Failed to update extension vulnerability data',
                LogLevel.ERROR,
                err
            )
            return {
                status: MessageResponseStatus.FAILURE,
                status_detail: err.message,
                status_error: err,
            }
        } finally {
            unlock();
        }
    }
}
