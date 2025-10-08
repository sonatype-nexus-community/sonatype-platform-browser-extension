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
import {
    ApiComponentDetailsDTOV2,
    ApiComponentRemediationValueDTO,
    ApiLicenseLegalMetadataDTO,
    SecurityVulnerabilityDataDTO,
} from '@sonatype/nexus-iq-api-client'

export interface ComponentDataAllVersions {
    [version: string]: ApiComponentDetailsDTOV2 | undefined
}

export interface ComponentData {
    allComponentVersions: ComponentDataAllVersions | undefined
    componentDetails: ApiComponentDetailsDTOV2 | undefined
    componentEvaluationDateTime: string
    componentLegalDegtails: Array<ApiLicenseLegalMetadataDTO>
    componentRemediationDetails: ApiComponentRemediationValueDTO | undefined
}

export enum TabDataStatus {
    EVALUATING,
    COMPLETE,
    NO_COMPONENTS,
    NOT_SUPPORTED,
    ERROR,
}

export interface ExtensionTabsData {
    tabs: { [tabId: number]: ExtensionTabData }
}

export interface ExtensionTabData {
    components: { [key: string]: ComponentData }
    repoTypeId: string
    status: TabDataStatus
    tabId: number
}

export interface ExtensionVulnerabilitiesData {
    vulnerabilities: {
        [vulnerabilityReference: string]: ExtensionVulnerabilityData
    }
}

export interface ExtensionVulnerabilityData {
    data: SecurityVulnerabilityDataDTO
    lastUpdated: number
}

export const DEFAULT_TABS_DATA = {
    tabs: {},
}

export const DEFAULT_VULNERABILITY_DATA = {
    vulnerabilities: {},
}
