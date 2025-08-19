// /*
//  * Copyright (c) 2019-present Sonatype, Inc.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
// import { ApiComponentDetailsDTOV2ToJSON } from '@sonatype/nexus-iq-api-client'
// import { ExtensionConfigurationState } from '../../../common/configuration/extension-configuration'
// import { ExtensionDataState } from '../../../common/data/extension-data'
// import { TabDataStatus } from '../../../common/data/types'
// import { logger, LogLevel } from '../../../common/logger'
// import { MessageResponseStatus } from '../../../common/message/constants'
// import { MessageRequestPageComponentIdentitiesParsed, MessageResponseFunction } from '../../../common/message/types'
// import { MessageSender } from '../../../common/types'
// import { IqMessageHelper } from '../helpers/iq'
// import { NotificationHelper } from '../helpers/notification'
// import { BaseRuntimeOnMessageHandler } from './base'

// export class PageComponentIdentitiesParsedMessageHandler extends BaseRuntimeOnMessageHandler {
//     constructor(
//         protected readonly extensionConfigurationState: ExtensionConfigurationState,
//         protected readonly iqMessageHelper: IqMessageHelper,
//         protected readonly extensionDataState: ExtensionDataState
//     ) {
//         super(extensionConfigurationState, iqMessageHelper)
//     }

//     handleMessage(
//         message: MessageRequestPageComponentIdentitiesParsed,
//         sender: MessageSender,
//         sendResponse: MessageResponseFunction
//     ): Promise<void> {
//         logger.logServiceWorker('Component Identitied from Content Script', LogLevel.DEBUG, message)
//         const newExtensionTabsData = this.extensionDataState.tabsData
//         const tabId = sender.tab?.id as number

//         if (message.componentIdentities.length === 0) {
//             this.extensionDataState.tabsData.tabs[tabId] = {
//                 tabId,
//                 components: {},
//                 status: TabDataStatus.NO_COMPONENTS,
//             }
//             return this.updateExtensionTabData(newExtensionTabsData).then((msgResponse) => {
//                 sendResponse(msgResponse)
//             })
//         } else {
//             newExtensionTabsData.tabs[tabId] = {
//                 tabId,
//                 components: {},
//                 status: TabDataStatus.EVALUATING,
//             }

//             return this.updateExtensionTabData(newExtensionTabsData).then(() => {
//                 return this.iqMessageHelper
//                     .evaluateComponents(message.componentIdentities)
//                     .then((evaluationResults) => {
//                         evaluationResults.results?.forEach((result) => {
//                             if (result.component?.packageUrl != undefined)
//                                 newExtensionTabsData.tabs[tabId].components[result.component?.packageUrl as string] = {
//                                     componentDetails: ApiComponentDetailsDTOV2ToJSON(result),
//                                     componentEvaluationDateTime: evaluationResults.evaluationDate?.toISOString() || '',
//                                     allComponentVersions: [],
//                                     componentLegalDegtails: [],
//                                     componentRemediationDetails: undefined,
//                                 }
//                         })
//                         newExtensionTabsData.tabs[tabId]['status'] = TabDataStatus.COMPLETE
//                         this.extensionDataState.tabsData = newExtensionTabsData

//                         return this.updateExtensionTabData(newExtensionTabsData).then((msgResponse) => {
//                             const notificationHelper = new NotificationHelper(
//                                 this.extensionConfigurationState,
//                                 this.extensionDataState
//                             )
//                             return notificationHelper.notifyOnComponentEvaluationComplete(tabId).then(() => {
//                                 sendResponse({
//                                     status: MessageResponseStatus.SUCCESS,
//                                 })
//                             })
//                         })
//                     })
//             })
//         }
//     }
// }
