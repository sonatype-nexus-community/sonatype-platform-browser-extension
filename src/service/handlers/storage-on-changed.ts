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
import { STORAGE_KEY_TABS, STORAGE_KEY_VULNERABILITIES } from '../../common/constants'
import { ExtensionTabsData, ExtensionVulnerabilitiesData } from '../../common/data/types'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType } from '../../common/message/constants'
import { lastRuntimeError, sendRuntimeMessage } from '../../common/message/helpers'
import { BaseServiceWorkerHandler } from './base'

export class ServiceWorkerStorageOnChangedHandler extends BaseServiceWorkerHandler {
    public handleTabDataOnChanged = (changes: { [key: string]: browser.storage.StorageChange }, areaName: string) => {
        if (areaName == 'local') {
            logger.logServiceWorker(`ServiceWorkerStorageOnChangedHandler.handleTabDataOnChanged: `, LogLevel.DEBUG, changes, areaName)
            if (Object.keys(changes).includes(STORAGE_KEY_TABS)) {
                sendRuntimeMessage({
                    messageType: MessageRequestType.EXTENSION_TAB_DATA_UPDATED,
                    data: changes[STORAGE_KEY_TABS]['newValue'] as ExtensionTabsData,
                }).then(() => { 
                    const lastError = lastRuntimeError()
                    if (lastError) {
                        logger.logServiceWorker('Runtime Error in handleTabDataOnChanged', LogLevel.WARN, lastError)
                    }
                })
            }
        }
    }
  
  public handleVulnerabilityDataOnChanged = (changes: { [key: string]: browser.storage.StorageChange }, areaName: string) => {
        if (areaName == 'local') {
            logger.logGeneral(`ServiceWorkerStorageOnChangedHandler.handleVulnerabilityDataOnChanged: `, LogLevel.DEBUG, changes, areaName)
            if (Object.keys(changes).includes(STORAGE_KEY_VULNERABILITIES)) {
                sendRuntimeMessage({
                    messageType: MessageRequestType.EXTENSION_VULNERABILITY_DATA_UPDATED,
                    data: changes[STORAGE_KEY_VULNERABILITIES]['newValue'] as ExtensionVulnerabilitiesData,
                }).then(() => {
                    const lastError = lastRuntimeError()
                    if (lastError) {
                        logger.logServiceWorker('Runtime Error in handleVulnerabilityDataOnChanged', LogLevel.WARN, lastError)
                    }
                    logger.logGeneral(`     ==> SENT`, LogLevel.DEBUG)
                })
            }
        }
    }
}
