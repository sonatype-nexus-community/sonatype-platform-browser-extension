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
// import { ThisBrowser } from '../../../common/constants'
// import { logger, LogLevel } from '../../../common/logger'
// import { MessageResponseStatus } from '../../../common/message/constants'
// import { MessageReqeustPageComponentsEvaluated, MessageResponseFunction } from '../../../common/message/types'
// import { PolicyThreatLevelUtil } from '../../../common/policy/policy-util'
// import { MessageSender } from '../../../common/types'
// import { BaseRuntimeOnMessageHandler } from './base'

// export class PageComponentsEvaluatedMessageHandler extends BaseRuntimeOnMessageHandler {
//     handleMessage(
//         message: MessageReqeustPageComponentsEvaluated,
//         sender: MessageSender,
//         sendResponse: MessageResponseFunction
//     ): Promise<void> {
//         logger.logServiceWorker('Components have been Evaluated', LogLevel.DEBUG, message)
//         const tabId = sender.tab?.id as number

//         return ThisBrowser.notifications
//             .create(`component-evaluation-notification|${tabId}`, {
//                 type: 'basic',
//                 iconUrl: PolicyThreatLevelUtil.getIconForThreatLevel(message.maxThreatLevel),
//                 title: 'Sonatype Evaluation',
//                 message: `Component triggers Policy at Threat Level ${message.maxThreatLevel}`,
//                 buttons: [{ title: 'View Details' }],
//                 priority: 1,
//             })
//             .then(() => {
//                 sendResponse({
//                     status: MessageResponseStatus.SUCCESS
//                 })
//             })
//     }
// }
