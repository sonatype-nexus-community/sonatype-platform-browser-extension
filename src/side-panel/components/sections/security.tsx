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
import React, { useEffect, useState } from "react"
import { ApiSecurityDataDTO, ApiSecurityIssueDTO } from "@sonatype/nexus-iq-api-client"
import { NxStatefulAccordion, NxAccordion, NxTable, formatVulnerabilityScore, NxVulnerabilityIndicator, VulnerabilitySeverityRating, getUniqueId } from "@sonatype/react-shared-components"
import { ThisBrowser } from "../../../common/constants"
import { logger, LogLevel } from "../../../common/logger"

export default function SecuritySection(props: Readonly<{ securityData: ApiSecurityDataDTO | undefined }>) {
    const [count, setCount] = useState(0)
    const [sortedIssues, setSortedIssues] = useState<ApiSecurityIssueDTO[]>([])

    function sortSecurityIssues(securityIssues: ApiSecurityIssueDTO[]): ApiSecurityIssueDTO[] {
        return securityIssues
            .sort((a: ApiSecurityIssueDTO, b: ApiSecurityIssueDTO) => {
                return (b.reference ?? "") > (a.reference ?? "") ? 1 : -1
            })
            .sort((a: ApiSecurityIssueDTO, b: ApiSecurityIssueDTO) => {
                return (b.severity ?? 0) - (a.severity ?? 0)
            })
    }

    useEffect(() => {
        setCount(props.securityData?.securityIssues ? props.securityData?.securityIssues.length : 0)
        setSortedIssues(sortSecurityIssues(props.securityData?.securityIssues || []))
    }, [props.securityData])

    return (
        <NxStatefulAccordion>
            <NxAccordion.Header>
                <NxAccordion.Title>
                    {ThisBrowser.i18n.getMessage('POPUP_TAB_SECURITY')}
                    <span className="nx-counter">{count}</span>
                </NxAccordion.Title>
            </NxAccordion.Header>
            <NxTable>
                <NxTable.Head>
                    <NxTable.Row>
                        <NxTable.Cell>{ThisBrowser.i18n.getMessage('SECURITY_TABLE_CVSS')}</NxTable.Cell>
                        <NxTable.Cell>{ThisBrowser.i18n.getMessage('SECURITY_TABLE_ISSUE')}</NxTable.Cell>
                        <NxTable.Cell chevron></NxTable.Cell>
                    </NxTable.Row>
                </NxTable.Head>
                <NxTable.Body emptyMessage="No Security Issues">
                    {sortedIssues.map((si) => {
                        return (
                            <NxTable.Row isClickable key={getUniqueId('security')} onClick={() => {
                                const dest = `/side-panel.html?vulnerabilityReference=${si.reference as string}`
                                logger.logReact("Request to navigate Side Panel", LogLevel.DEBUG, dest)
                                window.location.href = dest
                            }}>
                                <NxTable.Cell>
                                    <NxVulnerabilityIndicator severityRating={si.threatCategory as VulnerabilitySeverityRating} />
                                    <span className="nx-vulnerability-score">{formatVulnerabilityScore(si.severity as number)}</span>
                                </NxTable.Cell>
                                <NxTable.Cell>{si.reference}</NxTable.Cell>
                                <NxTable.Cell chevron />
                            </NxTable.Row>
                        )
                    })}
                </NxTable.Body>
            </NxTable>
        </NxStatefulAccordion>
    )
}