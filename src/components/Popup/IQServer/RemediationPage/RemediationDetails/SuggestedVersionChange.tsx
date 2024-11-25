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

import { ApiSuggestedVersionChangeOptionDTO } from "@sonatype/nexus-iq-api-client"
import { PackageURL } from "packageurl-js"
import React, { useContext } from "react"
import { ExtensionPopupContext } from "../../../../../context/ExtensionPopupContext"
import { getNewSelectedVersionUrl } from "../../../../../utils/Helpers"
import { NxList } from "@sonatype/react-shared-components"
import { REMEDIATION_LABELS } from "../../../../../utils/Constants"

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

export interface SuggestedVersionChangeProps {
    suggestedVersion: ApiSuggestedVersionChangeOptionDTO
}

export default function SuggestedVersionChange(props: SuggestedVersionChangeProps) {

    const popupContext = useContext(ExtensionPopupContext)
    const version = props.suggestedVersion.data?.component?.componentIdentifier?.coordinates?.version as string
    const currentUrl = new URL(popupContext.currentTab?.url as string)
    const versionUrl = getNewSelectedVersionUrl(
        currentUrl,
        popupContext.currentPurl as PackageURL,
        version
    )
    const clickable: boolean = versionUrl.toString() !== currentUrl.toString()

    return (
        <React.Fragment>
            <NxList>
                {clickable === true && (
                    <NxList.LinkItem
                        href='#'
                        key="suggested-change"
                        {...(clickable && {
                            onClick: () => {
                                _browser.tabs.update({
                                    url: versionUrl.toString(),
                                })
                            },
                        })}>
                        {props.suggestedVersion.isGolden == true && (
                            <span>
                                <img
                                    src='/images/golden-star.svg'
                                    alt={_browser.i18n.getMessage('GOLDEN_VERSION')}
                                    title={_browser.i18n.getMessage('GOLDEN_VERSION')}
                                />
                            </span>
                        )}
                        <NxList.Text>
                            <small>{REMEDIATION_LABELS[props.suggestedVersion.type as string]}</small>
                        </NxList.Text>
                        <NxList.Subtext>
                            <strong>
                                {props.suggestedVersion.data?.component?.componentIdentifier?.coordinates
                                    ? version
                                    : 'UNKNOWN'}
                            </strong>
                        </NxList.Subtext>
                    </NxList.LinkItem>
                )}
                {clickable !== true && (
                    <NxList.Item key="suggested-change">
                        {props.suggestedVersion.isGolden == true && (
                            <span>
                                <img
                                    src='/images/golden-star.svg'
                                    alt={_browser.i18n.getMessage('GOLDEN_VERSION')}
                                    title={_browser.i18n.getMessage('GOLDEN_VERSION')}
                                />
                            </span>
                        )}
                        <NxList.Text>
                            <small>{REMEDIATION_LABELS[props.suggestedVersion.type as string]}</small>
                        </NxList.Text>
                        <NxList.Subtext>
                            <strong>
                                {props.suggestedVersion.data?.component?.componentIdentifier?.coordinates
                                    ? version
                                    : 'UNKNOWN'}
                            </strong>
                        </NxList.Subtext>
                    </NxList.Item>
                )}
            </NxList>
        </React.Fragment>
    )
}