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
    NxCopyToClipboard,
    NxWarningAlert,
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
const _browser: any = chrome ? chrome : browser
const extension = _browser.runtime.getManifest()

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
                    productInfo={{ name: extension.name.replace('Sonatype ', ''), version: extension.version }}>
                    <Tooltip title={`Sonatype IQ Server: ${extensionConfigContext.host}`}>
                        <span>
                            <NxButton
                                id='iq-server-button'
                                title='IQ'
                                variant='icon-only'
                                onClick={() => {
                                    _browser.tabs.update({
                                        url: extensionConfigContext.host,
                                    })
                                    window.close()
                                }}>
                                <img
                                    id='iq-server-button-icon'
                                    src='/images/sonatype-lifecycle-icon-32x32.png'
                                    height={'20'}
                                    width={'20'}></img>
                            </NxButton>
                        </span>
                    </Tooltip>
                    <Tooltip title={_browser.i18n.getMessage('OPTIONS_PAGE_TITLE')}>
                        <span>
                            <NxButton
                                variant='icon-only'
                                title={_browser.i18n.getMessage('SIDEBAR_LINK_OPTIONS')}
                                id='options-button'>
                                <NxFontAwesomeIcon
                                    icon={faGear as IconDefinition}
                                    onClick={() => {
                                        _browser.tabs.update({
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
                        }}>
                        {popupContext.iq.componentDetails.matchState != 'unknown' && (
                            <NxTile
                                className='nx-tile'
                                style={{
                                    padding: '0px !important',
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
                                        <Tooltip
                                            title={_browser.i18n.getMessage('POPUP_TAB_INFO_TOOLTIP', [versionsCount])}>
                                            <span>
                                                <NxTab>{_browser.i18n.getMessage('POPUP_TAB_INFO')}</NxTab>
                                            </span>
                                        </Tooltip>

                                        <Tooltip
                                            title={_browser.i18n.getMessage('POPUP_TAB_REMEDIATION_TOOLTIP', [
                                                versionsCount,
                                            ])}>
                                            <span>
                                                <NxTab>
                                                    {policyViolations.length > 0
                                                        ? _browser.i18n.getMessage('POPUP_TAB_REMEDIATION')
                                                        : _browser.i18n.getMessage('POPUP_TAB_VERSIONS')}

                                                    {versionsCount > 0 ? (
                                                        <span className={'nx-counter'}>{versionsCount}</span>
                                                    ) : (
                                                        <NxFontAwesomeIcon
                                                            icon={faSpinner as IconDefinition}
                                                            spin={true}
                                                        />
                                                    )}
                                                </NxTab>
                                            </span>
                                        </Tooltip>

                                        {policyViolations.length > 0 && (
                                            <Tooltip
                                                title={_browser.i18n.getMessage('POPUP_TAB_POLICY_TOOLIP', [
                                                    extensionConfigContext.iqApplicationPublidId,
                                                ])}
                                                placement='bottom'>
                                                <span>
                                                    <NxTab>
                                                        {_browser.i18n.getMessage('POPUP_TAB_POLICY')}
                                                        <span className={'nx-counter'}>{policyViolations.length}</span>
                                                    </NxTab>
                                                </span>
                                            </Tooltip>
                                        )}
                                        {securityIssues.length > 0 && (
                                            <Tooltip title={_browser.i18n.getMessage('POPUP_TAB_SECURITY_TOOLTIP')}>
                                                <span>
                                                    <NxTab>
                                                        {_browser.i18n.getMessage('POPUP_TAB_SECURITY')}
                                                        <span className={'nx-counter'}>{securityIssues.length}</span>
                                                    </NxTab>
                                                </span>
                                            </Tooltip>
                                        )}
                                        {effectiveLicenses.length > 0 && (
                                            <Tooltip title={_browser.i18n.getMessage('POPUP_TAB_LEGAL_TOOLTIP')}>
                                                <span>
                                                    <NxTab>{_browser.i18n.getMessage('POPUP_TAB_LEGAL')}</NxTab>
                                                </span>
                                            </Tooltip>
                                        )}
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
                            </NxTile>
                        )}
                        {popupContext.iq.componentDetails.matchState == 'unknown' && (
                            <NxTile>
                                <div className='nx-grid-row'>
                                    <div className='nx-grid-col nx-grid-col--67'>
                                        <img width='340px' src='/images/Sherlock_Trunks_sticker@300ppi.png' />
                                    </div>

                                    <div className='nx-grid-col nx-grid-col--33 uknown-warn'>
                                        <NxWarningAlert>
                                            {_browser.i18n.getMessage('POPUP_COMPONENT_UNKNOWN_MESSAGE')}
                                        </NxWarningAlert>
                                    </div>
                                </div>
                                <div className='nx-grid-row'>
                                    <NxCopyToClipboard
                                        label='Package URL'
                                        inputProps={{
                                            rows: 1,
                                        }}
                                        content={popupContext.iq.componentDetails.component?.packageUrl as string}
                                        width={'100px'}
                                    />
                                </div>
                            </NxTile>
                        )}
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
