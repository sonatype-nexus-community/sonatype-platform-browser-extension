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
    NxStatefulGlobalSidebar,
    NxGlobalSidebarNavigation,
    NxGlobalSidebarNavigationLink,
    NxGlobalSidebarFooter,
    NxPageMain,
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
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowRight, faCog, faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import Help from '../Help/Help'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser
const extension = _browser.runtime.getManifest()

enum OPTIONS_PAGE_MODE {
    GENERAL,
    HELP,
    SONATYPE,
}

export default function Options() {
    const [activeTabId, setActiveTabId] = useState(0)
    const [extensionConfig, setExtensionConfig] = useState<ExtensionConfiguration>(DEFAULT_EXTENSION_SETTINGS)
    const search = window.location.search
    const params = new URLSearchParams(search)
    let pageMode: OPTIONS_PAGE_MODE = OPTIONS_PAGE_MODE.SONATYPE

    if (params.has('general')) {
        pageMode = OPTIONS_PAGE_MODE.GENERAL
    } else if (params.has('help')) {
        pageMode = OPTIONS_PAGE_MODE.HELP
    }

    const install = params.has('install')

    // function handleDataSourceChange(e) {
    //     const newExtensionConfig = extensionConfig
    //     newExtensionConfig.dataSource = e
    //     newExtensionConfig.host = undefined
    //     newExtensionConfig.iqApplicationInternalId = undefined
    //     newExtensionConfig.iqApplicationPublidId = undefined
    //     newExtensionConfig.token = undefined
    //     newExtensionConfig.user = undefined
    //     handleNewExtensionConfig(newExtensionConfig)
    // }

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
        <React.StrictMode>
            <ExtensionConfigurationContext.Provider value={extensionConfig}>
                <NxStatefulGlobalSidebar
                    isDefaultOpen={true}
                    toggleCloseIcon={faArrowRight as IconDefinition}
                    toggleOpenIcon={faArrowLeft as IconDefinition}
                    logoImg='images/sonatype-lifecycle-logo-nav-white.svg'
                    logoAltText={_browser.i18n.getMessage('EXTENSION_NAME')}
                    logoLink='#'>
                    <NxGlobalSidebarNavigation>
                        <NxGlobalSidebarNavigationLink
                            icon={faPlay as IconDefinition}
                            text={_browser.i18n.getMessage('SIDEBAR_LINK_GETTING_STARTED')}
                            href='options.html?install'
                        />
                        <NxGlobalSidebarNavigationLink
                            icon={faCog as IconDefinition}
                            text={_browser.i18n.getMessage('OPTIONS_PAGE_TAB_SONATYPE_CONFIGURATION')}
                            href='options.html'
                        />
                        <NxGlobalSidebarNavigationLink
                            icon={faCog as IconDefinition}
                            text={_browser.i18n.getMessage('OPTIONS_PAGE_TAB_GENERAL_CONFIGURATION')}
                            href='options.html?general'
                        />
                        <NxGlobalSidebarNavigationLink
                            icon={faQuestionCircle as IconDefinition}
                            text={_browser.i18n.getMessage('SIDEBAR_LINK_HELP')}
                            href='options.html?help'
                        />
                    </NxGlobalSidebarNavigation>
                    <NxGlobalSidebarFooter
                        supportText={_browser.i18n.getMessage('SIDEBAR_FOOTER_LINK_REQUEST_SUPPORT')}
                        supportLink={extension.homepage_url}
                        releaseText={_browser.i18n.getMessage('RELEASE_VERSION', extension.version)}
                        showCreatedBy={true}
                    />
                </NxStatefulGlobalSidebar>

                {pageMode === OPTIONS_PAGE_MODE.HELP && <Help />}
                {pageMode === OPTIONS_PAGE_MODE.GENERAL && (
                    <GeneralOptionsPage setExtensionConfig={handleNewExtensionConfig} />
                )}
                {pageMode === OPTIONS_PAGE_MODE.SONATYPE && (
                    <IQServerOptionsPage install={install} setExtensionConfig={handleNewExtensionConfig} />
                )}
            </ExtensionConfigurationContext.Provider>
        </React.StrictMode>
    )
}
