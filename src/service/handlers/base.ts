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
import { STORAGE_KEY_TABS, ThisBrowser } from '../../common/constants'
import { ExtensionDataState } from '../../common/data/extension-data'
import { ExtensionTabsData } from '../../common/data/types'
import { ExtensionError, UserAuthenticationError } from '../../common/error'
import { MessageResponseStatus } from '../../common/message/constants'
import { MessageResponse } from '../../common/message/types'

export class BaseServiceWorkerHandler {
    constructor(
        protected readonly analytics: Analytics,
        protected readonly extensionConfigurationState: ExtensionConfigurationStateServiceWorker,
        protected readonly extensionDataState: ExtensionDataState
    ) {}

    protected handleError(err: ExtensionError): MessageResponse {
        if (err instanceof UserAuthenticationError) {
            return {
                status: MessageResponseStatus.AUTH_ERROR,
                status_detail: err.message,
                status_error: err,
            }
        }

        return {
            status: MessageResponseStatus.FAILURE,
            status_detail: err.message,
            status_error: err,
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
}
