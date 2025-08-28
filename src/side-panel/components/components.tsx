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
import UnsupportedSite from "./unsupported-registry"
import NoComponentsIdentified from "./no-components-identified"
import TabError from "./tab-error"

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
                // Sort arrays using localeCompare for proper string comparison
                const sortedCurrentPurls = [...componentPurls].sort((a, b) => a.localeCompare(b));
                const sortedNewPurls = [...newPurls].sort((a, b) => a.localeCompare(b));
                
                // Compare arrays element by element instead of JSON stringify
                const arraysAreEqual = sortedCurrentPurls.length === sortedNewPurls.length &&
                    sortedCurrentPurls.every((purl, index) => purl === sortedNewPurls[index]);
                
                if (!arraysAreEqual) {
                    logger.logReact("Setting Component Purls", LogLevel.DEBUG, newPurls);
                    setComponentPurls(newPurls);
                    setCurrentPurl(newPurls[0]);
                    setCurrentComponent(extensionTabDataContext.components[newPurls[0]]);
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
                    <NoComponentsIdentified repoTypeId={extensionTabDataContext.repoTypeId} />
                )
        
            case TabDataStatus.ERROR:
                return (
                    <TabError />
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
                    <UnsupportedSite />
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
                            alt='Sonatype IQ Server Icon'
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