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
import { ApiApplicationDTO, SecurityVulnerabilityDataDTO } from "@sonatype/nexus-iq-api-client"
import { ExtensionConfiguration, ExternalRepositoryManager, SonatypeSolutionSupport } from "../configuration/types"
import { ComponentStateType } from "../constants"
import { ExtensionTabsData, ExtensionVulnerabilitiesData } from "../data/types"
import { MessageRequestType, MessageResponseStatus } from "./constants"
import { ThreatLevelNumber } from "@sonatype/react-shared-components"

// Message Request related types
// ------------------------------------------------------------------------
export interface MessageRequest {
    messageType: number
}

export interface PurlWithThreatLevelAndMatchState {
    matchState: string,
    threatLevel: ThreatLevelNumber
}

export interface MessageRequestAnnotatePageWithComponentStatuses extends MessageRequest {
    messageType: MessageRequestType.ANNOTATE_PAGE_COMPONENT_IDENTITIES,
    maxThreatLevel: ThreatLevelNumber
    purlsWithThreatLevel: {
        [purl: string]: PurlWithThreatLevelAndMatchState
    }
    repoTypeId: string
}

export interface MessageRequestIqConnectivityAndVersionCheck extends MessageRequest {
    messageType: MessageRequestType.CONNECTIVITY_AND_VERSION_CHECK
}

export interface MessageRequestExtensionDataUpdated extends MessageRequest {
    messageType: MessageRequestType.EXTENSION_DATA_UPDATED
    extensionConfiguration: ExtensionConfiguration
    tabsData: ExtensionTabsData
    vulnerabilitiesData: ExtensionVulnerabilitiesData
}

export interface MessageRequestExtensionConfigurationUpdated extends MessageRequest {
    messageType: MessageRequestType.EXTENSION_CONFIGURATION_UPDATED
	newExtensionConfig: ExtensionConfiguration
}

export interface MessageRequestExtensionTabDataUpdated extends MessageRequest {
    messageType: MessageRequestType.EXTENSION_TAB_DATA_UPDATED,
    data: ExtensionTabsData
}

export interface MessageRequestExtensionVulnerabilityDataUpdated extends MessageRequest {
    messageType: MessageRequestType.EXTENSION_VULNERABILITY_DATA_UPDATED,
    data: ExtensionVulnerabilitiesData
}

export interface MessageRequestLoadApplications extends MessageRequest {
    messageType: MessageRequestType.LOAD_APPLICATIONS
}

export interface MessageRequestLoadVulnerability extends MessageRequest {
    messageType: MessageRequestType.LOAD_VULNERABILITY,
    vulnerabilityReference: string
}

export interface MessageRequestSetNewExtensionConfiguration extends MessageRequest {
    messageType: MessageRequestType.SET_NEW_EXTENSION_CONFIGURATION
	newExtensionConfig: ExtensionConfiguration
}

export interface MessageRequestPageComponentIdentitiesParsed extends MessageRequest {
    messageType: MessageRequestType.PAGE_COMPONENT_IDENTITIES,
    componentIdentities: Array<string>,
    pageUrl: string,
    repoTypeId: string
}

export interface MessageRequestRequestComponentIdentitiesFromPage extends MessageRequest {
    messageType: MessageRequestType.REQUEST_COMPONENT_IDENTITIES_FROM_PAGE
    externalReopsitoryManagers: { [key: string]: ExternalRepositoryManager }
    repoTypeId: string
}

export interface MessageRequestRequestNewExternalRepositoryManager extends MessageRequest {
    messageType: MessageRequestType.REQUEST_NEW_EXTERNAL_REPOSITORY_MANAGER,
    url: string
}

export interface MessageRequestRequestRemovalExternalRepositoryManager extends MessageRequest {
    messageType: MessageRequestType.REQUEST_REMOVAL_EXTERNAL_REPOSITORY_MANAGER,
    url: string
}

interface ComponentStateUpdate {
    PackageUrl: string
    State: ComponentStateType
}

export interface MessageRequestPropogateComponentStates {
	componentStates: Set<ComponentStateUpdate>
}

export type AnyMessageRequest = MessageRequestAnnotatePageWithComponentStatuses
    | MessageRequestIqConnectivityAndVersionCheck
    | MessageRequestExtensionConfigurationUpdated
    | MessageRequestExtensionTabDataUpdated
    | MessageRequestExtensionVulnerabilityDataUpdated
    | MessageRequestLoadApplications
    | MessageRequestLoadVulnerability
    | MessageRequestPageComponentIdentitiesParsed
    | MessageRequestRequestComponentIdentitiesFromPage
    | MessageRequestRequestNewExternalRepositoryManager
    | MessageRequestRequestRemovalExternalRepositoryManager
    | MessageRequestSetNewExtensionConfiguration

// Message Response related types
// ------------------------------------------------------------------------
export interface MessageResponse {
    status: MessageResponseStatus
    status_detail?: string
    status_error?: Error
}

export type MessageResponseFunction = (response: AnyResponse) => void

export interface MessageResponseExtensionConfigurationUpdated extends MessageResponse {
    newConfiguration: ExtensionConfiguration
}

export interface MessageResponseIqConnectivityAndVersionCheck extends MessageResponse, SonatypeSolutionSupport {
    iqAuthenticated: boolean
    iqLastAuthenticated: Date
    iqLastError: string | undefined
    iqVersion: number
}

export interface MessageResponseLoadApplications extends MessageResponse {
    applications: Array<ApiApplicationDTO>
}

export interface MessageResponseLoadVulnerability extends MessageResponse {
    vulnerability: SecurityVulnerabilityDataDTO | undefined
}

export interface MessageResponsePageComponentIdentitiesParsed extends MessageResponse {
    componentIdentities: Array<string>
}

export type AnyResponse = MessageResponseExtensionConfigurationUpdated
    | MessageResponseIqConnectivityAndVersionCheck
    | MessageResponseLoadApplications
    | MessageResponseLoadVulnerability
    | MessageResponsePageComponentIdentitiesParsed
    | MessageResponse