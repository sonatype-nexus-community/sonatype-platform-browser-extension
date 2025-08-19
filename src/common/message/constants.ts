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

export enum MessageRequestType {
    // Sent to Content Script to annotate page with Component Statuses
    ANNOTATE_PAGE_COMPONENT_IDENTITIES = 100,

    // Sent to request Connectivity and Version check for IQ Server
    CONNECTIVITY_AND_VERSION_CHECK,

    // General Broadcast Message from Service Worker to Popup/SidePanel
    EXTENSION_DATA_UPDATED,

    // Sent when Extension Configuration for the Extension is updated
    EXTENSION_CONFIGURATION_UPDATED,

    // Sent when Tab Data stored in the Extension is updated
    EXTENSION_TAB_DATA_UPDATED,

    // Sent when Vulnerability Data stored in the Extension is updated
    EXTENSION_VULNERABILITY_DATA_UPDATED,

    // Request to load Applications from IQ Server
    LOAD_APPLICATIONS,

    // Request to load a Vulnerability from IQ Server
    LOAD_VULNERABILITY,
    
    // Used once Component Evaluation has completed - with the headline results
    // PAGE_COMPONENTS_EVALUATED,

    // Sent by the Content Script once it has parsed component identited from the current page (if supported)
    PAGE_COMPONENT_IDENTITIES,

    // Sent by Service Worker to request Content Script parse Component Identities
    REQUEST_COMPONENT_IDENTITIES_FROM_PAGE,

    // Sent to persist new Extension Configuration
    SET_NEW_EXTENSION_CONFIGURATION
}

export enum MessageResponseStatus {
    SUCCESS = 1,
    AUTH_ERROR,
    FAILURE,
    UNKNOWN_ERROR,
}