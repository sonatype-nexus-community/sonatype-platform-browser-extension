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
import { faQuestionCircle, faSync, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { ApiApplicationDTO } from '@sonatype/nexus-iq-api-client'
import {
    NxButton,
    NxErrorAlert,
    NxFontAwesomeIcon,
    NxFormGroup,
    NxFormSelect,
    NxTextLink,
    NxTooltip,
} from '@sonatype/react-shared-components'
import React, { useContext, useEffect, useState } from 'react'
import { ThisBrowser } from '../../common/constants'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'
import ExtensionConfigurationStateHelper from '../configuration-state-helper'

interface IqApplicationSelectorProps {
    reloadApplications: () => void
}

export default function IQApplicationSelector(props: Readonly<IqApplicationSelectorProps>) {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const [reloadingApplications, setReloadingApplications] = useState<boolean>(false)
    const [applications, setApplications] = useState<ApiApplicationDTO[]>([])

    useEffect(() => {
        if (extensionConfigContext.iqApplications.length > 0) {
            setApplications(extensionConfigContext.iqApplications)
        }
    }, [extensionConfigContext.iqApplications])

    function handleIqApplicationChange(val: string) {
        const newExtensionSettings = extensionConfigContext
        const [iqApplicationInternalId, iqApplicationPublidId] = val.split('|')
        newExtensionSettings.iqApplicationInternalId = iqApplicationInternalId
        newExtensionSettings.iqApplicationPublidId = iqApplicationPublidId
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    const doReloadApplications = function () {
        setReloadingApplications(true)
        props.reloadApplications()
    }

    const preAmble = function () {
        return (
            <p className='nx-p'>
                <strong>3)</strong> {ThisBrowser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_3')}
                <NxTooltip title={ThisBrowser.i18n.getMessage('OPTIONS_PAGE_TOOLTIP_WHY_APPLICATION')}>
                    <NxFontAwesomeIcon icon={faQuestionCircle as IconDefinition} />
                </NxTooltip>
            </p>
        )
    }

    if (extensionConfigContext.supportsLifecycle === true || extensionConfigContext.supportsFirewall) {
        if (extensionConfigContext.iqApplications.length > 0) {
            // There are Applications to choose from and there is a key licensed Solution
            return (
                <>
                    {preAmble()}
                    <NxFormGroup label={ThisBrowser.i18n.getMessage('LABEL_SONATYPE_APPLICATION')} isRequired>
                        <NxFormSelect
                            defaultValue={`${extensionConfigContext.iqApplicationInternalId}|${extensionConfigContext.iqApplicationPublidId}`}
                            onChange={handleIqApplicationChange}
                            disabled={!extensionConfigContext.iqAuthenticated}>
                            <option value=''>{ThisBrowser.i18n.getMessage('LABEL_SELECT_AN_APPLICATION')}</option>
                            {applications.map((app: ApiApplicationDTO) => {
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
                // No Applications and NOT licensed for Lifecycle
                return (
                    <>
                        {preAmble()}
                        <NxErrorAlert>
                            {ThisBrowser.i18n.getMessage('OPTIONS_NO_APPLICATIONS_NXFW_ONLY')}
                            <NxTextLink external href='https://sonatype-nexus-community.github.io/sonatype-platform-browser-extension/faq.html#i-have-sonatype-repository-firewall-and-no-applications'>
                                here
                            </NxTextLink>
                            .
                        </NxErrorAlert>
                    </>
                )
            } else {
                // No Applications and licensed for Lifecycle
                return (
                    <>
                        {preAmble()}
                        <NxErrorAlert>{ThisBrowser.i18n.getMessage('OPTIONS_NO_APPLICATIONS_NXLC')}</NxErrorAlert>
                        <NxButton variant='primary' onClick={doReloadApplications}>
                            <NxFontAwesomeIcon icon={faSync} spin={reloadingApplications} />
                            <span>{ThisBrowser.i18n.getMessage('BUTTON_REFRESH_APPLICATIONS')}</span>
                        </NxButton>
                    </>
                )
            }
        }
    } else {
        return (
            <>
                {preAmble()}
                {ThisBrowser.i18n.getMessage('OPTIONS_NO_VALID_LICENSE')}
            </>
        )
    }
}
