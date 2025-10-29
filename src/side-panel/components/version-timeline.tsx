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
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ApiComponentDTOV2 } from '@sonatype/nexus-iq-api-client'
import { compareVersions } from 'compare-versions'
import {
    getUniqueId,
    NxFontAwesomeIcon,
    NxLoadingSpinner,
    NxSmallThreatCounter,
    NxTile,
} from '@sonatype/react-shared-components'

import React, { useContext, useEffect, useState } from 'react'
import { Analytics } from '../../common/analytics/analytics'
import { ThisBrowser } from '../../common/constants'
import { ExtensionTabDataContext } from '../../common/context/extension-tab-data'
import { ComponentDataAllVersions } from '../../common/data/types'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType } from '../../common/message/constants'
import { lastRuntimeError, sendRuntimeMessage } from '../../common/message/helpers'
import { MessageResponse, MessageResponseLoadComponentVersions } from '../../common/message/types'
import { PolicyThreatLevelUtil } from '../../common/policy/policy-util'
import './version-timeline.css'

export default function VersionTimeline(props: Readonly<{ component?: ApiComponentDTOV2; tabId?: number }>) {
    const analytics = new Analytics()

    const extensionTabDataContext = useContext(ExtensionTabDataContext)

    const [lastLoadedKey, setLastLoadedKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)
    const [component, setComponent] = useState<ApiComponentDTOV2 | undefined>(undefined)
    const [componentVersions, setComponentVersions] = useState<ComponentDataAllVersions | undefined>(undefined)

    useEffect(() => {
        if (props.component === undefined || props.tabId === undefined) {
            return
        }

        const loadKey = `${props.tabId}-${props.component.packageUrl}`

        // Only run if this combination hasn't been loaded yet
        if (loadKey === lastLoadedKey) {
            return
        }

        logger.logReact('Requesting Component Versions', LogLevel.DEBUG, props.tabId, props.component)

        setLoading(true)
        setComponent(props.component)
        setLastLoadedKey(loadKey)

        sendRuntimeMessage({
            messageType: MessageRequestType.LOAD_COMPONENT_VERSIONS,
            componentIdentifier: props.component,
            tabId: props.tabId,
        }).then((msgResponse: MessageResponse) => {
            const lastError = lastRuntimeError()
            if (lastError) {
                logger.logReact(
                    '[VERSION TIMELINE] Runtime Error in VersionTimeline.useEffect',
                    LogLevel.WARN,
                    lastError
                )
                setLoading(false)
                return
            }

            // Set versions directly from response for immediate update
            const versionResponse = msgResponse as MessageResponseLoadComponentVersions

            if (versionResponse.versions && Object.keys(versionResponse.versions).length > 0) {
                setComponentVersions(versionResponse.versions)
                setLoading(false)
            } else {
                setLoading(false)
            }
        })
        analytics.firePageViewEvent(
            `Side Panel Component Version Timeline: ${props.component?.packageUrl as string}`,
            globalThis.location.href
        )
    }, [props.component, props.tabId])

    useEffect(() => {
        logger.logReact('VERSION TIMELINE Component Data updated', LogLevel.DEBUG, extensionTabDataContext.components)
        if (component?.packageUrl !== undefined) {
            if (Object.keys(extensionTabDataContext.components).includes(component.packageUrl)) {
                const versions = extensionTabDataContext.components[component.packageUrl].allComponentVersions
                // Only update if we don't already have versions (backup mechanism)
                if (!componentVersions && versions) {
                    setComponentVersions(versions)
                    setLoading(false)
                }
            }
        }
    }, [extensionTabDataContext.components, component])



    // Sort versions with newest first
    const sortedVersions = componentVersions
        ? Object.entries(componentVersions)
              .filter(([, component]) => component !== undefined)
              .sort(([versionA], [versionB]) => {
                  try {
                      return compareVersions(versionB, versionA) // Reverse order for newest first
                  } catch {
                      // Fallback to string comparison if versions aren't semver
                      return versionB.localeCompare(versionA)
                  }
              })
        : []

    // Get current component version for auto-scroll
    const currentVersion =
        componentVersions && props.component?.packageUrl
            ? Object.entries(componentVersions).find(
                  ([, comp]) => comp?.component?.packageUrl === props.component?.packageUrl
              )?.[0] || ''
            : ''

    // Auto-scroll to current version when timeline renders
    useEffect(() => {
        if (!loading && sortedVersions.length > 0 && currentVersion) {
            const currentVersionElement = document.getElementById(`version-${currentVersion}`)
            if (currentVersionElement) {
                currentVersionElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }, [loading, sortedVersions, currentVersion])

    if (!loading) {
        logger.logReact('Rending Component Version Timeline', LogLevel.DEBUG, componentVersions)
        return (
            <>
                <header className='nx-global-header'>
                    <div className='nx-back-button tm-back-button'>
                        <a className='nx-text-link' onClick={() => globalThis.history.back()} role='button'>
                            <NxFontAwesomeIcon icon={faArrowLeft} />
                            <span>{ThisBrowser.i18n.getMessage('BACK_TO_COMPONENT_LINK')}</span>
                        </a>
                    </div>
                </header>
                <NxTile>
                    <header className='nx-tile-header'>
                        <div className='nx-tile-header__title'>
                            <h2 className='nx-h2'>Version History</h2>
                        </div>
                    </header>
                    <div className='nx-tile-content'>
                        {sortedVersions.length > 0 ? (
                            <div className='version-timeline'>
                                {sortedVersions.map(([version, component]) => {
                                    const threatSummary = component
                                        ? PolicyThreatLevelUtil.getThreatLevelSummary(component)
                                        : null

                                    return (
                                        <div
                                            key={getUniqueId('timeline-item')}
                                            id={`version-${version}`}
                                            className={`timeline-container left ${
                                                version === currentVersion ? 'current-version' : ''
                                            }`}>
                                            <div className='timeline-content'>
                                                <div className='version-header'>
                                                    <h3 className='nx-h3'>{version}</h3>
                                                    <NxSmallThreatCounter
                                                        criticalCount={threatSummary?.criticalCount}
                                                        severeCount={threatSummary?.severeCount}
                                                        moderateCount={threatSummary?.moderateCount}
                                                        lowCount={threatSummary?.lowCount}
                                                    />
                                                </div>
                                                {component?.catalogDate && (
                                                    <div className='catalog-date'>
                                                        {ThisBrowser.i18n.getMessage('CATALOG_DATE')}:&nbsp;
                                                        {new Date(component.catalogDate).toLocaleDateString(ThisBrowser.i18n.getUILanguage(), {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <NxLoadingSpinner />
                        )}
                    </div>
                </NxTile>
            </>
        )
    } else {
        return (
            <>
                <header className='nx-global-header'>
                    <div className='nx-back-button tm-back-button'>
                        <a className='nx-text-link' onClick={() => globalThis.history.back()} role='button'>
                            <NxFontAwesomeIcon icon={faArrowLeft} />
                            <span>{ThisBrowser.i18n.getMessage('BACK_TO_COMPONENT_LINK')}</span>
                        </a>
                    </div>
                </header>
                <NxTile>
                    <header className='nx-tile-header'>
                        <div className='nx-tile-header__title'>
                            <h2 className='nx-h2'>Version History</h2>
                        </div>
                    </header>
                    <div className='nx-tile-content'>
                        <NxLoadingSpinner />
                    </div>
                </NxTile>
            </>
        )
    }
}
