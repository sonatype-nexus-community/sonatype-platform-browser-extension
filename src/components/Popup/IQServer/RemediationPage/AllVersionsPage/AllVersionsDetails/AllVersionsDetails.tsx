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
    NxGrid,
    NxList,
    NxLoadingSpinner,
    NxMeter,
    NxPolicyViolationIndicator,
    NxThreatIndicator,
    ThreatLevelNumber,
} from '@sonatype/react-shared-components'
import { PackageURL } from 'packageurl-js'
import React, { useContext, useEffect, useRef } from 'react'
import { ExtensionPopupContext } from '../../../../../../context/ExtensionPopupContext'
import { ExtensionConfigurationContext } from '../../../../../../context/ExtensionConfigurationContext'
import './AllVersionsDetails.css'
import { DATA_SOURCE } from '../../../../../../utils/Constants'
import { ApiComponentPolicyViolationListDTOV2, ApiPolicyViolationDTOV2 } from '@sonatype/nexus-iq-api-client'
import { getNewSelectedVersionUrl } from '../../../../../../utils/Helpers'
import { Tooltip } from '@material-ui/core'
import { getMaxThreatLevelForPolicyViolations } from '../../../../../../types/Component'

function IqAllVersionDetails() {
    const popupContext = useContext(ExtensionPopupContext)
    const allVersions = popupContext.iq?.allVersions
    const currentPurl = popupContext.currentPurl
    const currentVersionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        if (currentVersionRef.current) {
            currentVersionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
            })
        }
    }, [allVersions])

    const formatDate = (date: Date | undefined | null): string => {
        if (date) {
            const dateTime = new Date(date)
            const noTime = dateTime.toUTCString().split(' ').slice(0, 4).join(' ')
            return noTime
        }
        return 'N/A'
    }

    function getMaxViolation(policyData: ApiComponentPolicyViolationListDTOV2) {
        if (policyData.policyViolations && policyData.policyViolations.length > 0) {
            return Math.max(
                ...policyData.policyViolations.map((violation) =>
                    violation.threatLevel != undefined ? violation.threatLevel : 0
                )
            )
        }
        return 0
    }

    function catalogDateDifference(startDate: Date | undefined) {
        if (startDate === undefined) {
            return
        }
        const endDate = new Date()
        const differenceInMilliseconds = endDate.getTime() - startDate.getTime()
        const differenceInSeconds = differenceInMilliseconds / 1000
        const differenceInMinutes = differenceInSeconds / 60
        const differenceInHours = Math.round(differenceInMinutes / 60)
        const differenceInDays = Math.round(differenceInHours / 24)
        const differenceInMonths =
            endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear())
        const differenceInWeeks = Math.round(differenceInDays / 7)

        let yearsDiff = endDate.getFullYear() - startDate.getFullYear()

        if (
            endDate.getMonth() < startDate.getMonth() ||
            (endDate.getMonth() === startDate.getMonth() && endDate.getDate() < startDate.getDate())
        ) {
            yearsDiff -= 1
        }

        const difference = {
            milliseconds: differenceInMilliseconds,
            seconds: differenceInSeconds,
            minutes: differenceInMinutes,
            hours: differenceInHours,
            days: differenceInDays,
            months: differenceInMonths,
            weeks: differenceInWeeks,
            years: yearsDiff,
        }

        if (difference.years !== undefined && difference.years > 0) {
            const yearString = `${difference.years} yr${difference.years !== 1 ? 's' : ''}`
            if (startDate.getMonth() !== 11) {
                const remainingMonths = 12 - startDate.getMonth() - 1
                const monthString = `${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`
                return `${yearString} ${monthString}`
            }
            return yearString
        } else if (difference.months !== undefined && difference.months > 0) {
            return `${difference.months} mo${difference.months !== 1 ? 's' : ''}`
        } else if (difference.weeks !== undefined && difference.weeks >= 1) {
            return `${difference.weeks} wk${difference.weeks !== 1 ? 's' : ''}`
        } else if (difference.days !== undefined && difference.days >= 2) {
            return `${difference.days} day${difference.days !== 1 ? 's' : ''}`
        } else if (difference.hours !== undefined && difference.hours > 0) {
            return `${difference.hours} hr${difference.hours !== 1 ? 's' : ''}`
        } else if (difference.minutes !== undefined && difference.minutes > 0) {
            return `${difference.minutes} min${difference.minutes !== 1 ? 's' : ''}`
        } else {
            return `${difference.seconds} sec${difference.seconds !== 1 ? 's' : ''}`
        }
    }

    function GetPolicyViolationsIndicator({ policyData, policyType }) {
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
                        arrow
                        title={`The highest ${policyTypeLabel} policy threat level: ${maxPolicyThreatLevel}`}>
                        <span>
                            <NxThreatIndicator policyThreatLevel={maxPolicyThreatLevel} />
                        </span>
                    </Tooltip>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <Tooltip arrow title={`No ${policyTypeLabel} policy violations`}>
                    <span>
                        <NxThreatIndicator />
                    </span>
                </Tooltip>
            </React.Fragment>
        )
    }

    if (allVersions) {
        return (
            <NxList id='all-versions-list'>
                {allVersions.map((version) => {
                    const versionPurl = PackageURL.fromString(version.component?.packageUrl as string)

                    return (
                        <NxList.ButtonItem
                            key={version.component?.packageUrl}
                            selected={versionPurl.version == currentPurl?.version}>
                            <NxList.Text
                                // @todo : Only allow click if the RepoType defines supportsVersionNavigation === true
                                onClick={() =>
                                    getNewSelectedVersionUrl(
                                        new URL(popupContext.currentTab?.url as string),
                                        popupContext.currentPurl as PackageURL,
                                        versionPurl.version as string | undefined
                                    )
                                }
                                ref={currentPurl?.version == versionPurl.version ? currentVersionRef : null}>
                                <NxGrid.Row
                                    style={{
                                        marginTop: '0px',
                                        marginBottom: '0px',
                                    }}>
                                    <NxGrid.Column className='nx-grid-col-50'>
                                        <NxGrid.Header>
                                            {/* <strong>{versionPurl.version}</strong> */}
                                            <NxPolicyViolationIndicator
                                                style={{ marginBottom: '16px !important' }}
                                                policyThreatLevel={
                                                    Math.round(
                                                        getMaxViolation(
                                                            version.policyData as ApiComponentPolicyViolationListDTOV2
                                                        )
                                                    ) as ThreatLevelNumber
                                                }>
                                                {versionPurl.version}
                                            </NxPolicyViolationIndicator>

                                            <Tooltip title={`Catalog Date: ${formatDate(version.catalogDate)}`}>
                                                {/* <span className='nx-pull-right'>{calculateAge(version.catalogDate)} Yrs</span> */}
                                                <span className='nx-pull-right'>
                                                    {catalogDateDifference(version.catalogDate)}
                                                </span>
                                            </Tooltip>
                                        </NxGrid.Header>
                                        {version.policyData != undefined && (
                                            <React.Fragment>
                                                <GetPolicyViolationsIndicator
                                                    policyData={version.policyData}
                                                    policyType={'Security'}
                                                />
                                                <GetPolicyViolationsIndicator
                                                    policyData={version.policyData}
                                                    policyType={'License'}
                                                />
                                                <GetPolicyViolationsIndicator
                                                    policyData={version.policyData}
                                                    policyType={'Architecture'}
                                                />
                                                <GetPolicyViolationsIndicator
                                                    policyData={version.policyData}
                                                    policyType={'Other'}
                                                />
                                            </React.Fragment>
                                        )}
                                    </NxGrid.Column>
                                    {version.relativePopularity !== undefined && (
                                        <NxGrid.Column className='nx-grid-col-50'>
                                            <Tooltip title={`Popularity: ${version.relativePopularity}`}>
                                                <div>
                                                    <NxMeter
                                                        value={version.relativePopularity as number}
                                                        max={100}
                                                        children={''}
                                                        style={{
                                                            color: 'rgb(139, 199, 62) !important',
                                                        }}
                                                    />
                                                </div>
                                            </Tooltip>
                                        </NxGrid.Column>
                                    )}
                                </NxGrid.Row>
                            </NxList.Text>
                        </NxList.ButtonItem>
                    )
                })}
            </NxList>
        )
    } else {
        return <NxLoadingSpinner />
    }
}

export default function AllVersionDetails() {
    const extensionContext = useContext(ExtensionConfigurationContext)

    return <div>{extensionContext.dataSource === DATA_SOURCE.NEXUSIQ && <IqAllVersionDetails />}</div>
}
