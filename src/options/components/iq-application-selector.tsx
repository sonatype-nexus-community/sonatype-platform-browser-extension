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
import React, { useContext, useEffect, useState } from 'react'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'
import { faQuestionCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { ApiApplicationDTO } from '@sonatype/nexus-iq-api-client'
import { NxTooltip, NxFontAwesomeIcon, NxFormGroup, NxFormSelect } from '@sonatype/react-shared-components'
import { ThisBrowser } from '../../common/constants'
import ExtensionConfigurationStateHelper from '../configuration-state-helper'

export default function IQApplicationSelector() {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)

    function handleIqApplicationChange(val: string) {
        const newExtensionSettings = extensionConfigContext
        const [iqApplicationInternalId, iqApplicationPublidId] = val.split('|')
        newExtensionSettings.iqApplicationInternalId = iqApplicationInternalId
        newExtensionSettings.iqApplicationPublidId = iqApplicationPublidId
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    if (extensionConfigContext.supportsLifecycle === true || extensionConfigContext.supportsFirewall) {
        if (extensionConfigContext.iqApplications.length > 0) {
            // There are Applications to choose from and there is a key licensed Solution
            return (
                <>
                    <p className='nx-p'>
                        <strong>3)</strong> {ThisBrowser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_3')}
                        <NxTooltip title={ThisBrowser.i18n.getMessage('OPTIONS_PAGE_TOOLTIP_WHY_APPLICATION')}>
                            <NxFontAwesomeIcon icon={faQuestionCircle as IconDefinition} />
                        </NxTooltip>
                    </p>

                    <NxFormGroup label={ThisBrowser.i18n.getMessage('LABEL_SONATYPE_APPLICATION')} isRequired>
                        <NxFormSelect
                            defaultValue={`${extensionConfigContext.iqApplicationInternalId}|${extensionConfigContext.iqApplicationPublidId}`}
                            onChange={handleIqApplicationChange}
                            disabled={!extensionConfigContext.iqAuthenticated}>
                            <option value=''>{ThisBrowser.i18n.getMessage('LABEL_SELECT_AN_APPLICATION')}</option>
                            {extensionConfigContext.iqApplications.map((app: ApiApplicationDTO) => {
                                return (
                                    <option key={app.id} value={`${app.id}|${app.publicId}`}>
                                        {app.name}
                                    </option>
                                )
                            })}
                        </NxFormSelect>
                    </NxFormGroup>
                </>
            )
        } else {
            if (!extensionConfigContext.supportsLifecycle) {
                // No Applications and not licensed for Lifecycle

            }
        }
    } else {
        return (
            <></>
        )
    }
}
