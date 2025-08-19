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
import { faArrowLeft, faArrowRight, faBell, faBookOpenReader, faCog, faCube, faPlay, faPlug, faQuestionCircle, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { NxButton, NxFontAwesomeIcon, NxGlobalSidebarFooter, NxGlobalSidebarNavigation, NxGlobalSidebarNavigationLink, NxStatefulGlobalSidebar } from '@sonatype/react-shared-components'
import React, { useContext } from 'react'
import { ExtensionConfigurationHelper } from '../../common/configuration/helper'
import { ThisBrowser } from '../../common/constants'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'
import AdvancedOptionsSubPage from './advanced-options-sub-page'
import HelpSubPage from './help-sub-page'
import IQOptionsSubPage from './iq-options-sub-page'
import NexusRepositoryOptionsSubPage from './nexus-repository-sub-page'
import '../../public/css/options.css'
import ReleaseNotesSubPage from './release-notes-sub-page'

enum OPTIONS_PAGE_MODE {
    ADVANCED,
    HELP,
    RELEASE_NOTES,
    SONATYPE_IQ,
    SONATYPE_REPO
}

export default function OptionsPage() {
    const extensionDefnition = ThisBrowser.runtime.getManifest()
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const search = window.location.search
    const fragment = window.location.hash
    const params = new URLSearchParams(search)
    const install = params.has('install')
    const invalidCredentials = fragment === '#invalid-credentials'

    const configurationComplete = ExtensionConfigurationHelper.isConfigurationComplete(extensionConfigContext)
    const logoUrl = ExtensionConfigurationHelper.getLogo(extensionConfigContext)

    let pageMode: OPTIONS_PAGE_MODE = OPTIONS_PAGE_MODE.SONATYPE_IQ

    if (params.has('general')) {
        pageMode = OPTIONS_PAGE_MODE.ADVANCED
    } else if (params.has('help')) {
        pageMode = OPTIONS_PAGE_MODE.HELP
    } else if (params.has('nexus-repository')) {
        pageMode = OPTIONS_PAGE_MODE.SONATYPE_REPO
    } else if (params.has('release-notes')) {
        pageMode = OPTIONS_PAGE_MODE.RELEASE_NOTES
    }

    function renderSubPage() {
        switch (pageMode) {
            case OPTIONS_PAGE_MODE.ADVANCED:
                return (<AdvancedOptionsSubPage />)
            case OPTIONS_PAGE_MODE.HELP:
                return (<HelpSubPage />)
            case OPTIONS_PAGE_MODE.RELEASE_NOTES:
                return (<ReleaseNotesSubPage />)
            case OPTIONS_PAGE_MODE.SONATYPE_REPO:
                return (<NexusRepositoryOptionsSubPage />)
            case OPTIONS_PAGE_MODE.SONATYPE_IQ:
            default:
                return (<IQOptionsSubPage install={install} invalidCredentials={invalidCredentials} />)
        }
    }

    return (
        <React.StrictMode>
            <header className="nx-global-header">
                {configurationComplete && extensionConfigContext.iqAuthenticated && (
                    <>
                        <span role="status" className="nx-status-indicator nx-status-indicator--positive">Connected to Sonatype IQ {extensionConfigContext.iqVersion}</span>
                    </>
                )}
                {!configurationComplete && (
                    <>
                        <span role="status" className="nx-status-indicator nx-status-indicator--negative">Not configured</span>
                    </>
                )}
                <div className="nx-global-header__actions">
                    <NxButton title="Help" variant="icon-only"><NxFontAwesomeIcon icon={faQuestionCircle} /></NxButton>
                    <NxButton title="Notifications" variant="icon-only"><NxFontAwesomeIcon icon={faBell} /></NxButton>
                    <NxButton title="Settings" variant="icon-only"><NxFontAwesomeIcon icon={faCog} /></NxButton>
                    <NxButton title="User" variant="icon-only"><NxFontAwesomeIcon icon={faUserCircle} /></NxButton>
                </div>
            </header>
            <NxStatefulGlobalSidebar
                isDefaultOpen={true}
                toggleCloseIcon={faArrowRight}
                toggleOpenIcon={faArrowLeft}
                logoImg={logoUrl}
                logoAltText={ThisBrowser.i18n.getMessage('EXTENSION_NAME')}
                logoLink='#'
                className={'options-sidebar'}>
                <NxGlobalSidebarNavigation>
                    <NxGlobalSidebarNavigationLink
                        icon={faPlay}
                        text={ThisBrowser.i18n.getMessage('SIDEBAR_LINK_GETTING_STARTED')}
                        href='options.html?install'
                    />
                    <NxGlobalSidebarNavigationLink
                        icon={faPlug}
                        text={ThisBrowser.i18n.getMessage('OPTIONS_PAGE_TAB_SONATYPE_IQ')}
                        href='options.html'
                    />
                    <NxGlobalSidebarNavigationLink
                        icon={faCube}
                        text={ThisBrowser.i18n.getMessage('OPTIONS_PAGE_TAB_SONATYPE_NEXUS_REPOSITORY')}
                        href='options.html?nexus-repository'
                    />
                    <NxGlobalSidebarNavigationLink
                        icon={faCog}
                        text={ThisBrowser.i18n.getMessage('OPTIONS_PAGE_TAB_GENERAL_CONFIGURATION')}
                        href='options.html?general'
                    />
                    <NxGlobalSidebarNavigationLink
                        icon={faBookOpenReader}
                        text={ThisBrowser.i18n.getMessage('SIDEBAR_RELEASE_NOTES')}
                        href='options.html?release-notes'
                    />
                    <NxGlobalSidebarNavigationLink
                        icon={faQuestionCircle}
                        text={ThisBrowser.i18n.getMessage('SIDEBAR_LINK_HELP')}
                        href='options.html?help'
                    />
                </NxGlobalSidebarNavigation>
                <NxGlobalSidebarFooter
                    supportText={ThisBrowser.i18n.getMessage('SIDEBAR_FOOTER_LINK_REQUEST_SUPPORT')}
                    supportLink={extensionDefnition.homepage_url}
                    releaseText={ThisBrowser.i18n.getMessage('RELEASE_VERSION', extensionDefnition.version)}
                    showCreatedBy={true}
                />
            </NxStatefulGlobalSidebar>
            {renderSubPage()}
        </React.StrictMode>
    )
}