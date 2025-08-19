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
import { NxDivider, NxFormGroup, NxFormSelect, NxGrid, NxPageMain, NxPageTitle, NxStatefulCheckbox, NxTile } from '@sonatype/react-shared-components'
import React, { useContext } from 'react'
import { ThisBrowser } from '../../common/constants'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'
import { logger, LogLevel } from '../../common/logger'
import ExtensionConfigurationStateHelper from '../configuration-state-helper'

export default function AdvancedOptionsSubPage() {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)

    function handleLogLevelChange(val: string) {
        logger.logReact('Handling log level change', LogLevel.DEBUG, val)
        const newExtensionSettings = extensionConfigContext
        newExtensionSettings.logLevel = parseInt(val)
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    function handleEnableNotificationsChange(isChecked: boolean) {
        logger.logReact('Handling Enable Notifications change', LogLevel.DEBUG, isChecked)
        const newExtensionSettings = extensionConfigContext
        newExtensionSettings.enableNotifications = isChecked
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    function handleEnablePageAnnotationsChange(isChecked: boolean) {
        logger.logReact('Handling Enable Page Annotations change', LogLevel.DEBUG, isChecked)
        const newExtensionSettings = extensionConfigContext
        newExtensionSettings.enablePageAnnotations = isChecked
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    return (
        <NxPageMain>
            <h1 className="nx-h1">
                <NxPageTitle>{ThisBrowser.i18n.getMessage('ADVANCED_OPTIONS_PAGE_TITLE')}</NxPageTitle>
            </h1>

            <NxTile>
                <NxTile.Content>
                    <NxGrid.Row>
                        <form className='nx-form'>
                            <NxFormGroup
                                label={ThisBrowser.i18n.getMessage('LABEL_ENABLE_NOTFIICATIONS')}
                                sublabel={ThisBrowser.i18n.getMessage('LABEL_ENABLE_NOTFIICATIONS_DESCRIPTION')}
                                isRequired
                            >
                                <NxStatefulCheckbox onChange={handleEnableNotificationsChange} defaultChecked={extensionConfigContext.enableNotifications}>
                                    Enabled
                                </NxStatefulCheckbox>
                            </NxFormGroup>
                        </form>
                    </NxGrid.Row>
                    <NxDivider />
                    <NxGrid.Row>
                        <form className='nx-form'>
                            <NxFormGroup
                                label={ThisBrowser.i18n.getMessage('LABEL_ENABLE_PAGE_ANNOTATIONS')}
                                sublabel={ThisBrowser.i18n.getMessage('LABEL_ENABLE_PAGE_ANNOTATIONS_DESCRIPTION')}
                                isRequired
                            >
                                <NxStatefulCheckbox onChange={handleEnablePageAnnotationsChange} defaultChecked={extensionConfigContext.enablePageAnnotations}>
                                    Enabled
                                </NxStatefulCheckbox>
                            </NxFormGroup>
                        </form>
                    </NxGrid.Row>
                    <NxDivider />
                    <NxGrid.Row>
                        <form className='nx-form'>
                            <NxFormGroup
                                label={ThisBrowser.i18n.getMessage('LABEL_LOG_LEVEL')}
                                sublabel={ThisBrowser.i18n.getMessage('LABEL_LOG_LEVEL_DESCRIPTION')}
                                isRequired
                            >
                                <NxFormSelect
                                    defaultValue={extensionConfigContext.logLevel}
                                    onChange={handleLogLevelChange}
                                >
                                    {Object.keys(LogLevel)
                                        .filter((key) => !isNaN(Number(LogLevel[key])))
                                        .map((val, key) => {
                                            return (
                                                <option
                                                    key={`log-level-${key}`}
                                                    value={key}
                                                >
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
