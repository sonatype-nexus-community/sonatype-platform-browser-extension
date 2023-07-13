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
    NxTab,
    NxTabList,
    NxTabPanel,
    NxTabs,
    NxFontAwesomeIcon,
    NxPageHeader,
    NxTile,
    NxButton,
} from '@sonatype/react-shared-components'
import React, { useContext, useState } from 'react'
import { ExtensionPopupContext } from '../../context/ExtensionPopupContext'
import { ExtensionConfigurationContext } from '../../context/ExtensionConfigurationContext'
import { DATA_SOURCE } from '../../utils/Constants'
import ComponentInfoPage from './IQServer/ComponentInfoPage/ComponentInfoPage'
import PolicyPage from './IQServer/PolicyPage/PolicyPage'
import './Popup.css'
import RemediationPage from './IQServer/RemediationPage/RemediationPage'
import LicensePage from './IQServer/LicensingPage/LicensingPage'
import SecurityPage from './IQServer/SecurityPage/SecurityPage'
import { Puff } from '@agney/react-loading'
import { faGear, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { Tooltip } from '@material-ui/core'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any

function IqPopup() {
    const popupContext = useContext(ExtensionPopupContext)
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const [activeTabId, setActiveTabId] = useState(0)

    const versionsCount =
        popupContext.iq?.allVersions && popupContext.iq?.allVersions.length > 0
            ? popupContext.iq?.allVersions.length
            : 0

    const effectiveLicenses =
        popupContext.iq &&
        popupContext.iq.componentDetails !== undefined &&
        popupContext.iq.componentDetails.licenseData !== undefined &&
        popupContext.iq.componentDetails.licenseData.effectiveLicenses !== undefined
            ? popupContext.iq.componentDetails.licenseData.effectiveLicenses
            : []

    const policyViolations =
        popupContext.iq &&
        popupContext.iq.componentDetails &&
        popupContext.iq.componentDetails.policyData &&
        popupContext.iq.componentDetails.policyData.policyViolations
            ? popupContext.iq.componentDetails.policyData.policyViolations
            : []

    const securityIssues =
        popupContext.iq &&
        popupContext.iq.componentDetails &&
        popupContext.iq.componentDetails.securityData &&
        popupContext.iq.componentDetails.securityData.securityIssues
            ? popupContext.iq.componentDetails.securityData.securityIssues
            : []

    if (popupContext !== undefined && popupContext.iq?.componentDetails !== undefined) {
        return (
            <React.Fragment>
                <NxPageHeader
                    style={{
                        width: '800px !important',
                    }}
                    productInfo={{ name: 'Platform Extension', version: '2.0.0' }}>
                    <Tooltip title={`Sonatype IQ Server: ${extensionConfigContext.host}`}>
                        <span className='nx-pull-right'>
                            <NxButton
                                id='iq-server-button'
                                title={`Sonatype IQ Server: ${extensionConfigContext.host}`}
                                variant='icon-only'
                                onClick={() => {
                                    chrome.tabs.update({
                                        url: extensionConfigContext.host,
                                    })
                                    window.close()
                                }}>
                                <img id='iq-server-button-icon' src='/images/sonatype-lifecycle-icon-32x32.png' height={'20'} width={'20'}></img>
                            </NxButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={`Extension Options`}>
                        <span className='nx-pull-right'>
                            <NxButton id='options-button' variant='icon-only'
                            title={`Extension Options`}>
                                <NxFontAwesomeIcon
                                    icon={faGear as IconDefinition}
                                    onClick={() => {
                                        chrome.tabs.update({

                                            url: 'options.html',
                                        })
                                        window.close()
                                    }}
                                />
                            </NxButton>
                        </span>

                    </Tooltip>
                </NxPageHeader>

                <div className='nx-page-content'>
                    <main
                        className='nx-page-main'
                        style={{
                            padding: '0px !important',
                            // margin: '0px !important',
                        }}>
                        <NxTile
                            className='nx-tile'
                            style={{
                                padding: '0px !important',
                                // margin: '0px !important',
                                // height: '600px !important',
                            }}>
                            <NxTabs
                                activeTab={activeTabId}
                                onTabSelect={(index) => setActiveTabId(index)}
                                style={{
                                    paddingTop: '0px !important',
                                    marginTop: '0px !important',
                                }}>
                                <NxTabList
                                    style={{
                                        padding: '0px !important',
                                        margin: '0px !important',
                                        height: '600px !important',
                                    }}>
                                    <NxTab>Info</NxTab>
                                    
                                    <Tooltip
                                            title={`Number of versions: ${versionsCount}`}>
                                                <div>
                                    <NxTab>
                                        {policyViolations.length > 0
                                            ? 'Remediation'
                                            : 'Versions'}
                                        
                                        {versionsCount > 0 ? (
                                            <span className={'nx-counter'}>{versionsCount}</span>    
                                        ):(
                                            <NxFontAwesomeIcon icon={faSpinner as IconDefinition} spin={true} />
                                        )}
                                        </NxTab>

                                        </div>
                                    </Tooltip>

                                    {policyViolations.length > 0 && (
                                        <Tooltip
                                            title={`Sonatype Lifecycle Appliation Evaluation Policy Violations: ${extensionConfigContext.iqApplicationPublidId}`}
                                            placement='bottom'>
                                            <div>
                                                <NxTab>
                                                    Policy
                                                    <span className={'nx-counter'}>{policyViolations.length}</span>
                                                </NxTab>
                                            </div>
                                        </Tooltip>
                                    )}
                                    {securityIssues.length > 0 && (
                                        <Tooltip
                                            title={`Security Issues cataloged against this component.`}
                                            placement='bottom'>
                                            <div>
                                                <NxTab>
                                                    Security
                                                    <span className={'nx-counter'}>{securityIssues.length}</span>
                                                </NxTab>
                                            </div>
                                        </Tooltip>
                                    )}
                                    {effectiveLicenses.length > 0 && <NxTab>Legal</NxTab>}
                                </NxTabList>
                                <NxTabPanel>
                                    <ComponentInfoPage />
                                </NxTabPanel>
                                <NxTabPanel>
                                    <RemediationPage />
                                </NxTabPanel>
                                {policyViolations.length > 0 && (
                                    <NxTabPanel>
                                        <PolicyPage />
                                    </NxTabPanel>
                                )}
                                {securityIssues.length > 0 && (
                                    <NxTabPanel>
                                        <SecurityPage />
                                    </NxTabPanel>
                                )}
                                {effectiveLicenses.length > 0 && (
                                    <NxTabPanel>
                                        <LicensePage />
                                    </NxTabPanel>
                                )}
                            </NxTabs>
                            {/* </div> */}
                        </NxTile>
                    </main>
                </div>
            </React.Fragment>
        )
    } else {
        return <Puff />
    }
}

export default function Popup() {
    const extensionContext = useContext(ExtensionConfigurationContext)

    return <>{extensionContext.dataSource === DATA_SOURCE.NEXUSIQ && <IqPopup />}</>
}