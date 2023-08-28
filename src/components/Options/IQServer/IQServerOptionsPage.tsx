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
    NxFormGroup,
    NxGrid,
    NxStatefulErrorAlert,
    NxStatefulSuccessAlert,
    NxStatefulTextInput,
    NxTooltip,
    NxFontAwesomeIcon,
    NxFormSelect,
    NxButton,
    NxStatefulInfoAlert,
    NxPageMain,
    NxPageTitle,
    NxTile,
    NxTextLink,
    NxDivider,
    NxTag,
    NxTextInput,
    nxTextInputStateHelpers,
} from '@sonatype/react-shared-components'
import React, { useEffect, useState, useContext } from 'react'
import './IQServerOptionsPage.css'
import { faExternalLink, faQuestionCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { MESSAGE_REQUEST_TYPE, MESSAGE_RESPONSE_STATUS, MessageResponse } from '../../../types/Message'
import { DEFAULT_EXTENSION_SETTINGS, ExtensionConfiguration } from '../../../types/ExtensionConfiguration'
import { ExtensionConfigurationContext } from '../../../context/ExtensionConfigurationContext'
import { isHttpUriValidator, nonEmptyValidator } from '../../Common/Validators'
import { logger, LogLevel } from '../../../logger/Logger'
import { ApiApplicationDTO } from '@sonatype/nexus-iq-api-client'
import {
    determineSupportsFirewall,
    determineSupportsLifecycle,
    determineSupportsLifecycleAlp,
} from '../../../messages/IqCapabilities'
import { SANDBOX_APPLICATION_PUBLIC_ID } from '../../../utils/Constants'

const { initialState, userInput } = nxTextInputStateHelpers

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

export interface IqServerOptionsPageInterface {
    setExtensionConfig: (settings: ExtensionConfiguration) => void
    install: boolean
}

export default function IQServerOptionsPage(props: IqServerOptionsPageInterface) {
    const extensionSettings = useContext(ExtensionConfigurationContext)
    const [hasPermissions, setHasPermission] = useState(false)
    const [iqAuthenticated, setIqAuthenticated] = useState<boolean | undefined>()
    const [iqServerApplicationList, setiqServerApplicationList] = useState<Array<ApiApplicationDTO>>([])
    const setExtensionConfig = props.setExtensionConfig
    const [checkingConnection, setCheckingConnection] = useState(false)
    const [iqUrl, setIqUrl] = useState(
        initialState(extensionSettings.host === undefined ? '' : (extensionSettings.host as string))
    )

    /**
     * Hook to check whether we already have permissions to IQ Server Host
     */
    useEffect(() => {
        if (extensionSettings.host !== undefined) {
            hasOriginPermission()
        }
    })

    /**
     * Request permission to IQ Server Host
     */
    const askForPermissions = () => {
        // Update Extension Settings
        // Normalise the host to end with / here
        const newExtensionSettings = extensionSettings !== undefined ? extensionSettings : DEFAULT_EXTENSION_SETTINGS
        newExtensionSettings.host = iqUrl.trimmedValue.endsWith('/') ? iqUrl.trimmedValue : `${iqUrl.trimmedValue}/`
        setExtensionConfig(newExtensionSettings)
        hasOriginPermission()

        logger.logMessage(`Requesting Browser Permission to Origin: '${extensionSettings?.host}'`, LogLevel.INFO)

        if (extensionSettings.host !== undefined) {
            logger.logMessage(`Requesting permission to Origin ${extensionSettings.host}`, LogLevel.DEBUG)
            _browser.permissions.request(
                {
                    origins: [extensionSettings.host],
                },
                (granted: boolean) => {
                    setHasPermission(granted)
                }
            )
        }
    }

    function hasOriginPermission() {
        if (extensionSettings.host !== undefined && isHttpUriValidator(extensionSettings.host)) {
            _browser.permissions.contains(
                {
                    origins: [extensionSettings.host],
                },
                (result: boolean) => {
                    if (chrome.runtime.lastError) {
                        logger.logMessage('Error in hasOriginPermission', LogLevel.WARN, chrome.runtime.lastError)
                    }
                    if (result) {
                        setHasPermission(true)
                    } else {
                        setHasPermission(false)
                    }
                }
            )
        }
    }

    /**
     * Field onChange Handlers
     */
    function handleIqHostChange(url: string) {
        setIqUrl(
            userInput((val) => {
                if (!isHttpUriValidator(val)) {
                    return 'Must be a valid URL'
                } else {
                    return null
                }
            }, url)
        )
    }

    function handleIqTokenChange(e) {
        const newExtensionSettings = extensionSettings as ExtensionConfiguration
        newExtensionSettings.token = e as string
        setExtensionConfig(newExtensionSettings)
    }

    function handleIqUserChange(e) {
        const newExtensionSettings = extensionSettings as ExtensionConfiguration
        newExtensionSettings.user = e as string
        setExtensionConfig(newExtensionSettings)
    }

    function handleIqApplicationChange(e) {
        const newExtensionSettings = extensionSettings as ExtensionConfiguration
        const [iqApplicationInternalId, iqApplicationPublidId] = (e.target.value as string).split('|')
        newExtensionSettings.iqApplicationInternalId = iqApplicationInternalId
        newExtensionSettings.iqApplicationPublidId = iqApplicationPublidId
        setExtensionConfig(newExtensionSettings)
    }

    function handleLoginCheck() {
        setCheckingConnection(true)
        _browser.runtime
            .sendMessage({
                type: MESSAGE_REQUEST_TYPE.GET_APPLICATIONS,
            })
            .catch((err) => {
                logger.logMessage(`Error caught calling GET_APPLICATIONS`, LogLevel.WARN, err)
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((response: any) => {
                setCheckingConnection(false)
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                if (_browser.runtime.lastError) {
                    logger.logMessage('Error handleLoginCheck', LogLevel.ERROR)
                    return
                }
                logger.logMessage(`Response to GET_APPLICATIONS: ${response}`, LogLevel.DEBUG)
                if (response !== undefined) {
                    logger.logMessage(`Processing response to message GET_APPLICATIONS: ${response}`, LogLevel.DEBUG)
                    const msgResponse = response as MessageResponse
                    if (
                        msgResponse.status == MESSAGE_RESPONSE_STATUS.SUCCESS &&
                        msgResponse.data &&
                        'applications' in msgResponse.data
                    ) {
                        setIqAuthenticated(true)
                        setiqServerApplicationList(msgResponse.data.applications as Array<ApiApplicationDTO>)
                    } else {
                        logger.logMessage(`Unsuccessful response to GET_APPLICATIONS: `, LogLevel.WARN, response)
                        setIqAuthenticated(false)
                        setiqServerApplicationList([])
                    }
                } else {
                    logger.logMessage(`No response to GET_APPLICATIONS`, LogLevel.WARN, response)
                }
            })
            .then(determineIqCapabilities)
    }

    function getSandboxApplicationOrFirst(): ApiApplicationDTO | undefined {
        const sandboxApplication = iqServerApplicationList
            .filter((applicationDto: ApiApplicationDTO) => {
                return applicationDto.publicId == SANDBOX_APPLICATION_PUBLIC_ID
            })
            .pop() as ApiApplicationDTO
        if (sandboxApplication === undefined) {
            return iqServerApplicationList[0]
        } else {
            return sandboxApplication
        }
    }

    async function determineIqCapabilities() {
        logger.logMessage(`Determine IQ Capabilities`, LogLevel.DEBUG)
        const supportsFirewall = await determineSupportsFirewall()
        const supportsLifecycleAlp = await determineSupportsLifecycleAlp()
        const newExtensionSettings = extensionSettings as ExtensionConfiguration
        newExtensionSettings.supportsFirewall = supportsFirewall
        newExtensionSettings.supportsLifecycleAlp = supportsLifecycleAlp
        setExtensionConfig(newExtensionSettings)
    }

    useEffect(() => {
        async function determineIqLifecycleCapability() {
            const sandboxApplication = getSandboxApplicationOrFirst()

            if (sandboxApplication === undefined) {
                logger.logMessage(`There is no Sandbox Application AND no Applications that we can read`, LogLevel.WARN)
                return
            }

            logger.logMessage(
                `UE: Found Sandbox Application: ${sandboxApplication} from ${iqServerApplicationList.length} Applications`,
                LogLevel.DEBUG
            )
            let supportsLifecycle = false
            if (sandboxApplication !== undefined) {
                supportsLifecycle = await determineSupportsLifecycle(sandboxApplication.id as string)
            }
            const newExtensionSettings = extensionSettings as ExtensionConfiguration
            newExtensionSettings.supportsLifecycle = supportsLifecycle
            if (supportsLifecycle === false) {
                newExtensionSettings.iqApplicationInternalId = sandboxApplication.id as string
                newExtensionSettings.iqApplicationPublidId = sandboxApplication.publicId as string
            }
            setExtensionConfig(newExtensionSettings)
        }

        determineIqLifecycleCapability()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [iqServerApplicationList])

    return (
        <NxPageMain>
            <h1>
                {props.install === true && (
                    <NxPageTitle>
                        &#127881; {_browser.i18n.getMessage('OPTIONS_INSTALL_MODE_PAGE_TITLE')} &#127881;
                    </NxPageTitle>
                )}
                {props.install !== true && <NxPageTitle>{_browser.i18n.getMessage('OPTIONS_PAGE_TITLE')}</NxPageTitle>}
            </h1>

            <NxTile>
                <NxTile.Content>
                    <NxGrid.Row>
                        <div className='nx-grid-col nx-grid-col-33'>
                            <div>
                                <center>
                                    <img
                                        src='/images/sonatype-lifecycle-icon.png'
                                        width='50'
                                        alt={_browser.i18n.getMessage('SONATYPE_LIFECYCLE')}
                                        title={_browser.i18n.getMessage('SONATYPE_LIFECYCLE')}
                                        className={
                                            extensionSettings.supportsLifecycle === false ? 'dim-image' : 'not-dim'
                                        }
                                    />
                                    <div>
                                        {extensionSettings.supportsLifecycle === false && (
                                            <span>{_browser.i18n.getMessage('DOES_IQ_SUPPORT_FEATURE')} </span>
                                        )}

                                        <NxTextLink
                                            external
                                            href='https://www.sonatype.com/products/open-source-security-dependency-management'>
                                            {_browser.i18n.getMessage('SONATYPE_LIFECYCLE')}
                                        </NxTextLink>
                                        {extensionSettings.supportsLifecycle === false && <span>?</span>}
                                        {extensionSettings.supportsLifecycle === true && (
                                            <div>
                                                <NxTag color='turquoise'>{_browser.i18n.getMessage('SUPPORTED')}</NxTag>
                                            </div>
                                        )}
                                    </div>
                                </center>
                            </div>
                        </div>
                        <div className='nx-grid-col nx-grid-col-33'>
                            <div>
                                <center>
                                    <img
                                        src='/images/add-on-sonatype-icon-water.png'
                                        width='50'
                                        alt={_browser.i18n.getMessage('SONATYPE_LIFECYCLE_ALP')}
                                        title={_browser.i18n.getMessage('SONATYPE_LIFECYCLE_ALP')}
                                        className={
                                            extensionSettings.supportsLifecycleAlp === false ? 'dim-image' : 'not-dim'
                                        }
                                    />
                                    <div>
                                        {extensionSettings.supportsLifecycleAlp === false && (
                                            <span>{_browser.i18n.getMessage('DOES_IQ_SUPPORT_FEATURE')} </span>
                                        )}
                                        <NxTextLink
                                            external
                                            href='https://www.sonatype.com/products/advanced-legal-pack'>
                                            {_browser.i18n.getMessage('SONATYPE_LIFECYCLE_ALP')}
                                        </NxTextLink>
                                        {extensionSettings.supportsLifecycleAlp === false && <span>?</span>}
                                        {extensionSettings.supportsLifecycleAlp === true && (
                                            <div>
                                                <NxTag color='turquoise'>{_browser.i18n.getMessage('SUPPORTED')}</NxTag>
                                            </div>
                                        )}
                                    </div>
                                </center>
                            </div>
                        </div>
                        <div className='nx-grid-col nx-grid-col-33'>
                            <div>
                                <center>
                                    <img
                                        src='/images/sonatype-firewall-icon.png'
                                        width='50'
                                        alt={_browser.i18n.getMessage('SONATYPE_FIREWALL')}
                                        title={_browser.i18n.getMessage('SONATYPE_FIREWALL')}
                                        className={
                                            extensionSettings.supportsFirewall === false ? 'dim-image' : 'not-dim'
                                        }
                                    />
                                    <div>
                                        {extensionSettings.supportsFirewall === false && (
                                            <span>{_browser.i18n.getMessage('DOES_IQ_SUPPORT_FEATURE')} </span>
                                        )}
                                        <NxTextLink
                                            external
                                            href='https://www.sonatype.com/products/sonatype-repository-firewall'>
                                            {_browser.i18n.getMessage('SONATYPE_FIREWALL')}
                                        </NxTextLink>
                                        {extensionSettings.supportsFirewall === false && <span>?</span>}
                                        {extensionSettings.supportsFirewall === true && (
                                            <div>
                                                <NxTag color='turquoise'>{_browser.i18n.getMessage('SUPPORTED')}</NxTag>
                                            </div>
                                        )}
                                    </div>
                                </center>
                            </div>
                        </div>
                    </NxGrid.Row>
                    <NxDivider></NxDivider>
                    <NxGrid.Row>
                        <section className='nx-grid-col nx-grid-col-100'>
                            <p className='nx-p'>
                                <strong>1)</strong> {_browser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_1')}
                            </p>

                            <div className='nx-form-row'>
                                <NxFormGroup label={_browser.i18n.getMessage('LABEL_URL')} isRequired>
                                    {/* <NxStatefulTextInput
                                        defaultValue={extensionSettings?.host as string}
                                        validator={nonEmptyValidator}
                                        onBlur={handleIqHostChange}
                                    /> */}
                                    <NxTextInput
                                        {...iqUrl}
                                        onChange={handleIqHostChange}
                                        validatable={true}
                                    />
                                </NxFormGroup>
                                {!hasPermissions && (
                                    <button className='nx-btn grant-permissions' onClick={askForPermissions}>
                                        {_browser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_BUTTON_GRANT_PERMISSIONS')}
                                    </button>
                                )}
                            </div>

                            {hasPermissions && (
                                <div>
                                    <p className='nx-p'>
                                        <strong>2)</strong> {_browser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_2')}
                                    </p>
                                    <div className='nx-form-row'>
                                        <NxFormGroup label={_browser.i18n.getMessage('LABEL_USERNAME')} isRequired>
                                            <NxStatefulTextInput
                                                defaultValue={extensionSettings?.user}
                                                validator={nonEmptyValidator}
                                                onChange={handleIqUserChange}
                                            />
                                        </NxFormGroup>
                                        <NxFormGroup label={_browser.i18n.getMessage('LABEL_PASSWORD')} isRequired>
                                            <NxStatefulTextInput
                                                defaultValue={extensionSettings?.token}
                                                validator={nonEmptyValidator}
                                                type='password'
                                                onChange={handleIqTokenChange}
                                            />
                                        </NxFormGroup>
                                        <NxButton variant='primary' onClick={handleLoginCheck}>
                                            {_browser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_BUTTON_CONNECT_IQ')}
                                            {checkingConnection === true && (
                                                <React.Fragment>
                                                    &nbsp;&nbsp;&nbsp;
                                                    <NxFontAwesomeIcon icon={faSpinner as IconDefinition} spin={true} />
                                                </React.Fragment>
                                            )}
                                        </NxButton>
                                    </div>
                                </div>
                            )}
                            {iqAuthenticated === true &&
                                extensionSettings.supportsLifecycle === true &&
                                iqServerApplicationList.length > 0 && (
                                    <React.Fragment>
                                        <p className='nx-p'>
                                            <strong>3)</strong>{' '}
                                            {_browser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_3')}
                                            <NxTooltip
                                                title={_browser.i18n.getMessage(
                                                    'OPTIONS_PAGE_TOOLTIP_WHY_APPLICATION'
                                                )}>
                                                <NxFontAwesomeIcon icon={faQuestionCircle as IconDefinition} />
                                            </NxTooltip>
                                        </p>

                                        <NxFormGroup
                                            label={_browser.i18n.getMessage('LABEL_SONATYPE_APPLICATION')}
                                            isRequired>
                                            <NxFormSelect
                                                defaultValue={`${extensionSettings.iqApplicationInternalId}|${extensionSettings.iqApplicationPublidId}`}
                                                onChange={handleIqApplicationChange}
                                                disabled={!iqAuthenticated}>
                                                <option value=''>
                                                    {_browser.i18n.getMessage('LABEL_SELECT_AN_APPLICATION')}
                                                </option>
                                                {iqServerApplicationList.map((app: ApiApplicationDTO) => {
                                                    return (
                                                        <option key={app.id} value={`${app.id}|${app.publicId}`}>
                                                            {app.name}
                                                        </option>
                                                    )
                                                })}
                                            </NxFormSelect>
                                        </NxFormGroup>
                                        {/* <NxFormGroup
                                            label={_browser.i18n.getMessage('LABEL_SONATYPE_APPLICATION')}> */}

                                        <a
                                            href='https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j-core/2.12.1'
                                            target='_blank'
                                            className='nx-btn'>
                                            Maven {_browser.i18n.getMessage('EXAMPLE')}{' '}
                                            <NxFontAwesomeIcon icon={faExternalLink as IconDefinition} />
                                        </a>
                                        <a
                                            href='https://www.npmjs.com/package/handlebars/v/4.7.5'
                                            target='_blank'
                                            className='nx-btn'>
                                            npmjs {_browser.i18n.getMessage('EXAMPLE')}{' '}
                                            <NxFontAwesomeIcon icon={faExternalLink as IconDefinition} />
                                        </a>
                                        <a
                                            href='https://pypi.org/project/feedparser/6.0.10/'
                                            target='_blank'
                                            className='nx-btn'>
                                            PyPI {_browser.i18n.getMessage('EXAMPLE')}{' '}
                                            <NxFontAwesomeIcon icon={faExternalLink as IconDefinition} />
                                        </a>

                                        {/* </NxFormGroup> */}
                                    </React.Fragment>
                                )}

                            {iqAuthenticated === true &&
                                extensionSettings.iqApplicationInternalId != undefined &&
                                extensionSettings.iqApplicationPublidId != undefined && (
                                    <NxStatefulSuccessAlert>
                                        {_browser.i18n.getMessage('OPTIONS_SUCCESS_MESSAGE')}
                                    </NxStatefulSuccessAlert>
                                )}
                            {extensionSettings.iqApplicationInternalId === undefined &&
                                extensionSettings.iqApplicationPublidId === undefined &&
                                extensionSettings.supportsLifecycle === true &&
                                iqAuthenticated === true && (
                                    <NxStatefulInfoAlert>
                                        {_browser.i18n.getMessage('OPTIONS_INFO_MESSAGE_CHOOSE_APPLICATION')}
                                    </NxStatefulInfoAlert>
                                )}
                            {iqAuthenticated === false && (
                                <NxStatefulErrorAlert>
                                    {_browser.i18n.getMessage('OPTIONS_ERROR_MESSAGE_UNAUTHENTICATED')}
                                </NxStatefulErrorAlert>
                            )}
                        </section>
                    </NxGrid.Row>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
