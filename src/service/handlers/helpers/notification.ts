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
import { ThreatLevelNumber } from '@sonatype/react-shared-components'
import { ExtensionConfigurationState } from '../../../common/configuration/extension-configuration'
import { ThisBrowser } from '../../../common/constants'
import { ExtensionDataState } from '../../../common/data/extension-data'
import { logger, LogLevel } from '../../../common/logger'
import { MessageRequestType } from '../../../common/message/constants'
import { PolicyThreatLevelUtil } from '../../../common/policy/policy-util'

export class NotificationHelper {
    public constructor(
        private readonly extensionConfigState: ExtensionConfigurationState,
        private readonly extensionDataState: ExtensionDataState
    ) {}

    notifyOnComponentEvaluationComplete = (tabId: number): Promise<void> => {
        const maxThreatLevel = this.extensionDataState.getMaxThreatLevel(tabId) as ThreatLevelNumber
        const totalPolicyViolations = this.extensionDataState.getPolicyViolationCount(tabId)

        const notificationPromises = Array<Promise<unknown>>()
        notificationPromises.push(
            ThisBrowser.action.setIcon({
                tabId: tabId,
                path: PolicyThreatLevelUtil.getIconForThreatLevel(maxThreatLevel),
            })
        )
        notificationPromises.push(
            ThisBrowser.action.setBadgeBackgroundColor({
                tabId: tabId,
                color: PolicyThreatLevelUtil.getColorForThreatLevel(maxThreatLevel),
            })
        )
        notificationPromises.push(
            ThisBrowser.action.setBadgeText({
                tabId: tabId,
                text: `${totalPolicyViolations}`,
            })
        )
        notificationPromises.push(
            ThisBrowser.action.setTitle({
                tabId: tabId,
                title: `${totalPolicyViolations} Policy Violations - click to view details`,
            })
        )

        if (this.extensionConfigState.getExtensionConfig().enableNotifications) {
            notificationPromises.push(
                ThisBrowser.notifications.create(`component-evaluation-notification|${tabId}`, {
                    type: 'basic',
                    iconUrl: PolicyThreatLevelUtil.getIconForThreatLevel(maxThreatLevel),
                    title: 'Sonatype Evaluation',
                    message: `Component triggers Policy at Threat Level ${maxThreatLevel}`,
                    buttons: [{ title: 'View Details' }],
                    priority: 1,
                }).then(() => { })
            )
        }

        if (this.extensionConfigState.getExtensionConfig().enablePageAnnotations) {
            logger.logServiceWorker("Will Annotate Page Tab", LogLevel.DEBUG, tabId)
            const purlsWithThreatLevel = {}
            const tabIds = new Set<string>(Object.keys(this.extensionDataState.tabsData.tabs))

            if (tabIds.has(`${tabId}`)) {
                const tabPurls = Object.keys(this.extensionDataState.tabsData.tabs[tabId].components)
                tabPurls.forEach((purl) => {
                    purlsWithThreatLevel[purl] = this.extensionDataState.getMaxThreatLevelForComponent(tabId, purl)
                })
            } else {
                logger.logServiceWorker(`TabID ${tabId} not in known list`, LogLevel.DEBUG, tabIds)
            }

            notificationPromises.push(ThisBrowser.tabs.sendMessage(tabId, {
                messageType: MessageRequestType.ANNOTATE_PAGE_COMPONENT_IDENTITIES,
                maxThreatLevel,
                purlsWithThreatLevel: purlsWithThreatLevel,
                repoTypeId: this.extensionDataState.tabsData.tabs[tabId].repoTypeId
            }).then(() => { }))
            
        }

        return Promise.all(notificationPromises).then(() => { })
    }
}
