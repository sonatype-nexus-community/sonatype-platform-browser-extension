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
import React from 'react'
import { createRoot } from 'react-dom/client'
import { ThisBrowser } from '../common/constants'
import { ExtensionConfigurationContext } from '../common/context/extension-configuration'
import { logger, LogLevel } from '../common/logger'
import { ActiveInfo, ChangeInfo, TabType } from '../common/types'
import { loadExtensionDataAndSettings } from '../service/helpers'

const domNode = document.getElementById('root')
domNode?.setAttribute('class', '')
const root = createRoot(domNode!)

loadExtensionDataAndSettings().then(({ settings, tabsData, vulnerabilityData }) => {
    logger.logReact("Read Data & Settings from Local Storage", LogLevel.DEBUG)
    // const extensionConfigurationContext = new ExtensionConfigurationStateReact(settings)
   
    // Subscribe to tab changes
    ThisBrowser.tabs.query({ active: true, currentWindow: true }).then((tabs: TabType[]) => {
        logger.logReact('Setting initial active Tab', LogLevel.DEBUG, tabs)
        chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${tabs.pop()?.id}` })
    })
    ThisBrowser.tabs.onActivated.addListener(async (activeInfo: ActiveInfo) => {
        logger.logReact("SidePanel Tab onActivated", LogLevel.DEBUG, activeInfo)
        chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${activeInfo.tabId}` })
    })
    ThisBrowser.tabs.onUpdated.addListener(async (tabId: number, changeInfo: ChangeInfo, tab: TabType) => {
        logger.logReact(`SidePanel Tab handleOnUpdated: `, LogLevel.DEBUG, tabId, changeInfo, tab)

        if (changeInfo.status == "complete" && tab.active && tab.url !== undefined) {
            await chrome.sidePanel.setOptions({ path: `side-panel.html?tabId=${tab.id}` })
        }
    })

    root.render(
        <React.StrictMode>
            <ExtensionConfigurationContext.Provider value={settings}>
                This is our Popup!
            </ExtensionConfigurationContext.Provider>
        </React.StrictMode>
    )
}).catch((err) => { 
    root.render(<>Error: {err}</>)
})

// function SidePanelApp(props: Readonly<{ tabsData: ExtensionTabsData, vulnerabilityData: ExtensionVulnerabilitiesData }>) {
//     const [extensionTabsData, setExtensionTabsData] = useState<ExtensionTabsData>(DEFAULT_TABS_DATA)
//     const [extensionTabData, setExtensionTabData] = useState<ExtensionTabData>({} as ExtensionTabData)
//     const [extensionVulnerabilityData, setExtensionVulnerabilityData] = useState<ExtensionVulnerabilitiesData>({} as ExtensionVulnerabilitiesData)

//     const [mode, setMode] = useState<SIDE_PANEL_MODE>()
//     const [tabId, setTabId] = useState<number | undefined>(undefined)

//     const pageParams = new URLSearchParams(window.location.search)
//     useEffect(() => {
//         logger.logReact("Page Params changed", LogLevel.DEBUG, pageParams)
//         if (pageParams.has('tabId')) {
//             const newTabId = Number(pageParams.get('tabId') || 0)
//             if (newTabId > 0) {
//                 if (mode != SIDE_PANEL_MODE.COMPONENTS) setMode(SIDE_PANEL_MODE.COMPONENTS)
//                 if (tabId != newTabId) setTabId(newTabId)
//             }
//         }
//         if (pageParams.has('vulnerabilityReference')) {
//             const vulnerabilityReference = pageParams.get('vulnerabilityReference')
//             if (vulnerabilityReference !== null) {
//                 setMode(SIDE_PANEL_MODE.VULNERABILITY)
//             }
//         }
//     }, [pageParams])

//     useEffect(() => {
//         setExtensionTabsData(props.tabsData)
//     }, [props.tabsData])

//     useEffect(() => {
//         setExtensionVulnerabilityData(props.vulnerabilityData)
//     }, [props.vulnerabilityData])

//     useEffect(() => {
//         if (tabId !== undefined && Object.prototype.hasOwnProperty.call(extensionTabsData.tabs, tabId)) {
//             setExtensionTabData(extensionTabsData.tabs[tabId])
//         }
//     }, [extensionTabsData, tabId])

//     ThisBrowser.runtime.onMessage.addListener((
//         request: MessageRequestExtensionTabDataUpdated | MessageRequestExtensionVulnerabilityDataUpdated,
//         sender: MessageSender,
//         sendResponse: MessageResponseFunction
//     ): boolean => {
//         switch (request.messageType) {
//             case MessageRequestType.EXTENSION_TAB_DATA_UPDATED:
//                 setExtensionTabsData(request.data)
//                 sendResponse({
//                     status: MessageResponseStatus.SUCCESS
//                 })
//                 break;
//             case MessageRequestType.EXTENSION_VULNERABILITY_DATA_UPDATED:
//                 setExtensionVulnerabilityData(request.data)
//                 sendResponse({
//                     status: MessageResponseStatus.SUCCESS
//                 })
//                 break;
//         }
    
//         return true
//     })

//     return (
//         <ExtensionTabDataContext.Provider value={extensionTabData}>
//             <ExtensionVulnerabilityDataContext value={extensionVulnerabilityData}>
//                 <MainSidePanel />
//             </ExtensionVulnerabilityDataContext>
//         </ExtensionTabDataContext.Provider>
//     )
// }