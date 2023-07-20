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

import {
    NxDescriptionList,
    NxDivider,
    NxFormGroup,
    NxFormSelect,
    NxGrid,
    NxPageMain,
    NxPageTitle,
    NxTextInput,
    NxTile,
    nxTextInputStateHelpers,
} from '@sonatype/react-shared-components'
import React, { useContext, useState } from 'react'
import { ExtensionConfiguration } from '../../../types/ExtensionConfiguration'
import { ExtensionConfigurationContext } from '../../../context/ExtensionConfigurationContext'
import { LogLevel, logger } from '../../../logger/Logger'
import { isHttpUriValidator } from '../../Common/Validators'

const { initialState, userInput } = nxTextInputStateHelpers

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

export default function GeneralOptionsPage({
    setExtensionConfig,
}: {
    setExtensionConfig: (settings: ExtensionConfiguration) => void
}) {
    const extensionSettings = useContext(ExtensionConfigurationContext)
    const [addNxrmHostState, setAddNxrmHostState] = useState(initialState(''))

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

    const askForPermissions = () => {
        logger.logMessage(`Requesting  Browser Permission for: ${addNxrmHostState.trimmedValue}`, LogLevel.INFO)

        if (addNxrmHostState.trimmedValue !== undefined) {
            logger.logMessage(`Requesting permission to Origin ${extensionSettings.host}`, LogLevel.DEBUG)
            if (extensionSettings.sonatypeNexusRepositoryHosts.length == 0) {
                _browser.scripting
                    .registerContentScripts([
                        {
                            id: 'content',
                            css: ['/css/pagestyle.css'],
                            js: ['/static/js/content.js'],
                            matches: [`${addNxrmHostState.trimmedValue}/*`],
                            runAt: 'document_end',
                        },
                    ])
                    .then(recordRegisteredNxrmHost(addNxrmHostState.trimmedValue))
            } else {
                const allNxrmHosts = extensionSettings.sonatypeNexusRepositoryHosts.concat([
                    addNxrmHostState.trimmedValue,
                ])
                _browser.scripting
                    .updateContentScripts([
                        {
                            id: 'content',
                            css: ['/css/pagestyle.css'],
                            js: ['/static/js/content.js'],
                            matches: allNxrmHosts.map((url: string) => {
                                return url + '/*'
                            }),
                            runAt: 'document_end',
                        },
                    ])
                    .then(recordRegisteredNxrmHost(addNxrmHostState.trimmedValue))
            }
        }
    }

    function recordRegisteredNxrmHost(host: string): void {
        logger.logMessage(`Successfully registered ${host}`, LogLevel.INFO)
        const newExtensionSettings = extensionSettings as ExtensionConfiguration
        newExtensionSettings.sonatypeNexusRepositoryHosts.push(host)
        setExtensionConfig(newExtensionSettings)
        setAddNxrmHostState(userInput(null, ''))
    }

    function handleLogLevelChange(e) {
        const newExtensionSettings = extensionSettings as ExtensionConfiguration
        newExtensionSettings.logLevel = e.target.value as number
        setExtensionConfig(newExtensionSettings)
    }

    return (
        <NxPageMain>
            <h1>
                <NxPageTitle>{_browser.i18n.getMessage('OPTIONS_PAGE_TITLE')}</NxPageTitle>
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
                                        placeholder='Enter the URL of your Sonatype Nexus Repository'
                                        validatable={true}
                                    />
                                </NxFormGroup>
                                <button
                                    className='nx-btn grant-permissions'
                                    onClick={askForPermissions}
                                    disabled={!enableAddNxrmHostButton()}>
                                    {'Add +'}
                                </button>
                            </div>
                        </section>
                        <section className='nx-grid-col nx-grid-col--50'>
                            <p className='nx-p'>Configured Sonatype Nexus Repository hosts:</p>
                            {extensionSettings.sonatypeNexusRepositoryHosts.length == 0 && <em>None added yet</em>}
                            {extensionSettings.sonatypeNexusRepositoryHosts.length > 0 && (
                                <NxDescriptionList>
                                    {extensionSettings.sonatypeNexusRepositoryHosts.map((nxrmUrl: string) => {
                                        return (
                                            <NxDescriptionList.Item key={nxrmUrl}>
                                                <NxDescriptionList.Term>{nxrmUrl}</NxDescriptionList.Term>
                                            </NxDescriptionList.Item>
                                        )
                                    })}
                                </NxDescriptionList>
                            )}
                        </section>
                    </NxGrid.Row>
                    <NxDivider />
                    <NxGrid.Row>
                        <form className='nx-form'>
                            <NxFormGroup label={_browser.i18n.getMessage('LABEL_LOG_LEVEL')} isRequired>
                                <NxFormSelect defaultValue={extensionSettings.logLevel} onChange={handleLogLevelChange}>
                                    {Object.keys(LogLevel)
                                        .filter((key) => !isNaN(Number(LogLevel[key])))
                                        .map((val, key) => {
                                            return (
                                                <option key={key} value={key}>
                                                    {LogLevel[key]}
                                                </option>
                                            )
                                        })}
                                </NxFormSelect>
                            </NxFormGroup>
                        </form>
                    </NxGrid.Row>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
