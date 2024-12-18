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
import { NxList } from '@sonatype/react-shared-components'
import React, { useContext } from 'react'
import { ExtensionPopupContext } from '../../../../../context/ExtensionPopupContext'
import { ExtensionConfigurationContext } from '../../../../../context/ExtensionConfigurationContext'
import { DATA_SOURCE, REMEDIATION_LABELS } from '../../../../../utils/Constants'
import './RemediationDetails.css'
import { getNewSelectedVersionUrl } from '../../../../../utils/Helpers'
import { PackageURL } from 'packageurl-js'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

function IqRemediationDetails() {
    const popupContext = useContext(ExtensionPopupContext)
    const versionChanges = popupContext.iq?.remediationDetails?.versionChanges
    

    return (
        <React.Fragment>
            <NxList emptyMessage="No newer version is available based on this application's policy.">
                {versionChanges?.map((change, id) => {
                    const version = change.data?.component?.componentIdentifier?.coordinates?.version as string
                    const currentUrl = new URL(popupContext.currentTab?.url as string)
                    const versionUrl = getNewSelectedVersionUrl(
                        currentUrl,
                        popupContext.currentPurl as PackageURL,
                        version
                    )
                    const clickable: boolean = versionUrl.toString() !== currentUrl.toString()

                    if (change !== undefined) {
                        if (clickable) {
                            return (
                                <NxList.LinkItem
                                    href='#'
                                    key={`${change}-${id}`}
                                    {...(clickable && {
                                        onClick: () => {
                                            _browser.tabs.update({
                                                url: versionUrl.toString(),
                                            })
                                        },
                                    })}>
                                    <NxList.Text>
                                        <small>{REMEDIATION_LABELS[change.type as string]}</small>
                                    </NxList.Text>
                                    <NxList.Subtext>
                                        <strong>
                                            {change.data?.component?.componentIdentifier?.coordinates
                                                ? version
                                                : 'UNKNOWN'}
                                        </strong>
                                    </NxList.Subtext>
                                </NxList.LinkItem>
                            )
                        } else {
                            return (
                                <NxList.Item key={`${change}-${id}`}>
                                    <NxList.Text>
                                        <small>{REMEDIATION_LABELS[change.type as string]}</small>
                                    </NxList.Text>
                                    <NxList.Subtext>
                                        <strong>
                                            {change.data?.component?.componentIdentifier?.coordinates
                                                ? version
                                                : 'UNKNOWN'}
                                        </strong>
                                    </NxList.Subtext>
                                </NxList.Item>
                            )
                        }
                    }
                })}
            </NxList>
        </React.Fragment>
    )
}

export default function RemediationDetails() {
    const extensionContext = useContext(ExtensionConfigurationContext)

    return <div>{extensionContext.dataSource === DATA_SOURCE.NEXUSIQ && <IqRemediationDetails />}</div>
}
