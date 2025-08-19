/**
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
import { faSpinner, faTrashAlt, IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { NxButton, NxDescriptionList, NxDivider, NxErrorAlert, NxFontAwesomeIcon, NxFormGroup, NxFormSelect, NxGrid, NxPageMain, NxPageTitle, NxSmallTag, NxTextInput, NxTile } from "@sonatype/react-shared-components"
import { initialState, userInput } from "@sonatype/react-shared-components/components/NxTextInput/stateHelpers"
import React, { useContext, useState } from "react"
import { SonatypeNexusRepostitoryHost } from "../../common/configuration/types"
import { ThisBrowser } from "../../common/constants"
import { ExtensionConfigurationContext } from "../../common/context/extension-configuration"
import { logger, LogLevel } from "../../common/logger"
import { isHttpUriValidator } from "./validators"
import ExtensionConfigurationStateHelper from "../configuration-state-helper"

export default function NexusRepositoryOptionsSubPage() {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const [addNxrmHostState, setAddNxrmHostState] = useState(initialState(''))
    const [checkingNxrmConnection, setCheckingNxrmConnection] = useState<boolean>(false)
    const [errorNxrm, setErrorNxrm] = useState<string | undefined>(undefined)

    /**
     * Field onChange Handlers
     */
    function handleAddNxrmHostChange(host: string) {
        setAddNxrmHostState(
            userInput((val) => {
                if (!isHttpUriValidator(val)) {
                    return 'Must be a valid URL'
                } else {
                    return null
                }
            }, host)
        )
    }

    function enableAddNxrmHostButton(): boolean {
        if (addNxrmHostState.trimmedValue.length > 4) {
            if (addNxrmHostState.validationErrors !== undefined && addNxrmHostState.validationErrors?.length == 0) {
                return true
            } else if (addNxrmHostState.validationErrors !== null) {
                return false
            } else {
                return true
            }
        }
        return false
    }

    // @todo: Refactor all logic into Service Worker messages - this should only present STATE / CONTEXT
    const askForPermissions = () => {
        logger.logReact(`Requesting Browser Permission for: ${addNxrmHostState.trimmedValue}`, LogLevel.INFO)

        if (addNxrmHostState.trimmedValue !== undefined) {
            const newNxrmHost = addNxrmHostState.trimmedValue.endsWith('/')
                ? addNxrmHostState.trimmedValue
                : `${addNxrmHostState.trimmedValue}/`

            const existingNxrmHostCheck = extensionConfigContext.sonatypeNexusRepositoryHosts.find(
                (nxrm) => nxrm.id == newNxrmHost.replace('://', '-')
            )

            if (existingNxrmHostCheck !== undefined) {
                logger.logReact(
                    `Attempt to add duplicate Sonatype Nexus Repository Host: ${newNxrmHost}`,
                    LogLevel.WARN
                )
                return
            }

            setCheckingNxrmConnection(true)

            logger.logReact(`Requesting permission to Origin ${newNxrmHost}`, LogLevel.DEBUG)
            if (extensionConfigContext.sonatypeNexusRepositoryHosts.length == 0) {
                ThisBrowser.scripting
                    .registerContentScripts([
                        {
                            id: 'content',
                            css: ['/css/pagestyle.css'],
                            js: ['/content.js'],
                            matches: [`${newNxrmHost}*`],
                            runAt: 'document_end',
                            world: 'ISOLATED',
                        },
                    ])
                    .then(() => recordRegisteredNxrmHost(newNxrmHost))
            } else {
                const allNxrmHosts = extensionConfigContext.sonatypeNexusRepositoryHosts
                    .map((nxrm) => {
                        return nxrm.url
                    })
                    .concat([newNxrmHost])
                ThisBrowser.scripting
                    .updateContentScripts([
                        {
                            id: 'content',
                            css: ['/css/pagestyle.css'],
                            js: ['/content.js'],
                            matches: allNxrmHosts.map((url: string) => {
                                return url + '*'
                            }),
                            runAt: 'document_end',
                            world: 'ISOLATED',
                        },
                    ])
                    .then(() => recordRegisteredNxrmHost(newNxrmHost))
            }
        }
    }

    function recordRegisteredNxrmHost(host: string): void {
        logger.logReact(`Successfully registered ${host}`, LogLevel.INFO)
        ThisBrowser.permissions
            .request({
                origins: [host + '*'],
            })
            .then((success: boolean) => {
                if (success) {
                    fetch(host + 'service/rest/swagger.json')
                        .then((response) => {
                            response
                                .json()
                                .then((swaggerJson) => {
                                    logger.logReact(`Successfully registered ${host}`, LogLevel.INFO, swaggerJson)
                                    const newExtensionSettings = extensionConfigContext
                                    newExtensionSettings.sonatypeNexusRepositoryHosts.push({
                                        id: host.replace('://', '-'),
                                        url: host,
                                        version: swaggerJson['info']['version'],
                                    })
                                    ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
                                    setAddNxrmHostState(userInput(null, ''))
                                })
                                .catch(() => {
                                    setErrorNxrm('This does not appear to be a Sonatype Nexus Repository 3 Server.')
                                })
                                .finally(() => {
                                    setErrorNxrm(undefined)
                                    setCheckingNxrmConnection(false)
                                })
                        })
                        .catch(() => {
                            setErrorNxrm(undefined)
                            setCheckingNxrmConnection(false)
                        })
                } else {
                    setErrorNxrm('You need to Allow your browser permission to add a Sonatype Nexus Repository server.')
                    setCheckingNxrmConnection(false)
                }
            })
    }

    function removeNxrmInstance(id: string): void {
        const nxrmInstanceToRemove = extensionConfigContext.sonatypeNexusRepositoryHosts.find(
            (nxrmHost) => nxrmHost.id == id
        )

        if (nxrmInstanceToRemove === undefined) {
            return
        }

        const remainingNxrmHosts = extensionConfigContext.sonatypeNexusRepositoryHosts.filter(
            (nxrmHost) => nxrmHost.id != id
        )

        logger.logReact(
            `Removing Browser Permission for: ${nxrmInstanceToRemove.url}, leaving ${remainingNxrmHosts.length} NXRM Hosts`,
            LogLevel.INFO,
            remainingNxrmHosts
        )

        logger.logReact(`Browser Permission REMOVED for: ${nxrmInstanceToRemove.url}*`, LogLevel.DEBUG)
        ThisBrowser.permissions
            .remove({
                origins: [nxrmInstanceToRemove.url + '*'],
            })
            .then((success: boolean) => {
                if (success) {
                    if (remainingNxrmHosts.length == 0) {
                        ThisBrowser.scripting
                            .unregisterContentScripts({
                                ids: ['content'],
                            })
                            .then(() => {
                                const newExtensionSettings = extensionConfigContext
                                newExtensionSettings.sonatypeNexusRepositoryHosts = remainingNxrmHosts
                                ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
                            }).catch((err) => {
                                logger.logMessage("Error unregistering content script for NXRM", LogLevel.ERROR, err)
                            })
                    } else {
                        ThisBrowser.scripting
                            .updateContentScripts([
                                {
                                    id: 'content',
                                    css: ['/css/pagestyle.css'],
                                    js: ['/content.js'],
                                    matches: remainingNxrmHosts.map((nxrmHost) => {
                                        return nxrmHost.url + '*'
                                    }),
                                    runAt: 'document_end',
                                    world: 'ISOLATED',
                                },
                            ])
                            .then(() => {
                                const newExtensionSettings = extensionConfigContext
                                newExtensionSettings.sonatypeNexusRepositoryHosts = remainingNxrmHosts
                                ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
                            }).catch((err) => {
                                logger.logReact("Error updating content script for remaining NXRMs", LogLevel.ERROR, err, remainingNxrmHosts)
                            })
                    }
                }
            }).catch((err) => {
                logger.logReact("Error removing browser permissions for NXRM", LogLevel.ERROR, err)
            })
    }

    return (
        <NxPageMain>
            <h1>
                <NxPageTitle>{ThisBrowser.i18n.getMessage('CONFIGURE_NXRM_PAGE_TITLE')}</NxPageTitle>
            </h1>

            <NxTile>
                <NxTile.Content>
                    <NxGrid.Row>
                        <section className='nx-grid-col nx-grid-col--50'>
                            <div className='nx-form-row'>
                                <NxFormGroup label={'Add a Sonatype Nexus Repository host'}>
                                    <NxTextInput
                                        {...addNxrmHostState}
                                        onChange={handleAddNxrmHostChange}
                                        placeholder='Sonatype Nexus Repository URL'
                                        validatable={true}
                                    />
                                </NxFormGroup>
                                <button
                                    className='nx-btn grant-permissions'
                                    onClick={askForPermissions}
                                    disabled={!enableAddNxrmHostButton()}>
                                    {'Add'}
                                    {checkingNxrmConnection === true && (
                                        <React.Fragment>
                                            &nbsp;&nbsp;&nbsp;
                                            <NxFontAwesomeIcon icon={faSpinner as IconDefinition} spin={true} />
                                        </React.Fragment>
                                    )}
                                </button>
                            </div>
                            {errorNxrm !== undefined && (
                                <div className='nx-form-row'>
                                    <NxErrorAlert>{errorNxrm}</NxErrorAlert>
                                </div>
                            )}
                        </section>
                        <section className='nx-grid-col nx-grid-col--50'>
                            <p className='nx-p'>Enabled Sonatype Nexus Repository servers:</p>
                            {extensionConfigContext.sonatypeNexusRepositoryHosts.length == 0 && <em>None added yet</em>}
                            {extensionConfigContext.sonatypeNexusRepositoryHosts.length > 0 && (
                                <NxDescriptionList>
                                    {extensionConfigContext.sonatypeNexusRepositoryHosts.map(
                                        (nxrmHost: SonatypeNexusRepostitoryHost) => {
                                            return (
                                                <NxDescriptionList.Item key={nxrmHost.id}>
                                                    <NxDescriptionList.Term>
                                                        <img
                                                            src='./images/sonatype-repo-icon.png'
                                                            width={38}
                                                            height={38}
                                                            alt='Sonatype Nexus Repository'
                                                            style={{ marginRight: '10px' }}
                                                        />
                                                        <div style={{ padding: '5px 0' }}>
                                                            {nxrmHost.url}{' '}
                                                            <NxSmallTag color='green'>{nxrmHost.version}</NxSmallTag>
                                                        </div>
                                                    </NxDescriptionList.Term>
                                                    <NxDescriptionList.Description>
                                                        <NxButton
                                                            variant='icon-only'
                                                            title='Remove'
                                                            onClick={() => removeNxrmInstance(nxrmHost.id)}>
                                                            <NxFontAwesomeIcon icon={faTrashAlt as IconDefinition} />
                                                        </NxButton>
                                                    </NxDescriptionList.Description>
                                                </NxDescriptionList.Item>
                                            )
                                        }
                                    )}
                                </NxDescriptionList>
                            )}
                        </section>
                    </NxGrid.Row>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
