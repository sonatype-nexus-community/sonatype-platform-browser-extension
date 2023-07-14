/* eslint @typescript-eslint/no-var-requires: "off" */
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
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft, faArrowRight, faCog, faPlay, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import {
    NxGlobalSidebarFooter,
    NxGlobalSidebarNavigation,
    NxGlobalSidebarNavigationLink,
    NxPageMain,
    NxStatefulGlobalSidebar,
} from '@sonatype/react-shared-components'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { NexusOptionsContainer } from './NexusOptionsContainer'
import { logger, LogLevel } from './logger/Logger'
import { MESSAGE_REQUEST_TYPE } from './types/Message'
import { readExtensionConfiguration } from './messages/SettingsMessages'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser
const extension = _browser.runtime.getManifest()

const container = document.getElementById('ui')
const root = ReactDOM.createRoot(container)
const search = window.location.search
const params = new URLSearchParams(search)
const install = params.has('install')
const help = params.has('help')

root.render(
    <React.StrictMode>
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
                    icon={faQuestionCircle as IconDefinition}
                    text={_browser.i18n.getMessage('SIDEBAR_LINK_HELP')}
                    href='options.html?help'
                />
                <NxGlobalSidebarNavigationLink
                    icon={faCog as IconDefinition}
                    text={_browser.i18n.getMessage('SIDEBAR_LINK_OPTIONS')}
                    href='options.html'
                />
            </NxGlobalSidebarNavigation>
            <NxGlobalSidebarFooter
                supportText={_browser.i18n.getMessage('SIDEBAR_FOOTER_LINK_REQUEST_SUPPORT')}
                supportLink={extension.homepage_url}
                releaseText={_browser.i18n.getMessage('RELEASE_VERSION', extension.version)}
                showCreatedBy={true}
            />
        </NxStatefulGlobalSidebar>
        <NxPageMain>
            <NexusOptionsContainer install={install} help={help} />
        </NxPageMain>
    </React.StrictMode>
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
_browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    logger.logMessage('Options Request received', LogLevel.INFO, request)

    switch (request.type) {
        case MESSAGE_REQUEST_TYPE.GET_SETTINGS:
            readExtensionConfiguration().then((response) => {
                sendResponse(response)
            })
            break
    }
})
