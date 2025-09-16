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
import { NxInfoAlert, NxSmallThreatCounter, NxTable } from '@sonatype/react-shared-components'
import React from 'react'
import { ThisBrowser } from '../../common/constants'
import { ComponentData } from '../../common/data/types'
import { formatDate } from '../../common/date'
import { PolicyThreatLevelUtil } from '../../common/policy/policy-util'
import LegalSection from './sections/legal'
import PolicySection from './sections/policy'
import RemediationSection from './sections/remediation'
import SecuritySection from './sections/security'
import { ComponentLegalUtil } from '../../common/component/component-legal-util'
import { MATCH_STATE_EXACT } from '../../common/component/constants'

export default function Component(props: Readonly<{ component: ComponentData }>) {
    const legalPolicyUtils = new ComponentLegalUtil(props.component)

    const policyThreatLevelSummary = props.component?.componentDetails
        ? PolicyThreatLevelUtil.getThreatLevelSummary(props.component.componentDetails)
        : undefined

    if (props.component === undefined) {
        return <>No components identified on the current page.</>
    }

    return (
        <section className='nx-tile'>
            <header className='nx-tile-header'>
                <div className='nx-tile-header__title'>
                    <h3 className='nx-h3'>{props.component.componentDetails?.component?.displayName as string}</h3>
                </div>
            </header>
            {props.component.componentDetails?.matchState === MATCH_STATE_EXACT && (
                <>
                    <div className='nx-tile-content'>
                        <NxTable>
                            <NxTable.Body>
                                <NxTable.Row>
                                    <NxTable.Cell>{ThisBrowser.i18n.getMessage('POLICY_VIOLATIONS')}</NxTable.Cell>
                                    <NxTable.Cell>
                                        <NxSmallThreatCounter
                                            criticalCount={policyThreatLevelSummary?.criticalCount}
                                            severeCount={policyThreatLevelSummary?.severeCount}
                                            moderateCount={policyThreatLevelSummary?.moderateCount}
                                            lowCount={policyThreatLevelSummary?.lowCount}
                                        />
                                    </NxTable.Cell>
                                </NxTable.Row>
                                {props.component.componentDetails?.catalogDate !== undefined && (
                                    <NxTable.Row>
                                        <NxTable.Cell>{ThisBrowser.i18n.getMessage('CATALOG_DATE')}</NxTable.Cell>
                                        <NxTable.Cell>
                                            {formatDate(new Date(props.component.componentDetails?.catalogDate))}
                                        </NxTable.Cell>
                                    </NxTable.Row>
                                )}
                                {props.component.componentDetails?.integrityRating !== undefined && (
                                    <NxTable.Row>
                                        <NxTable.Cell>{ThisBrowser.i18n.getMessage('INTEGRITY_RATING')}</NxTable.Cell>
                                        <NxTable.Cell>{props.component.componentDetails?.integrityRating}</NxTable.Cell>
                                    </NxTable.Row>
                                )}
                            </NxTable.Body>
                        </NxTable>
                    </div>
                    <div className='nx-tile-content nx-tile-content--accordion-container'>
                        <RemediationSection remediationDetails={props.component.componentRemediationDetails} />
                        <PolicySection policyData={props.component.componentDetails?.policyData} />
                        <SecuritySection securityData={props.component.componentDetails?.securityData} />
                        <LegalSection
                            declared={legalPolicyUtils.getDeclaredWithThreatLevel()}
                            effective={legalPolicyUtils.getEffectivedWithThreatLevel()}
                            observed={legalPolicyUtils.getObservedWithThreatLevel()}
                            licenseData={props.component.componentDetails?.licenseData}
                        />
                    </div>
                </>
            )}
            {props.component.componentDetails?.matchState !== MATCH_STATE_EXACT && (
                <section className='nx-tile'>
                    <div className='nx-tile-content'>
                        <NxInfoAlert>
                            <h3 className="nx-h3">{ThisBrowser.i18n.getMessage('HEADING_NO_COMPONENTS_MATCHED')}</h3>
                            <p className="nx-p">
                                {ThisBrowser.i18n.getMessage('CONTENT_NO_COMPONENTS_MATCHED')}
                                The Component with the following PackageURL is not known to Sonatype:<br />
                            </p>
                            <p className='nx-p'>
                                This could be for one of two reasons:<br />

                                1. An invalid Package URL was generated for this Component<br />
                                2. This Component has not been cataloged by Sonatype
                            </p>
                            <code>{props.component.componentDetails?.component?.packageUrl}</code>
                        </NxInfoAlert>
                    </div>
                </section>
            )}
        </section>
    )
}
