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
import { NxGlobalFooter2, NxPageMain } from '@sonatype/react-shared-components'
import React, { useEffect, useState } from 'react'
import { SIDE_PANEL_MODE, ThisBrowser } from '../../common/constants'
import { logger, LogLevel } from '../../common/logger'
import Components from './components'
import VulnerabilityPanel from './vulnerability'

export default function MainSidePanel() {
    const [mode, setMode] = useState<SIDE_PANEL_MODE>()
    const [tabId, setTabId] = useState<number | undefined>(undefined)
    const [vulnerabilityReference, setVulnerabilityReference] = useState<string | undefined>(undefined)
    const pageParams = new URLSearchParams(window.location.search)

    useEffect(() => {
        logger.logReact("Page Params changed", LogLevel.DEBUG, pageParams)
        if (pageParams.has('tabId')) {
            const newTabId = Number(pageParams.get('tabId') || 0)
            if (newTabId > 0) {
                if (mode != SIDE_PANEL_MODE.COMPONENTS) setMode(SIDE_PANEL_MODE.COMPONENTS)
                if (tabId != newTabId) setTabId(newTabId)
            }
        }
        if (pageParams.has('vulnerabilityReference')) {
            const vulnerabilityReference = pageParams.get('vulnerabilityReference')
            if (vulnerabilityReference !== null) {
                setMode(SIDE_PANEL_MODE.VULNERABILITY)
                setVulnerabilityReference(vulnerabilityReference)
            }
        }
    }, [pageParams])

    function renderBySidePanelMode() {
        switch (mode) {
            case SIDE_PANEL_MODE.COMPONENTS:
                return (
                    <Components />
                )
            case SIDE_PANEL_MODE.VULNERABILITY:
                return (
                    <VulnerabilityPanel vulnerabilityReference={vulnerabilityReference} />
                )
        }
    }

    return (
        <NxGlobalFooter2.Container style={{height: '100%'}}>
            <NxPageMain style={{padding: 0}}>
                {renderBySidePanelMode()}
            </NxPageMain>
            <NxGlobalFooter2>
                <span>{ThisBrowser.i18n.getMessage('RELEASE_VERSION', ThisBrowser.runtime.getManifest().version)}</span>
            </NxGlobalFooter2>
        </NxGlobalFooter2.Container>
    )
}