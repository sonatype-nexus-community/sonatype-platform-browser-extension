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
import { NxButton, NxFontAwesomeIcon, NxLoadingSpinner } from "@sonatype/react-shared-components"
import React, { useContext, useEffect, useState } from "react"
import { ThisBrowser } from "../../common/constants"
import { ExtensionConfigurationContext } from "../../common/context/extension-configuration"
import { ExtensionTabDataContext } from "../../common/context/extension-tab-data"
import { ComponentData, TabDataStatus } from "../../common/data/types"
import { logger, LogLevel } from "../../common/logger"
import Component from "./component"
import ComponentSelector from "./component-selector"

export default function Components() {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const extensionTabDataContext = useContext(ExtensionTabDataContext)
    
    const [componentPurls, setComponentPurls] = useState<Array<string>>([])
    const [currentComponent, setCurrentComponent] = useState<ComponentData | undefined>(undefined)
    const [currentPurl, setCurrentPurl] = useState<string>('')

    useEffect(() => {
        if (extensionTabDataContext.components != undefined) {
            const newPurls = Object.keys(extensionTabDataContext.components)
            if (extensionTabDataContext.status === TabDataStatus.COMPLETE) {
                if (JSON.stringify(componentPurls.sort()) !== JSON.stringify(newPurls.sort())) {
                    logger.logReact("Setting Component Purls", LogLevel.DEBUG, newPurls)
                    setComponentPurls(newPurls)
                    setCurrentPurl(newPurls[0])
                    setCurrentComponent(extensionTabDataContext.components[newPurls[0]])
                }
            }
        }
    }, [extensionTabDataContext.status, extensionTabDataContext.components, componentPurls])

    useEffect(() => {
        if (currentPurl != '' && extensionTabDataContext.components[currentPurl]) {
            logger.logReact("Current ComponentData updated", LogLevel.DEBUG, extensionTabDataContext.components[currentPurl])
            setCurrentComponent(extensionTabDataContext.components[currentPurl])
        }
    }, [currentPurl, extensionTabDataContext.components])

    function setComponentByPurl(purl: string) {
        logger.logReact("Request to change displayed Component", LogLevel.DEBUG, purl)
        try {
            setCurrentPurl(purl)
            setCurrentComponent(extensionTabDataContext.components[purl])
        } catch (err) {
            logger.logReact("Selected PURL is not indexed for this Tab", LogLevel.ERROR, purl, err)
        }
    }

    function renderBasedOnTabStatus() {
        switch (extensionTabDataContext.status) {
            case TabDataStatus.EVALUATING:
                return (
                    <NxLoadingSpinner />
                )
            
            case TabDataStatus.NO_COMPONENTS:
                return (
                    <section className="nx-tile" aria-label="No Components Identified">
                        <header className="nx-tile-header">
                            <hgroup className="nx-tile-header__headings">
                            <div className="nx-tile-header__title">
                                <h2 className="nx-h2">No Components Identified</h2>
                            </div>
                            <h3 className="nx-tile-header__subtitle">
                                You might not be on the right page yet!
                            </h3>
                            </hgroup>
                        </header>
                        <div className="nx-tile-content">
                            ADD SOME INSTRUCTIONS AND POINTERS HERE.
                        </div>
                    </section>
                )
        
            case TabDataStatus.ERROR:
                return (
                    <>There was an error :-(</>
                )
            
            case TabDataStatus.COMPLETE:
                return (
                    <>
                        {componentPurls.length > 1 && (
                            <ComponentSelector componentPurls={componentPurls} selectedComponent={currentPurl} setPurl={setComponentByPurl} />
                        )}
                        <Component component={currentComponent!} />
                    </>
                )
        
            case TabDataStatus.NOT_SUPPORTED:
            default:
                return (
                    <>The current site is not supported.</>
                )

        }
    }

    return (
        <>
            <header className="nx-global-header">
                <span role="status" className="nx-status-indicator nx-status-indicator--positive">Connected to Sonatype IQ {extensionConfigContext.iqVersion}</span>
                <div className="nx-global-header__actions">
                    <NxButton title="Access Sonatype IQ" variant="icon-only" onClick={() => {
                        ThisBrowser.tabs.create({
                            url: extensionConfigContext.host
                        })
                    }}>
                        <img
                            id='iq-server-button-icon'
                            src='/images/sonatype-platform-icon-32x32.png'
                            height={'20'}
                            width={'20'}></img>
                    </NxButton>
                    <NxButton title="Configure Extension" variant="icon-only" onClick={() => {
                        ThisBrowser.tabs.create({
                            url: 'options.html'
                        })
                    }}><NxFontAwesomeIcon icon={faCog} /></NxButton>
                </div>
            </header>
            {renderBasedOnTabStatus()}
        </>
    )

    
}