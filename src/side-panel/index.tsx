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
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { SIDE_PANEL_MODE, ThisBrowser } from '../common/constants'
import { ExtensionConfigurationContext } from '../common/context/extension-configuration'
import { ExtensionTabDataContext } from '../common/context/extension-tab-data'
import { ExtensionVulnerabilityDataContext } from '../common/context/extension-vulnerability-data'
import { ExtensionTabData, ExtensionTabsData, ExtensionVulnerabilitiesData } from '../common/data/types'
import { logger, LogLevel } from '../common/logger'
import { MessageRequestType } from '../common/message/constants'
import { MessageRequestExtensionDataUpdated } from '../common/message/types'
import { ActiveInfo, ChangeInfo, TabType, WindowType } from '../common/types'
import { loadExtensionDataAndSettings } from '../service/helpers'
import MainSidePanel from './components/main'

const domNode = document.getElementById('root')
domNode?.setAttribute('class', '')
const root = createRoot(domNode!)

// Subscribe to tab changes
ThisBrowser.tabs.query({ active: true, currentWindow: true }).then((tabs: TabType[]) => {
    logger.logReact('Setting initial active Tab', LogLevel.DEBUG, tabs)
    chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${tabs.pop()?.id}#1` })
})
ThisBrowser.tabs.onActivated.addListener(async (activeInfo: ActiveInfo) => {
    logger.logReact('SidePanel Tab onActivated', LogLevel.DEBUG, activeInfo)
    ThisBrowser.windows.getCurrent().then((window: WindowType) => {
        if (window && window.id === activeInfo.windowId) {
            chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${activeInfo.tabId}#2` })
        }
    })
})
ThisBrowser.tabs.onUpdated.addListener((tabId: number, changeInfo: ChangeInfo, tab: TabType) => {
    logger.logReact(`SidePanel Tab handleOnUpdated: `, LogLevel.DEBUG, tabId, changeInfo, tab)
    ThisBrowser.windows.getCurrent().then((window: WindowType) => {
        if (window && window.id === tab.windowId) {
            if (changeInfo.status == 'complete' && tab.active && tab.url !== undefined) {
                chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${tab.id}#3` })
            }
        }
    })
})

loadExtensionDataAndSettings()
    .then(({ settings, tabsData, vulnerabilityData }) => {
        logger.logReact('Read Data & Settings from Local Storage', LogLevel.DEBUG)
        root.render(
            <React.StrictMode>
                <ExtensionConfigurationContext.Provider value={settings}>
                    <MySidePanelApp
                        tabsData={tabsData}
                        vulnerabilityData={vulnerabilityData}
                    />
                </ExtensionConfigurationContext.Provider>
            </React.StrictMode>
        )
    })
    .catch((err) => {
        root.render(<>Error: {err}</>)
    })

// Re-render when Extension Data changes
ThisBrowser.runtime
    .connect({ name: 'SIDE-PANEL' })
    .onMessage.addListener((request: MessageRequestExtensionDataUpdated) => {
        if (request.messageType === MessageRequestType.EXTENSION_DATA_UPDATED) {
            logger.logReact('[SIDE-PANEL] Received new Extension Data', LogLevel.DEBUG, request)
            root.render(
                <React.StrictMode>
                    <ExtensionConfigurationContext.Provider value={request.extensionConfiguration}>
                        <MySidePanelApp
                            tabsData={request.tabsData}
                            vulnerabilityData={request.vulnerabilitiesData}
                        />
                    </ExtensionConfigurationContext.Provider>
                </React.StrictMode>
            )
        }
    })

function MySidePanelApp(
    props: Readonly<{ tabsData: ExtensionTabsData; vulnerabilityData: ExtensionVulnerabilitiesData }>
) {
    const [extensionTabsData, setExtensionTabsData] = useState<ExtensionTabsData>(props.tabsData)
    const [extensionTabData, setExtensionTabData] = useState<ExtensionTabData>({} as ExtensionTabData)
    const [extensionVulnerabilityData, setExtensionVulnerabilityData] = useState<ExtensionVulnerabilitiesData>(
        {} as ExtensionVulnerabilitiesData
    )
    const [tabId, setTabId] = useState<number | undefined>(undefined)

    const pageParams = new URLSearchParams(window.location.search)
    useEffect(() => {
        logger.logReact('Page Params changed', LogLevel.DEBUG, pageParams.keys())
        if (pageParams.has('tabId')) {
            const newTabId = Number(pageParams.get('tabId') || 0)
            if (newTabId > 0) {
                if (tabId != newTabId) setTabId(newTabId)
            }
        }
    }, [pageParams])

    useEffect(() => {
        setExtensionTabsData(props.tabsData)
    }, [props.tabsData])

    useEffect(() => {
        setExtensionVulnerabilityData(props.vulnerabilityData)
    }, [props.vulnerabilityData])

    useEffect(() => {
        if (tabId !== undefined && Object.prototype.hasOwnProperty.call(extensionTabsData.tabs, tabId)) {
            setExtensionTabData(extensionTabsData.tabs[tabId])
        }
    }, [extensionTabsData, tabId])

    return (
        <ExtensionTabDataContext.Provider value={extensionTabData}>
            <ExtensionVulnerabilityDataContext value={extensionVulnerabilityData}>
                <MainSidePanel />
            </ExtensionVulnerabilityDataContext>
        </ExtensionTabDataContext.Provider>
    )
}
