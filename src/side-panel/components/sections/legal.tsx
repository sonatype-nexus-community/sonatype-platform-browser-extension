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
import { ApiLicenseDataDTO } from '@sonatype/nexus-iq-api-client'
import { getUniqueId, NxAccordion, NxPolicyViolationIndicator, NxStatefulAccordion } from '@sonatype/react-shared-components'
import React from 'react'
import { ThisBrowser } from '../../../common/constants'
import { ApiLicenseDTOWithThreatLevel } from '../../../common/component/component-legal-util'

export default function LegalSection(
    props: Readonly<{
        declared: Array<ApiLicenseDTOWithThreatLevel>
        effective: Array<ApiLicenseDTOWithThreatLevel>
        observed: Array<ApiLicenseDTOWithThreatLevel>
        licenseData: ApiLicenseDataDTO | undefined
    }>
) {
    return (
        <NxStatefulAccordion>
            <NxAccordion.Header>
                <NxAccordion.Title>{ThisBrowser.i18n.getMessage('POPUP_TAB_LEGAL')}</NxAccordion.Title>
            </NxAccordion.Header>
            <h3 className='nx-h3'>{ThisBrowser.i18n.getMessage('LEGAL_EFFECTIVE_LICENSE')}</h3>
             {props.effective.length > 0 && (
                <ul className='nx-list'>
                    {props.effective.map((lic) => {
                        return (
                            <li key={getUniqueId('effective-license-')}>
                                <NxPolicyViolationIndicator policyThreatLevel={lic.threatLevel}>
                                    {lic.licenseName}
                                </NxPolicyViolationIndicator>
                            </li>
                        )
                    })}
                </ul>
            )}
            
            <h3 className='nx-h3'>{ThisBrowser.i18n.getMessage('LEGAL_DECLARED_LICENSE')}</h3>
            {props.declared.length > 0 && (
                <ul className='nx-list'>
                    {props.declared.map((lic) => {
                        return (
                            <li key={getUniqueId('declared-license')}>
                                <NxPolicyViolationIndicator policyThreatLevel={lic.threatLevel}>
                                    {lic.licenseName}
                                </NxPolicyViolationIndicator>
                            </li>
                        )
                    })}
                </ul>
            )}

            <h3 className='nx-h3'>{ThisBrowser.i18n.getMessage('LEGAL_OBSERVED_LICENSE')}</h3>
            {props.observed.length > 0 && (
                <ul className='nx-list'>
                    {props.observed.map((lic) => {
                        return (
                            <li key={getUniqueId('observed-license')}>
                                <NxPolicyViolationIndicator policyThreatLevel={lic.threatLevel}>
                                    {lic.licenseName}
                                </NxPolicyViolationIndicator>
                            </li>
                        )
                    })}
                </ul>
            )}
        </NxStatefulAccordion>
    )
}
