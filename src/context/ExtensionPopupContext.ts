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
import React from 'react'
import { DATA_SOURCE } from '../utils/Constants'
import {
    ApiComponentDetailsDTOV2,
    ApiComponentRemediationDTO,
    ApiLicenseLegalMetadataDTO,
} from '@sonatype/nexus-iq-api-client'

export interface IqPopupContext {
    allVersions?: Array<ApiComponentDetailsDTOV2>
    componentDetails?: ApiComponentDetailsDTOV2
    componentLegalDetails?: Set<ApiLicenseLegalMetadataDTO>
    remediationDetails?: ApiComponentRemediationDTO
}

export interface ExtensionPopupContext {
    currentPurl: PackageURL | undefined
    currentTab?: chrome.tabs.Tab | browser.tabs.Tab | undefined
    iq?: IqPopupContext
}

const DEFAULT_IQ_EXTENSION_POPUP_CONTEXT_DATA = {
    currentPurl: undefined,
    currentTab: undefined,
    iq: {},
}

const DEFAULT_UNKNOWN_EXTENSION_POPUP_CONTEXT_DATA = {
    currentPurl: undefined,
}

export const ExtensionPopupContext = React.createContext<ExtensionPopupContext>(DEFAULT_IQ_EXTENSION_POPUP_CONTEXT_DATA)

export function getDefaultPopupContext(dataSource: DATA_SOURCE): ExtensionPopupContext {
    if (dataSource == DATA_SOURCE.NEXUSIQ) {
        return DEFAULT_IQ_EXTENSION_POPUP_CONTEXT_DATA
    } else {
        return DEFAULT_UNKNOWN_EXTENSION_POPUP_CONTEXT_DATA
    }
}
