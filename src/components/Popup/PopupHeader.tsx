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

import { faCog } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import Tooltip from '@mui/material/Tooltip'
import { NxPageHeader, NxButton, NxFontAwesomeIcon } from "@sonatype/react-shared-components"
import React, { useContext } from "react"
import { ExtensionConfigurationContext } from "../../context/ExtensionConfigurationContext"

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser
const extension = _browser.runtime.getManifest()

export default function PopupHeader() {

    const extensionConfigContext = useContext(ExtensionConfigurationContext)

    return (
        <NxPageHeader
            // style={{
            //     width: '800px !important',
            // }}
            productInfo={{ name: extension.name.replace('Sonatype ', ''), version: extension.version }}>
            <Tooltip title={`${_browser.i18n.getMessage('SONATYPE_IQ_SERVER')}: ${extensionConfigContext.getExtensionConfig().host}`}>
                <span>
                    <NxButton
                        id='iq-server-button'
                        title={_browser.i18n.getMessage('SONATYPE_IQ_SERVER')}
                        variant='icon-only'
                        onClick={() => {
                            _browser.tabs.update({
                                url: extensionConfigContext.getExtensionConfig().host,
                            })
                            window.close()
                        }}>
                        <img
                            id='iq-server-button-icon'
                            src='/images/sonatype-platform-icon-32x32.png'
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
                            icon={faCog as IconDefinition}
                            // icon={{ IconName: faGear }}
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
    )
}