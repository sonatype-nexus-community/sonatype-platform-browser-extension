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
import { faSpinner, faStar } from '@fortawesome/free-solid-svg-icons'
import { ApiComponentRemediationValueDTO } from '@sonatype/nexus-iq-api-client'
import { getUniqueId, NxAccordion, NxFontAwesomeIcon, useToggle } from '@sonatype/react-shared-components'
import { PackageURL } from 'packageurl-js'
import React, { useEffect, useState } from 'react'
import { ThisBrowser } from '../../../common/constants'
import { logger, LogLevel } from '../../../common/logger'

export default function RemediationSection(
    props: Readonly<{ remediationDetails: ApiComponentRemediationValueDTO | undefined }>
) {
    const [count, setCount] = useState(0)
    const [hasRemediation, setHasRemediation] = useState<boolean>(false)
    const [remediationOpen, toggelRemediation, setRemediationOpen] = useToggle(false)

    useEffect(() => {
        setCount(props.remediationDetails?.versionChanges?.length || 0)
        if ((props.remediationDetails?.versionChanges?.length || 0) > 0 || props.remediationDetails?.suggestedVersionChange !== undefined) {
            logger.logReact("Setting Has Remediation to TRUE", LogLevel.DEBUG)
            setHasRemediation(true)
        }
    }, [props.remediationDetails])

    useEffect(() => {
        setRemediationOpen(hasRemediation)
    }, [hasRemediation])

    return (
        <NxAccordion open={remediationOpen} onToggle={toggelRemediation}>
            <NxAccordion.Header>
                <NxAccordion.Title>
                    {ThisBrowser.i18n.getMessage('POPUP_TAB_REMEDIATION')}
                    {props.remediationDetails === undefined && (
                        <NxFontAwesomeIcon
                            icon={faSpinner}
                            spin={true}
                        />
                    )}
                    {props.remediationDetails !== undefined && (
                        <span className='nx-counter'>{count}</span>
                    )}
                </NxAccordion.Title>
            </NxAccordion.Header>
            {props.remediationDetails?.suggestedVersionChange && (
                <section
                    className='nx-card'
                    aria-label='Basic card'
                >
                    <header className='nx-card__header'>
                        <h3 className='nx-h3'>
                            {props.remediationDetails.suggestedVersionChange.isGolden && (
                                <>
                                    <NxFontAwesomeIcon icon={faStar} color='gold' />
                                    <span style={{marginRight: '8px'}}>{ThisBrowser.i18n.getMessage('GOLDEN_VERSION')}</span>
                                    <NxFontAwesomeIcon icon={faStar} color='gold' style={{marginLeft: 0}} />
                                </>
                            )}
                            {!props.remediationDetails.suggestedVersionChange.isGolden &&
                                ThisBrowser.i18n.getMessage('SUGGESTED_VERSION')}
                        </h3>
                    </header>
                    <div className='nx-card__content'>
                        <div className='nx-card__call-out'>
                            {
                                PackageURL.fromString(
                                    props.remediationDetails?.suggestedVersionChange.data?.component?.packageUrl || ''
                                ).version
                            }
                        </div>
                        <div className='nx-card__text'>
                            {ThisBrowser.i18n.getMessage(
                                    `REMEDIATION_LABEL_${props.remediationDetails?.suggestedVersionChange.type?.replaceAll('-', '_')}`
                                )}
                        </div>
                    </div>
                </section>
            )}

            {count > 0 && (
                <>
                    <h3 className='nx-h3'>{ThisBrowser.i18n.getMessage('RECOMMENDED_VERSIONS')}</h3>
                    <ul className='nx-list'>
                        {props.remediationDetails?.versionChanges?.map((versionChange) => {
                            return (
                                <li
                                    className='nx-list__item'
                                    key={getUniqueId('version-change')}
                                >
                                    <span className='nx-list__text'>
                                        {PackageURL.fromString(versionChange.data?.component?.packageUrl || '').version}
                                    </span>
                                    <span className='nx-list__subtext'>
                                        {ThisBrowser.i18n.getMessage(
                                            `REMEDIATION_LABEL_${versionChange.type?.replaceAll('-', '_')}`
                                        )}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )}
        </NxAccordion>
    )
}
