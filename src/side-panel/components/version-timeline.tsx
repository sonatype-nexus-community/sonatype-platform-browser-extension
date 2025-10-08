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
import { getUniqueId, NxFontAwesomeIcon, NxLoadingSpinner } from '@sonatype/react-shared-components'
import React, { useContext, useEffect, useState } from 'react'
import { Analytics } from '../../common/analytics/analytics'
import { ThisBrowser } from '../../common/constants'
import { ExtensionTabDataContext } from '../../common/context/extension-tab-data'
import { ComponentDataAllVersions } from '../../common/data/types'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType } from '../../common/message/constants'
import { lastRuntimeError, sendRuntimeMessage } from '../../common/message/helpers'
import { MessageResponse } from '../../common/message/types'

export default function VersionTimeline(props: Readonly<{ component?: ApiComponentDTOV2; tabId?: number }>) {
    const analytics = new Analytics()

    const extensionTabDataContext = useContext(ExtensionTabDataContext)

    const [lastLoadedKey, setLastLoadedKey] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [component, setComponent] = useState<ApiComponentDTOV2 | undefined>(undefined)
    const [componentVersions, setComponentVersions] = useState<ComponentDataAllVersions | undefined>(undefined)

    useEffect(() => {
        if (props.component !== undefined && props.tabId !== undefined) {
            const loadKey = `${props.tabId}-${props.component.packageUrl}`

            // Only run if this combination hasn't been loaded yet
            if (loadKey === lastLoadedKey) return

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
                    logger.logReact('Runtime Error in VersionTimeline.useEffect', LogLevel.WARN, lastError)
                }

                logger.logReact('Response for load Component Versions', LogLevel.DEBUG, msgResponse)
                // setComponentVersions(msgResponse.versions)
            })
            analytics.firePageViewEvent(
                `Side Panel Component Version Timeline: ${props.component?.packageUrl as string}`,
                globalThis.location.href
            )
        }
    }, [props.component, props.tabId, lastLoadedKey])

    useEffect(() => {
        logger.logReact('VERSION TIMELINE Component Data updated', LogLevel.DEBUG, extensionTabDataContext.components)
        if (component?.packageUrl !== undefined) {
            if (Object.keys(extensionTabDataContext.components).includes(component.packageUrl)) {
                setComponentVersions(extensionTabDataContext.components[component.packageUrl].allComponentVersions)
                setLoading(false)
            }
        }
    }, [extensionTabDataContext.components, component])

    if (!loading) {
        logger.logReact("Rending Component Version Timeline", LogLevel.DEBUG, componentVersions)
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
                <section className='nx-tile'>
                    <header className='nx-tile-header'>
                        <div className='nx-tile-header__title'>
                            <h2 className='nx-h2'>Version History</h2>
                        </div>
                    </header>
                    <div className='nx-tile-content'>
                        {componentVersions !== undefined && (
                            <ul>
                                {Object.entries(componentVersions).map(([version, component]) => (
                                    <li key={getUniqueId('component-version')}>{version}</li>
                                ))}
                            </ul>
                        ) || (
                            <em>No versions?</em>
                        )}
                    </div>
                </section>
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
                <section className='nx-tile'>
                    <header className='nx-tile-header'>
                        <div className='nx-tile-header__title'>
                            <h2 className='nx-h2'>Version History</h2>
                        </div>
                    </header>
                    <div className='nx-tile-content'>
                        <NxLoadingSpinner />
                    </div>
                </section>
            </>
        )
    }
}
