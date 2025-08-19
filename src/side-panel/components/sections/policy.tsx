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
import { ApiComponentPolicyViolationListDTOV2, ApiPolicyViolationDTOV2 } from "@sonatype/nexus-iq-api-client"
import { NxStatefulAccordion, NxAccordion, NxTable, NxPolicyViolationIndicator, ThreatLevelNumber } from "@sonatype/react-shared-components"
import { ThisBrowser } from "../../../common/constants"

export default function PolicySection(props: Readonly<{ policyData: ApiComponentPolicyViolationListDTOV2 | undefined }>) {
    const [count, setCount] = useState(0)
    const [sortedIssues, setSortedIssues] = useState<ApiPolicyViolationDTOV2[]>([])

    function sortPolicyViolations(policyViolations: ApiPolicyViolationDTOV2[]): ApiPolicyViolationDTOV2[] {
            return policyViolations
                .sort((a: ApiPolicyViolationDTOV2, b: ApiPolicyViolationDTOV2) => {
                    return (b.threatLevel ?? 0) - (a.threatLevel ?? 0)
                })
        }

    useEffect(() => {
        setCount(props.policyData?.policyViolations ? props.policyData.policyViolations.length : 0)
        setSortedIssues(sortPolicyViolations(props.policyData?.policyViolations || []))
    }, [props.policyData])

    return (
        <NxStatefulAccordion>
            <NxAccordion.Header>
                <NxAccordion.Title>
                    {ThisBrowser.i18n.getMessage('POPUP_TAB_POLICY')}
                    <span className="nx-counter">{count}</span>
                </NxAccordion.Title>
            </NxAccordion.Header>
            <NxTable>
                <NxTable.Head>
                    <NxTable.Row>
                        <NxTable.Cell>{ThisBrowser.i18n.getMessage('POLICY_TABLE_THREAT')}</NxTable.Cell>
                        <NxTable.Cell>{ThisBrowser.i18n.getMessage('POLICY_TABLE_POLICY')}</NxTable.Cell>
                    </NxTable.Row>
                </NxTable.Head>
                <NxTable.Body emptyMessage="No Policy Violations">
                    {sortedIssues.map((pv, i) => {
                        return (
                            <NxTable.Row key={`policy-${i}`}>
                                <NxTable.Cell>
                                    <NxPolicyViolationIndicator policyThreatLevel={pv.threatLevel as ThreatLevelNumber}>{pv.threatLevel?.toString()}</NxPolicyViolationIndicator>
                                </NxTable.Cell>
                                <NxTable.Cell>
                                    {pv.policyName}<br />
                                    <em>
                                        {pv.constraintViolations?.map((cv) => {
                                            return cv.constraintName
                                        }).join(', ')}
                                    </em>
                                </NxTable.Cell>
                            </NxTable.Row>
                        )
                    })}
                </NxTable.Body>
            </NxTable>
        </NxStatefulAccordion>
    )
}