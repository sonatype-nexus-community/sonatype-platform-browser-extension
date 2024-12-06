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

import { ExtensionError, UserAuthenticationError } from "../error/ExtensionError"
import { ExtensionConfigurationState } from "../settings/extension-configuration"
import { MESSAGE_RESPONSE_STATUS, MessageResponse } from "../types/Message"
import { Analytics } from "../utils/Analytics"

export class BaseServiceWorkerHandler {
    constructor(protected readonly analytics: Analytics, protected readonly extensionConfigurationState: ExtensionConfigurationState) { }

    protected handleError(err: ExtensionError): MessageResponse {
        if (err instanceof UserAuthenticationError) {
            return {
                status: MESSAGE_RESPONSE_STATUS.AUTH_ERROR,
                status_detail: err
            }
        }

        return {
            status: MESSAGE_RESPONSE_STATUS.FAILURE,
            status_detail: err
        }
    }
}