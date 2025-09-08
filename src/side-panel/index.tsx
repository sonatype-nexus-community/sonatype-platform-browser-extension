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
import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ThisBrowser } from '../common/constants'
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
import { lastRuntimeError } from '../common/message/helpers'
import '../public/css/side-panel.css'

const domNode = document.getElementById('root')
domNode?.setAttribute('class', '')
const root = createRoot(domNode!)

// Subscribe to tab changes
ThisBrowser.tabs.query({ active: true, currentWindow: true }).then((tabs: TabType[]) => {
    const lastError = lastRuntimeError()
    if (lastError) {
        logger.logReact('Runtime Error in Side Panel#tabs-query', LogLevel.WARN, lastError)
    }
    
    logger.logReact('Setting initial active Tab', LogLevel.DEBUG, tabs)
    chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${tabs.pop()?.id}#1` }).then(() => {
        const lastError = lastRuntimeError()
        if (lastError) {
            logger.logReact('Runtime Error in Side Panel#tabs-query-sidepanel-setOptions', LogLevel.WARN, lastError)
        }
    })
})
ThisBrowser.tabs.onActivated.addListener(async (activeInfo: ActiveInfo) => {
    logger.logReact('SidePanel Tab onActivated', LogLevel.DEBUG, activeInfo)
    ThisBrowser.windows.getCurrent().then((window: WindowType) => {
        const lastError = lastRuntimeError()
        if (lastError) {
            logger.logReact('Runtime Error in Side Panel#tabs-onActitvated', LogLevel.WARN, lastError)
        }
        if (window && window.id === activeInfo.windowId) {
            chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${activeInfo.tabId}#2` }).then(() => {
                const lastError = lastRuntimeError()
                if (lastError) {
                    logger.logReact('Runtime Error in Side Panel#tabs-onActitvated-sidepanel-setOptions', LogLevel.WARN, lastError)
                }
            })
        }
    })
})
ThisBrowser.tabs.onUpdated.addListener((tabId: number, changeInfo: ChangeInfo, tab: TabType) => {
    logger.logReact(`SidePanel Tab handleOnUpdated: `, LogLevel.DEBUG, tabId, changeInfo, tab)
    ThisBrowser.windows.getCurrent().then((window: WindowType) => {
        const lastError = lastRuntimeError()
        if (lastError) {
            logger.logReact('Runtime Error in Side Panel#tabs-onUpdated', LogLevel.WARN, lastError)
        }

        if (window && window.id === tab.windowId) {
            if (changeInfo.status == 'complete' && tab.active && tab.url !== undefined) {
                chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${tab.id}#3` }).then(() => {
                    const lastError = lastRuntimeError()
                    if (lastError) {
                        logger.logReact('Runtime Error in Side Panel#tabs-onUpdated-sidepanel-setOptions', LogLevel.WARN, lastError)
                    }
                })
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
    const hasClosedRef = useRef(false)

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
        if (tabId !== undefined && Object.hasOwn(extensionTabsData.tabs, tabId)) {
            setExtensionTabData(extensionTabsData.tabs[tabId])
        } else if (tabId !== undefined && !Object.hasOwn(extensionTabsData.tabs, tabId) && !hasClosedRef.current) {
            logger.logReact("Auto Closing Side Panel", LogLevel.INFO, tabId, Object.hasOwn(extensionTabsData.tabs, tabId), extensionTabsData.tabs)
            hasClosedRef.current = true
            
            // Small delay to ensure state updates are complete
            setTimeout(() => {
                window.close()
            }, 100)
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
