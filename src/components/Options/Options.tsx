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
    NxFieldset,
    NxPageTitle,
    NxRadio,
    NxTab,
    NxTabList,
    NxTabPanel,
    NxTabs,
    NxTile,
    NxButton,
    NxButtonBar,
} from '@sonatype/react-shared-components'
import React, { useEffect, useState } from 'react'
import { ExtensionConfigurationContext } from '../../context/ExtensionConfigurationContext'
import { DATA_SOURCE } from '../../utils/Constants'
import { MESSAGE_RESPONSE_STATUS } from '../../types/Message'
import GeneralOptionsPage from './General/GeneralOptionsPage'
import IQServerOptionsPage from './IQServer/IQServerOptionsPage'
import { DEFAULT_EXTENSION_SETTINGS, ExtensionConfiguration } from '../../types/ExtensionConfiguration'
import { readExtensionConfiguration, updateExtensionConfiguration } from '../../messages/SettingsMessages'
import { logger, LogLevel } from '../../logger/Logger'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

export default function Options() {
    const [activeTabId, setActiveTabId] = useState(0)
    const [extensionConfig, setExtensionConfig] = useState<ExtensionConfiguration>(DEFAULT_EXTENSION_SETTINGS)

    function handleDataSourceChange(e) {
        const newExtensionConfig = extensionConfig
        newExtensionConfig.dataSource = e
        newExtensionConfig.host = undefined
        newExtensionConfig.iqApplicationInternalId = undefined
        newExtensionConfig.iqApplicationPublidId = undefined
        newExtensionConfig.token = undefined
        newExtensionConfig.user = undefined
        handleNewExtensionConfig(newExtensionConfig)
    }

    function handleNewExtensionConfig(settings: ExtensionConfiguration) {
        logger.logMessage(`Options handleNewExtensionConfig`, LogLevel.DEBUG, settings)
        updateExtensionConfiguration(settings).then((response) => {
            logger.logMessage('Options Response', LogLevel.DEBUG, response)
            if (response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
                setExtensionConfig(response.data as ExtensionConfiguration)
            }
        })
    }

    function handleSaveClose() {
        window.close()
    }

    useEffect(() => {
        readExtensionConfiguration().then((response) => {
            if (response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
                if (response.data === undefined) {
                    setExtensionConfig(DEFAULT_EXTENSION_SETTINGS)
                } else {
                    setExtensionConfig(response.data as ExtensionConfiguration)
                }
            }
        })
    }, [])

    return (
        <ExtensionConfigurationContext.Provider value={extensionConfig}>
            <React.Fragment>
                <h1>
                    <NxPageTitle>{_browser.i18n.getMessage('OPTIONS_PAGE_TITLE')}</NxPageTitle>
                </h1>

                <NxTile>
                    <NxTile.Content>
                        <div className='nx-grid-row'>
                            <section className='nx-grid-col nx-grid-col--50'>
                                <NxFieldset
                                    label={`${_browser.i18n.getMessage('OPTIONS_CURRENT_CONNECTION')}: ${
                                        extensionConfig.dataSource
                                    }`}
                                    isRequired>
                                    <NxRadio
                                        defaultChecked={true}
                                        name='scanType'
                                        value={DATA_SOURCE.NEXUSIQ}
                                        onChange={handleDataSourceChange}
                                        isChecked={extensionConfig.dataSource === DATA_SOURCE.NEXUSIQ}
                                        radioId='scanType-IQ-Server'>
                                        {_browser.i18n.getMessage('SONATYPE_IQ_SERVER')}
                                    </NxRadio>
                                </NxFieldset>
                            </section>
                            <section className='nx-grid-col nx-grid-col--50'>
                                <NxButtonBar>
                                    <NxButton onClick={handleSaveClose}>
                                        <span>{_browser.i18n.getMessage('BUTTON_CLOSE')}</span>
                                    </NxButton>
                                </NxButtonBar>
                            </section>
                        </div>

                        <NxTabs activeTab={activeTabId} onTabSelect={setActiveTabId}>
                            <NxTabList>
                                <NxTab key={`DATA_SOURCE`}>
                                    {_browser.i18n.getMessage('OPTIONS_PAGE_TAB_SONATYPE_CONFIGURATION')}
                                </NxTab>
                                <NxTab key={`GENERAL`}>
                                    {_browser.i18n.getMessage('OPTIONS_PAGE_TAB_GENERAL_CONFIGURATION')}
                                </NxTab>
                            </NxTabList>
                            <NxTabPanel>
                                {extensionConfig.dataSource === DATA_SOURCE.NEXUSIQ && (
                                    <IQServerOptionsPage setExtensionConfig={handleNewExtensionConfig} />
                                )}
                            </NxTabPanel>
                            <NxTabPanel>
                                <GeneralOptionsPage setExtensionConfig={handleNewExtensionConfig} />
                            </NxTabPanel>
                        </NxTabs>
                    </NxTile.Content>
                </NxTile>
            </React.Fragment>
        </ExtensionConfigurationContext.Provider>
    )
}
