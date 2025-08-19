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

import { ThisBrowser } from '../constants'
import {
    MEASUREMENT_ID,
    API_SECRET,
    GA_ENDPOINT,
    DEFAULT_ENGAGEMENT_TIME_MSEC,
    SESSION_EXPIRATION_IN_MIN,
} from './analytics-config'

export enum ANALYTICS_EVENT_TYPES {
    BROWSER_UPDATE = 'BROWSER_UPDATE',
    EXTENSION_INSTALL = 'EXTENSION_INSTALL',
    EXTENSION_UPDATE = 'EXTENSION_UPDATE',
    EXTENSION_CONFIG_UPGRADE = 'EXTENSION_CONFIG_UPGRADE',
    PURL_CALCULATED = 'PURL_CALCULATED',
    PURL_CALCULATE_FAILURE = 'PURL_CALCULATE_FAILURE',
}

const extension = ThisBrowser.runtime.getManifest()

export class Analytics {
    // Returns the client id, or creates a new one if one doesn't exist.
    // Stores client id in local storage to keep the same client id as long as
    // the extension is installed.
    async getOrCreateClientId() {
        let { clientId } = await ThisBrowser.storage.local.get('clientId')
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!clientId) {
            // Generate a unique client ID, the actual value is not relevant
            clientId = self.crypto.randomUUID()
            await ThisBrowser.storage.local.set({ clientId })
        }
        return clientId
    }

    // Returns the current session id, or creates a new one if one doesn't exist or
    // the previous one has expired.
    async getOrCreateSessionId() {
        // Use storage.session because it is only in memory
        let { sessionData } = await ThisBrowser.storage.session.get('sessionData')
        const currentTimeInMs = Date.now()
        // Check if session exists and is still valid
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (sessionData?.timestamp) {
            // Calculate how long ago the session was last updated
            const durationInMin = (currentTimeInMs - sessionData.timestamp) / 60000
            // Check if last update lays past the session expiration threshold
            if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
                // Clear old session id to start a new session
                sessionData = null
            } else {
                // Update timestamp to keep session alive
                sessionData.timestamp = currentTimeInMs
                await ThisBrowser.storage.session.set({ sessionData })
            }
        }
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!sessionData) {
            // Create and store a new session
            sessionData = {
                session_id: currentTimeInMs.toString(),
                timestamp: currentTimeInMs.toString(),
            }
            await ThisBrowser.storage.session.set({ sessionData })
        }
        return sessionData.session_id
    }

    // Fires an event with optional params. Event names must only include letters and underscores.
    async fireEvent(name: string, params: Record<string, string | number | undefined> = {}) {
        // Configure session id and engagement time if not present, for more details see:
        // https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#recommended_parameters_for_reports
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!('session_id' in params)) {
            params['session_id'] = await this.getOrCreateSessionId()
        }
        if (!('engagement_time_msec' in params)) {
            params['engagement_time_msec'] = DEFAULT_ENGAGEMENT_TIME_MSEC
        }
        
        // Load in Extension Version
        params['extension_version'] = extension.version

        try {
            await fetch(`${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`, {
                method: 'POST',
                body: JSON.stringify({
                    client_id: await this.getOrCreateClientId(),
                    events: [
                        {
                            name,
                            params,
                        },
                    ],
                }),
            })
            // console.log(await response.text())
        } catch (e) {
            console.error('Google Analytics request failed with an exception', e)
        }
    }

    // Fire a page view event.
    async firePageViewEvent(pageTitle: string, pageLocation: string, additionalParams = {}) {
        return this.fireEvent('page_view', {
            page_title: pageTitle,
            page_location: pageLocation,
            ...additionalParams,
        })
    }

    // Fire an error event.
    async fireErrorEvent(error: Record<string, string | number> | undefined, additionalParams = {}) {
        // Note: 'error' is a reserved event name and cannot be used
        // see https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_names
        return this.fireEvent('extension_error', {
            ...error,
            ...additionalParams,
        })
    }
}

export default new Analytics()