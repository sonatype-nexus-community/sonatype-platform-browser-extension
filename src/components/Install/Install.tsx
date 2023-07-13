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
import { NxH2, NxPageTitle, NxTile } from '@sonatype/react-shared-components'
import React, { useState } from 'react'
import IQServerOptionsPage from '../Options/IQServer/IQServerOptionsPage'
import { DEFAULT_EXTENSION_SETTINGS, ExtensionConfiguration } from '../../types/ExtensionConfiguration'
import { ExtensionConfigurationContext } from '../../context/ExtensionConfigurationContext'
import { MESSAGE_RESPONSE_STATUS } from '../../types/Message'
import { updateExtensionConfiguration } from '../../messages/SettingsMessages'
import { logger, LogLevel } from '../../logger/Logger'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

export default function Install() {
    const [extensionConfig, setExtensionConfig] = useState<ExtensionConfiguration>(DEFAULT_EXTENSION_SETTINGS)

    function handleNewExtensionConfig(settings: ExtensionConfiguration) {
        logger.logMessage(`Install handleNewExtensionConfig`, LogLevel.DEBUG)
        updateExtensionConfiguration(settings).then((response) => {
            logger.logMessage(`Install handleNewExtensionConfig response: ${response}`, LogLevel.DEBUG)
            if (response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
                setExtensionConfig(response.data as ExtensionConfiguration)
            }
        })
    }

    return (
        <ExtensionConfigurationContext.Provider value={extensionConfig}>
            <React.Fragment>
                <h1>
                    <NxPageTitle>{_browser.i18n.getMessage('OPTIONS_INSTALL_MODE_PAGE_TITLE')}</NxPageTitle>
                </h1>
                <NxTile>
                    <NxTile.Header>
                        <NxH2>{_browser.i18n.getMessage('OPTIONS_INSTALL_MODE_SUB_HEADING_GETTING_STARTED')}</NxH2>
                    </NxTile.Header>
                    <NxTile.Content>
                        <p className='nx-p nx-page-content--full-width'>
                            {_browser.i18n.getMessage('OPTIONS_INSTALL_MODE_P_GETTING_STARTED')}
                        </p>
                        <IQServerOptionsPage setExtensionConfig={handleNewExtensionConfig} />
                    </NxTile.Content>
                </NxTile>
            </React.Fragment>
        </ExtensionConfigurationContext.Provider>
    )
}
