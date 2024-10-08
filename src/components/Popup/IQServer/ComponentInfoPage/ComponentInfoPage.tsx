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
    NxFontAwesomeIcon,
    NxLoadingSpinner,
    NxPolicyViolationIndicator,
    NxTextLink,
    ThreatLevelNumber,
} from '@sonatype/react-shared-components'
import React, { useContext } from 'react'
import { ExtensionPopupContext } from '../../../../context/ExtensionPopupContext'
import { ExtensionConfigurationContext } from '../../../../context/ExtensionConfigurationContext'
import { DATA_SOURCE } from '../../../../utils/Constants'
import './ComponentInfoPage.css'
import { ApiPolicyViolationDTOV2 } from '@sonatype/nexus-iq-api-client'
import { getMaxThreatLevelForPolicyViolations } from '../../../../types/Component'
import { Tooltip } from '@material-ui/core'
import { faCodeFork, faStar } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

const formatDate = (date: Date | undefined | null): string => {
    if (date) {
        const dateTime = new Date(date)
        const noTime = dateTime.toUTCString().split(' ').slice(0, 4).join(' ')
        return noTime
    }
    return 'N/A'
}

function GetPolicyViolationsIndicator({ policyData, policyType }) {
    const extConfigContext = useContext(ExtensionConfigurationContext)
    let filteredPolicies: ApiPolicyViolationDTOV2[] | undefined = []
    const policyTypes = ['Security', 'License', 'Architecture']

    if (policyType === 'All Policies') {
        filteredPolicies = policyData.policyViolations
    } else if (policyType === 'Other') {
        filteredPolicies = policyData.policyViolations?.filter(
            (policy) => !policyTypes.some((excludeItem) => policy.policyName.includes(excludeItem))
        )
    } else {
        filteredPolicies = policyData.policyViolations?.filter((policy) => policy.policyName?.includes(policyType))
    }

    const policyTypeLabel = policyType === 'Architecture' ? 'Quality' : policyType

    if (filteredPolicies !== undefined && filteredPolicies.length > 0) {
        const maxPolicyThreatLevel = Math.round(
            getMaxThreatLevelForPolicyViolations(filteredPolicies)
        ) as ThreatLevelNumber
        return (
            <React.Fragment>
                <Tooltip
                    title={_browser.i18n.getMessage('HIGHEST_POLICY_THREAT_LEVELS_TOOLTIP', [policyTypeLabel, extConfigContext.iqApplicationPublidId])}>
                    <section className='nx-card nx-card--equal' aria-label={policyTypeLabel}>
                        <div className='nx-card__content'>
                            <div className='nx-card__call-out'>
                                <NxPolicyViolationIndicator
                                    style={{
                                        width: '10px !important',
                                        margin: 'none !important',
                                    }}
                                    policyThreatLevel={maxPolicyThreatLevel as ThreatLevelNumber}>
                                    {maxPolicyThreatLevel.toString()}
                                </NxPolicyViolationIndicator>
                            </div>
                        </div>
                        <footer className='nx-card__footer'>{policyTypeLabel}</footer>
                    </section>
                </Tooltip>
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <Tooltip
                title={`The highest ${policyTypeLabel} policy threat level for application: ${extConfigContext.iqApplicationPublidId}`}>
                   
                <section className='nx-card nx-card--equal' aria-label={policyTypeLabel}>
                    <div className='nx-card__content'>
                        <div className='nx-card__call-out'>
                            <NxPolicyViolationIndicator>
                                None
                            </NxPolicyViolationIndicator>
                        </div>
                    </div>
                    <footer className='nx-card__footer'>{policyTypeLabel}</footer>
                </section>
            </Tooltip>
        </React.Fragment>
    )
}

function IqComponentInfo() {
    const popupContext = useContext(ExtensionPopupContext)

    if (popupContext.iq?.componentDetails?.component?.displayName == undefined) {
        return <NxLoadingSpinner />
    }
    return (
        <React.Fragment>
            <header className='nx-tile-header'>
                <div className='nx-tile-header__title'>
                    <h3 className='nx-h2'>{popupContext.iq?.componentDetails?.component?.displayName}</h3>
                </div>
            </header>
            <div className='nx-grid-row' id='first-componentinfo-row'>
                <div className='nx-grid-col nx-grid-col--67'>
                    {popupContext.iq?.componentDetails?.component?.hash != null && (
                        <div className='nx-read-only__item'>
                            <dd className='nx-read-only__data'>
                                <span id='hash'>{popupContext.iq?.componentDetails?.component?.hash}</span>
                                {popupContext.iq?.componentDetails.projectData?.sourceControlManagement?.scmMetadata !==
                                    undefined && (
                                    <>
                                        <span className='nx-pull-right'>
                                            <NxFontAwesomeIcon icon={faCodeFork as IconDefinition} title={_browser.i18n.getMessage('GITHUB_FORKS')} />
                                            {_browser.i18n.getMessage('GITHUB_FORKS')}:
                                            <span className='nx-counter'>
                                                {
                                                    popupContext.iq?.componentDetails.projectData
                                                        ?.sourceControlManagement?.scmMetadata?.forks
                                                }
                                            </span>
                                        </span>
                                        <span className='nx-pull-right'>
                                            <NxFontAwesomeIcon icon={faStar as IconDefinition} title={_browser.i18n.getMessage('GITHUB_STARS')} />
                                            {_browser.i18n.getMessage('GITHUB_STARS')}:
                                            <span className='nx-counter'>
                                                {
                                                    popupContext.iq?.componentDetails.projectData
                                                        ?.sourceControlManagement?.scmMetadata?.stars
                                                }
                                            </span>
                                        </span>

                                        <span id='code-url' className='nx-pull-right'>
                                            <NxTextLink
                                                external
                                                href={
                                                    popupContext.iq?.componentDetails.projectData
                                                        ?.sourceControlManagement?.scmUrl
                                                }>
                                                {
                                                    popupContext.iq?.componentDetails.projectData
                                                        ?.sourceControlManagement?.scmUrl
                                                }
                                            </NxTextLink>
                                        </span>
                                    </>
                                )}
                            </dd>
                        </div>
                    )}
                    <div className='nx-grid-row'>
                        <div className='nx-grid-col'>
                        {(popupContext.iq?.componentDetails.integrityRating != null) && (
                            <h4 className="nx-h4">
                            <NxTextLink
                                external
                                href='https://help.sonatype.com/en/release-integrity.html'>
                                {_browser.i18n.getMessage('INTEGRITY_RATING')}
                            </NxTextLink> : {'\u00A0'}
                            {popupContext.iq?.componentDetails.integrityRating} 
                            <br/>
                            </h4>
                        )}
                        {popupContext.iq?.componentDetails.hygieneRating != null && (
                            <Tooltip title={_browser.i18n.getMessage('HYGIENE_RATING_DESC')}>
                            <h4 className="nx-h4">
                                {_browser.i18n.getMessage('HYGIENE_RATING')}
                                : {'\u00A0'} {popupContext.iq?.componentDetails.hygieneRating}
                            </h4>
                            </Tooltip>
                        )}
                      </div>
                    </div>
                </div>                

                {popupContext.iq?.componentDetails.projectData &&
                    (popupContext.iq?.componentDetails.projectData.lastReleaseDate ||
                        popupContext.iq?.componentDetails.projectData.firstReleaseDate ||
                        popupContext.iq?.componentDetails.catalogDate) && (
                        <>
                            <div className='nx-grid-col nx-grid-col--33'>
                                <dl>
                                    {popupContext.iq?.componentDetails.catalogDate && (
                                        <div className='nx-read-only__item'>
                                            <dt className='nx-read-only__label'>
                                            {_browser.i18n.getMessage('CATALOG_DATE')}
                                            </dt>
                                            <dd className='nx-read-only__data'>
                                                {formatDate(new Date(popupContext.iq?.componentDetails.catalogDate))}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </>
                    )}
                {popupContext.iq.componentDetails.policyData &&
                    popupContext.iq.componentDetails.policyData.policyViolations &&
                    popupContext.iq.componentDetails.policyData.policyViolations.length > 0 && (
                        <React.Fragment>
                            <div id='highest-policy-threat-levels'>
                                <hr className='nx-grid-h-keyline' />
                                <header className='nx-grid-header' id='max-policy-header'>
                                    <h4 className='nx-h3 nx-grid-header__title'>
                                        {_browser.i18n.getMessage('HIGHEST_POLICY_THREAT_LEVELS')}
                                    </h4>
                                </header>
                                <div className='nx-grid-row popup-content-row' id='max-policy-content'>
                                    <div className='nx-card-container'>
                                        <GetPolicyViolationsIndicator
                                            policyData={popupContext.iq.componentDetails.policyData}
                                            policyType={'Security'}
                                        />
                                        <GetPolicyViolationsIndicator
                                            policyData={popupContext.iq.componentDetails.policyData}
                                            policyType={'License'}
                                        />
                                        <GetPolicyViolationsIndicator
                                            policyData={popupContext.iq.componentDetails.policyData}
                                            policyType={'Architecture'}
                                        />
                                        <GetPolicyViolationsIndicator
                                            policyData={popupContext.iq.componentDetails.policyData}
                                            policyType={'Other'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
            </div>
        </React.Fragment>
    )
}

export default function ComponentInfoPage() {
    const extensionContext = useContext(ExtensionConfigurationContext)

    return <div>{extensionContext.dataSource === DATA_SOURCE.NEXUSIQ && <IqComponentInfo />}</div>
}
