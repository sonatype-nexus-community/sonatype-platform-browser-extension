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
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ApiComponentOrPurlIdentifierDTOV2 } from '@sonatype/nexus-iq-api-client'
import {
    NxFontAwesomeIcon,
    NxLoadingSpinner
} from '@sonatype/react-shared-components'
import React, { useContext, useEffect, useState } from 'react'
import { Analytics } from '../../common/analytics/analytics'
import { ThisBrowser } from '../../common/constants'
import { ExtensionVulnerabilityDataContext } from '../../common/context/extension-vulnerability-data'
import { logger, LogLevel } from '../../common/logger'

export default function VersionTimeline(props: Readonly<{ componentIdentifier?: ApiComponentOrPurlIdentifierDTOV2 }>) {
    const analytics = new Analytics()
    
    const extensionVulnerabilityDataContext = useContext(ExtensionVulnerabilityDataContext)

    const [loading, setLoading] = useState<boolean>(false)
    const [componentIdentifier, setComponentIdentifier] = useState<ApiComponentOrPurlIdentifierDTOV2 | undefined>(undefined)
    const [componentVersions, setComponentVersions] = useState<Array<string> | undefined>(undefined)

    useEffect(() => {
        if (!loading) {
            logger.logReact('Requesting Component Versions', LogLevel.DEBUG, props.componentIdentifier)
            setLoading(true)
            setComponentIdentifier(props.componentIdentifier)
            // sendRuntimeMessage({
            //     messageType: MessageRequestType.LOAD_VULNERABILITY,
            //     vulnerabilityReference: props.vulnerabilityReference as string,
            // }).then((msgResponse) => {
            //     const lastError = lastRuntimeError()
            //     if (lastError) {
            //         logger.logReact('Runtime Error in VulnerabilityPanel.useEffect', LogLevel.WARN, lastError)
            //     }

            //     logger.logReact(
            //         'Response',
            //         LogLevel.DEBUG,
            //         msgResponse,
            //         extensionVulnerabilityDataContext.vulnerabilities
            //     )
            // })
            analytics.firePageViewEvent(
                `Side Panel Version Timeline: ${props.componentIdentifier?.packageUrl as string}`,
                globalThis.location.href,
            )
        }
    }, [props.componentIdentifier])

    // useEffect(() => {
    //     logger.logReact('Vulnerability Data updated', LogLevel.DEBUG, extensionVulnerabilityDataContext.vulnerabilities)
    //     if (Object.keys(extensionVulnerabilityDataContext.vulnerabilities).includes(vulnerabilityReference)) {
    //         setVulnerability(extensionVulnerabilityDataContext.vulnerabilities[vulnerabilityReference])
    //         setLoading(false)
    //     }
    // }, [extensionVulnerabilityDataContext.vulnerabilities, vulnerabilityReference])

    if (componentVersions === undefined) {
        return (
            <>
                <header className='nx-global-header'>
                    <div className='nx-back-button tm-back-button'>
                        <a className='nx-text-link' onClick={() => globalThis.history.back()} role='button'>
                            <NxFontAwesomeIcon icon={faArrowLeft} />
                            <span>{ThisBrowser.i18n.getMessage('BACK_TO_COMPONENT_LINK')}</span>
                        </a>
                    </div>
                </header>
                <section className='nx-tile'>
                    <header className='nx-tile-header'>
                        <div className='nx-tile-header__title'>
                            <h2 className='nx-h2'>Version History</h2>
                        </div>
                    </header>
                    <div className='nx-tile-content'>
                        <NxLoadingSpinner />
                    </div>
                </section>
            </>
        )
    }

    return (
        <>
            {/* <header className='nx-global-header'>
                <div className='nx-back-button tm-back-button'>
                    <a className='nx-text-link' onClick={() => globalThis.history.back()} role='button'>
                        <NxFontAwesomeIcon icon={faArrowLeft} />
                        <span>{ThisBrowser.i18n.getMessage('BACK_TO_COMPONENT_LINK')}</span>
                    </a>
                </div>
            </header>
            <section className='nx-tile'>
                <header className='nx-tile-header'>
                    <div className='nx-tile-header__title'>
                        <h2 className='nx-h2'>{vulnerabilityReference}</h2>
                    </div>
                    <div className='nx-tile__tags'>
                        <VulnerabilityResearchType
                            type={vulnerability.data.researchType as SecurityVulnerabilityDataDTOResearchTypeEnum}
                        />
                    </div>
                    <div className='nx-tile__actions'>
                        {vulnerabilityReference.startsWith('CVE-') && (
                            <NxTextLink
                                href={`https://nvd.nist.gov/vuln/detail/${vulnerabilityReference}`}
                                external={true}
                                newTab={true}>
                                NVD
                            </NxTextLink>
                        )}
                    </div>
                </header>
                <div className='nx-tile-content'>
                    {loading || (vulnerability === undefined && <NxLoadingSpinner />) || (
                        <div className='nx-tile-content nx-tile-content--accordion-container'>
                            <NxDescriptionList>
                                <NxDescriptionList.Item>
                                    <NxDescriptionList.Term style={{ width: '145px' }}>
                                        {vulnerability.data.mainSeverity?.sourceLabel}
                                    </NxDescriptionList.Term>
                                    <NxDescriptionList.Description>
                                        <NxVulnerabilityIndicator
                                            score={vulnerability.data.mainSeverity?.score as number}
                                        />
                                        <span className='nx-vulnerability-score'>
                                            {formatVulnerabilityScore(vulnerability.data.mainSeverity?.score as number)}
                                        </span>
                                    </NxDescriptionList.Description>
                                </NxDescriptionList.Item>
                                {vulnerability.data.severityScores?.map((score) => {
                                    return (
                                        <NxDescriptionList.Item key={getUniqueId('severity-score')}>
                                            <NxDescriptionList.Term style={{ width: '145px' }}>
                                                {score.sourceLabel}
                                            </NxDescriptionList.Term>
                                            <NxDescriptionList.Description>
                                                <NxVulnerabilityIndicator score={score.score as number} />
                                                <span className='nx-vulnerability-score'>
                                                    {formatVulnerabilityScore(score.score as number)}
                                                </span>
                                            </NxDescriptionList.Description>
                                        </NxDescriptionList.Item>
                                    )
                                })}
                                <NxDescriptionList.Item>
                                    <NxDescriptionList.Term style={{ width: '145px' }}>
                                        {ThisBrowser.i18n.getMessage('KEV_STATUS_LABEL')}
                                    </NxDescriptionList.Term>
                                    <NxDescriptionList.Description>
                                        {(vulnerability.data.kevData?.isKev === true && (
                                            <NxTag color='red'>
                                                {ThisBrowser.i18n.getMessage('KEV_STATUS_FLAGGED')}
                                            </NxTag>
                                        )) || <NxTag>{ThisBrowser.i18n.getMessage('KEV_STATUS_NOT_FLAGGED')}</NxTag>}
                                    </NxDescriptionList.Description>
                                </NxDescriptionList.Item>
                                <NxDescriptionList.Item>
                                    <NxDescriptionList.Term style={{ width: '145px' }}>
                                        <NxTextLink href='https://help.sonatype.com/en/sonatype-iq-server-194-release-notes.html#expanded-risk-data-with-exploit-prediction-scoring-system--epss--integration' target='_blank' external>
                                            {ThisBrowser.i18n.getMessage('EPSS_SCORE_LABEL')}
                                        </NxTextLink>
                                    </NxDescriptionList.Term>
                                    <NxDescriptionList.Description>
                                        <EpssScore epssData={vulnerability.data.epssData} />
                                    </NxDescriptionList.Description>
                                </NxDescriptionList.Item>
                            </NxDescriptionList>

                            {vulnerability.data.description && (
                                <NxStatefulAccordion>
                                    <NxAccordion.Header>
                                        <NxAccordion.Title>
                                            <NxTooltip
                                                title={ThisBrowser.i18n.getMessage(
                                                    'VULNERABILITY_SECTION_NVD_DESCRIPTION'
                                                )}>
                                                <span>
                                                    {ThisBrowser.i18n.getMessage(
                                                        'VULNERABILITY_SECTION_NVD_DESCRIPTION'
                                                    )}
                                                </span>
                                            </NxTooltip>
                                        </NxAccordion.Title>
                                    </NxAccordion.Header>
                                    <p className='nx-p'>{vulnerability.data.description}</p>
                                </NxStatefulAccordion>
                            )}

                            {vulnerability.data.explanationMarkdown && (
                                <NxStatefulAccordion>
                                    <NxAccordion.Header>
                                        <NxAccordion.Title>
                                            <NxTooltip
                                                title={ThisBrowser.i18n.getMessage(
                                                    'VULNERABILITY_SECTION_SONATYPE_EXPLANATION'
                                                )}>
                                                <span>
                                                    {ThisBrowser.i18n.getMessage(
                                                        'VULNERABILITY_SECTION_SONATYPE_EXPLANATION'
                                                    )}
                                                </span>
                                            </NxTooltip>
                                        </NxAccordion.Title>
                                    </NxAccordion.Header>
                                    <Markdown>{vulnerability.data.explanationMarkdown}</Markdown>
                                </NxStatefulAccordion>
                            )}

                            {vulnerability.data.recommendationMarkdown && (
                                <NxStatefulAccordion>
                                    <NxAccordion.Header>
                                        <NxAccordion.Title>
                                            <NxTooltip
                                                title={ThisBrowser.i18n.getMessage(
                                                    'VULNERABILITY_SECTION_SONATYPE_RECOMMENDATION'
                                                )}>
                                                <span>
                                                    {ThisBrowser.i18n.getMessage(
                                                        'VULNERABILITY_SECTION_SONATYPE_RECOMMENDATION'
                                                    )}
                                                </span>
                                            </NxTooltip>
                                        </NxAccordion.Title>
                                    </NxAccordion.Header>
                                    <Markdown>{vulnerability.data.recommendationMarkdown}</Markdown>
                                </NxStatefulAccordion>
                            )}

                            {vulnerability.data.detectionMarkdown && (
                                <NxStatefulAccordion>
                                    <NxAccordion.Header>
                                        <NxAccordion.Title>
                                            <NxTooltip
                                                title={ThisBrowser.i18n.getMessage('VULNERABILITY_SECTION_DETECTION')}>
                                                <span>
                                                    {ThisBrowser.i18n.getMessage('VULNERABILITY_SECTION_DETECTION')}
                                                </span>
                                            </NxTooltip>
                                        </NxAccordion.Title>
                                    </NxAccordion.Header>
                                    <Markdown>{vulnerability.data.detectionMarkdown}</Markdown>
                                </NxStatefulAccordion>
                            )}

                            <NxStatefulAccordion>
                                <NxAccordion.Header>
                                    <NxAccordion.Title>
                                        <NxTooltip
                                            title={ThisBrowser.i18n.getMessage('VULNERABILITY_SECTION_ADVISORIES')}>
                                            <span>
                                                {ThisBrowser.i18n.getMessage('VULNERABILITY_SECTION_ADVISORIES')}
                                            </span>
                                        </NxTooltip>
                                    </NxAccordion.Title>
                                </NxAccordion.Header>
                                {(vulnerability.data.advisories && vulnerability.data.advisories.length > 0 && (
                                    <ul className='nx-lis nx-list--bulleted'>
                                        {vulnerability.data.advisories?.map((advisory) => {
                                            return (
                                                <li className='nx-list__item' key={getUniqueId('advisory')}>
                                                    <span className='nx-list__text'>
                                                        {advisory.referenceType}:{' '}
                                                        <NxTextLink external href={advisory.url} newTab={true}>
                                                            {advisory.url}
                                                        </NxTextLink>
                                                    </span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )) || <em>{ThisBrowser.i18n.getMessage('VULNERABILITY_NO_ADVISORIES')}</em>}
                            </NxStatefulAccordion>

                            <VulnerabilityMetaDataSection vulnerabilityData={vulnerability.data} />
                        </div>
                    )}
                </div>
            </section> */}
        </>
    )
}
