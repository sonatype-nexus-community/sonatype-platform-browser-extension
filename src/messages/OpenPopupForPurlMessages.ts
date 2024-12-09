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

import { PackageURL } from 'packageurl-js'
import { logger, LogLevel } from '../logger/Logger'
import { ComponentState } from '../types/Component'
import { MESSAGE_REQUEST_TYPE } from '../types/Message'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export async function openPopupForPurl(tabId: number, purl?: PackageURL): Promise<void> {
    logger.logMessage(`Open Popup for PURL: ${purl?.toString()}`, LogLevel.DEBUG)
    _browser.tabs
        .sendMessage(tabId, {
            type: MESSAGE_REQUEST_TYPE.OPEN_POPUP_FOR_PURL,
            params: {
                purl: purl?.toString()
            },
        })
        .catch((err) => {
            logger.logMessage(`Error caught opening popup for PURL`, LogLevel.DEBUG, err)
        })
        .then(() => {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (_browser.runtime.lastError) {
                logger.logMessage(`Error caught opening popup for PURL`, LogLevel.DEBUG, _browser.runtime.lastError)
            }
        })
}
