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
import { MessageRequestLoadApplications, MessageResponseFunction } from '../../../common/message/types'
import { MessageSender } from '../../../common/types'
import { BaseRuntimeOnMessageHandler } from './base'

export class LoadApplicationsMessageHandler extends BaseRuntimeOnMessageHandler {
    handleMessage(message: MessageRequestLoadApplications, sender: MessageSender, sendResponse: MessageResponseFunction): Promise<void> {
        return this.iqMessageHelper.getApplications().then((msgResp) => {
            const newExtensionConfig = this.extensionConfigurationState.getExtensionConfig()
            newExtensionConfig.iqApplications = msgResp.applications
            this.updateExtensionConfiguration(newExtensionConfig).then((msgResp) => {
                sendResponse(msgResp)
            })
        })
    }
}
