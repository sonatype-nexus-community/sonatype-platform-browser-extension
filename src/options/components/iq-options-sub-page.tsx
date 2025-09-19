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
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faExternalLink, faSpinner } from '@fortawesome/free-solid-svg-icons'
import {
    NxButton,
    NxDivider,
    NxFontAwesomeIcon,
    NxFormGroup,
    NxGrid,
    NxPageMain,
    NxPageTitle,
    NxStatefulErrorAlert,
    NxStatefulInfoAlert,
    NxStatefulSuccessAlert,
    NxStatefulTextInput,
    NxTag,
    NxTextInput,
    nxTextInputStateHelpers,
    NxTextInputStateProps,
    NxTextLink,
    NxTile
} from '@sonatype/react-shared-components'
import React, { useContext, useEffect, useState } from 'react'
import { ThisBrowser } from '../../common/constants'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'
import { logger, LogLevel } from '../../common/logger'
import { MessageRequestType } from '../../common/message/constants'
import { lastRuntimeError, sendRuntimeMessage } from '../../common/message/helpers'
import { MessageResponseIqConnectivityAndVersionCheck } from '../../common/message/types'
import ExtensionConfigurationStateHelper from '../configuration-state-helper'
import IQApplicationSelector from './iq-application-selector'
import { isHttpUriValidator, nonEmptyValidator } from './validators'

const { initialState, userInput } = nxTextInputStateHelpers

export interface IqServerOptionsPageInterface {
    install: boolean
    invalidCredentials: boolean
}

export default function IQOptionsSubPage(props: Readonly<IqServerOptionsPageInterface>) {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const [hasPermissions, setHasPermissions] = useState(false)
    const [checkingConnection, setCheckingConnection] = useState(false)
    const [iqUrl, setIqUrl] = useState<NxTextInputStateProps>(
        initialState(extensionConfigContext.host === undefined ? '' : (extensionConfigContext.host as string))
    )

    /**
     * Hook to check whether we already have permissions to IQ Server Host
     */
    useEffect(() => {
        if (extensionConfigContext.host !== undefined) {
            ThisBrowser.permissions.contains(
                {
                    origins: [iqUrl.trimmedValue.endsWith('/') ? iqUrl.trimmedValue : `${iqUrl.trimmedValue}/`],
                },
                (result: boolean) => {
                    const lastError = lastRuntimeError()
                    if (lastError) {
                        logger.logReact('Runtime Error in IQOptionsSubPage#useEffect-1', LogLevel.WARN, lastError)
                    }
                    if (result) {
                        setHasPermissions(true)
                    } else {
                        setHasPermissions(false)
                    }
                }
            )
        }
    }, [extensionConfigContext, iqUrl.trimmedValue])

    const reloadApplications = function () {
        sendRuntimeMessage({
            messageType: MessageRequestType.LOAD_APPLICATIONS,
        }).then(() => {
            const lastError = lastRuntimeError()
            if (lastError) {
                logger.logReact('Runtime Error in IQOptionsSubPage#reloadApplications', LogLevel.WARN, lastError)
            }
        })
    }

    useEffect(() => {
        // IQ is connected - get Applications
        if (extensionConfigContext.iqAuthenticated) {
            reloadApplications()
        }
    }, [extensionConfigContext.iqAuthenticated])

    /**
     * Request permission to IQ Server Host
     */
    const askForPermissions = () => {
        // Update Extension Settings
        // Normalise the host to end with / here
        const newExtensionSettings = extensionConfigContext
        newExtensionSettings.host = iqUrl.trimmedValue.endsWith('/') ? iqUrl.trimmedValue : `${iqUrl.trimmedValue}/`
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
        ThisBrowser.permissions.contains(
            {
                origins: [iqUrl.trimmedValue.endsWith('/') ? iqUrl.trimmedValue : `${iqUrl.trimmedValue}/`],
            },
            (result: boolean) => {
                const lastError = lastRuntimeError()
                if (lastError) {
                    logger.logReact('Runtime Error in IQOptionsSubPage#askForPermissions-1', LogLevel.WARN, lastError)
                }

                if (result) {
                    setHasPermissions(true)
                } else {
                    setHasPermissions(false)
                }
            }
        )

        logger.logReact(`Requesting Browser Permission to Origin: '${extensionConfigContext.host}'`, LogLevel.INFO)

        if (extensionConfigContext.host !== undefined) {
            logger.logReact(`Requesting permission to Origin ${extensionConfigContext.host}`, LogLevel.DEBUG)
            ThisBrowser.permissions.request(
                {
                    origins: [extensionConfigContext.host as string],
                },
                (granted: boolean) => {
                    const lastError = lastRuntimeError()
                    if (lastError) {
                        logger.logReact(
                            'Runtime Error in IQOptionsSubPage#askForPermissions-2',
                            LogLevel.WARN,
                            lastError
                        )
                    }
                    setHasPermissions(granted)
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
        const newExtensionSettings = extensionConfigContext
        newExtensionSettings.token = e as string
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    function handleIqUserChange(e) {
        const newExtensionSettings = extensionConfigContext
        newExtensionSettings.user = e as string
        ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
    }

    function handleLoginCheck() {
        setCheckingConnection(true)

        /**
         * Force check that we have correct host in Extension Settings
         */
        if (iqUrl.trimmedValue !== extensionConfigContext.host) {
            const newExtensionSettings = extensionConfigContext
            newExtensionSettings.host = iqUrl.trimmedValue.endsWith('/') ? iqUrl.trimmedValue : `${iqUrl.trimmedValue}/`
            ExtensionConfigurationStateHelper.persistExtensionConfiguration(newExtensionSettings)
        }

        // Check Connectivity and Determine IQ Version
        sendRuntimeMessage({
            messageType: MessageRequestType.CONNECTIVITY_AND_VERSION_CHECK,
        }).then((msgResponse: MessageResponseIqConnectivityAndVersionCheck) => {
            const lastError = lastRuntimeError()
            if (lastError) {
                logger.logReact('Runtime Error in IQOptionsSubPage#handleLoginCheck', LogLevel.WARN, lastError)
            }
            logger.logReact('Response to CONNECTIVITY_AND_VERSION_CHECK', LogLevel.DEBUG, msgResponse)

             // Small delay to ensure state updates are complete
            setTimeout(() => {
                setCheckingConnection(false)
            }, 250)
        })
    }

    return (
        <NxPageMain>
            <h1>
                {props.install === true && (
                    <NxPageTitle>
                        &#127881; {ThisBrowser.i18n.getMessage('OPTIONS_INSTALL_MODE_PAGE_TITLE')} &#127881;
                    </NxPageTitle>
                )}
                {props.install !== true && (
                    <NxPageTitle>{ThisBrowser.i18n.getMessage('CONFIGURE_NXIQ_PAGE_TITLE')}</NxPageTitle>
                )}
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
                                        alt={ThisBrowser.i18n.getMessage('SONATYPE_LIFECYCLE')}
                                        title={ThisBrowser.i18n.getMessage('SONATYPE_LIFECYCLE')}
                                        className={
                                            extensionConfigContext.supportsLifecycle === false ? 'dim-image' : 'not-dim'
                                        }
                                    />
                                    <div>
                                        {extensionConfigContext.supportsLifecycle === false && (
                                            <span>{ThisBrowser.i18n.getMessage('DOES_IQ_SUPPORT_FEATURE')} </span>
                                        )}

                                        <NxTextLink
                                            external
                                            href='https://www.sonatype.com/products/open-source-security-dependency-management'>
                                            {ThisBrowser.i18n.getMessage('SONATYPE_LIFECYCLE')}?
                                        </NxTextLink>
                                        {extensionConfigContext.supportsLifecycle === true && (
                                            <p>
                                                <NxTag color='turquoise'>
                                                    {ThisBrowser.i18n.getMessage('SUPPORTED')}
                                                </NxTag>
                                            </p>
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
                                        alt={ThisBrowser.i18n.getMessage('SONATYPE_LIFECYCLE_ALP')}
                                        title={ThisBrowser.i18n.getMessage('SONATYPE_LIFECYCLE_ALP')}
                                        className={
                                            extensionConfigContext.supportsLifecycleAlp === false
                                                ? 'dim-image'
                                                : 'not-dim'
                                        }
                                    />
                                    <div>
                                        {extensionConfigContext.supportsLifecycleAlp === false && (
                                            <span>{ThisBrowser.i18n.getMessage('DOES_IQ_SUPPORT_FEATURE')} </span>
                                        )}
                                        <NxTextLink
                                            external
                                            href='https://www.sonatype.com/products/advanced-legal-pack'>
                                            {ThisBrowser.i18n.getMessage('SONATYPE_LIFECYCLE_ALP')}?
                                        </NxTextLink>
                                        {extensionConfigContext.supportsLifecycleAlp === true && (
                                            <p>
                                                <NxTag color='turquoise'>
                                                    {ThisBrowser.i18n.getMessage('SUPPORTED')}
                                                </NxTag>
                                            </p>
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
                                        alt={ThisBrowser.i18n.getMessage('SONATYPE_FIREWALL')}
                                        title={ThisBrowser.i18n.getMessage('SONATYPE_FIREWALL')}
                                        className={
                                            extensionConfigContext.supportsFirewall === false ? 'dim-image' : 'not-dim'
                                        }
                                    />
                                    <div>
                                        {extensionConfigContext.supportsFirewall === false && (
                                            <span>{ThisBrowser.i18n.getMessage('DOES_IQ_SUPPORT_FEATURE')} </span>
                                        )}
                                        <NxTextLink
                                            external
                                            href='https://www.sonatype.com/products/sonatype-repository-firewall'>
                                            {ThisBrowser.i18n.getMessage('SONATYPE_FIREWALL')}?
                                        </NxTextLink>
                                        {extensionConfigContext.supportsFirewall === true && (
                                            <p>
                                                <NxTag color='turquoise'>
                                                    {ThisBrowser.i18n.getMessage('SUPPORTED')}
                                                </NxTag>
                                            </p>
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
                                <strong>1)</strong> {ThisBrowser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_1')}
                            </p>

                            <div className='nx-form-row'>
                                <NxFormGroup label={ThisBrowser.i18n.getMessage('LABEL_URL')} isRequired>
                                    <NxTextInput {...iqUrl} onChange={handleIqHostChange} validatable={true} />
                                </NxFormGroup>
                                {!hasPermissions && (
                                    <button className='nx-btn grant-permissions' onClick={askForPermissions}>
                                        {ThisBrowser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_BUTTON_GRANT_PERMISSIONS')}
                                    </button>
                                )}
                            </div>

                            {hasPermissions && (
                                <div>
                                    <p className='nx-p'>
                                        <strong>2)</strong>{' '}
                                        {ThisBrowser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_POINT_2')}
                                    </p>
                                    <div className='nx-form-row'>
                                        <NxFormGroup label={ThisBrowser.i18n.getMessage('LABEL_USERNAME')} isRequired>
                                            <NxStatefulTextInput
                                                defaultValue={extensionConfigContext.user}
                                                validator={nonEmptyValidator}
                                                onChange={handleIqUserChange}
                                            />
                                        </NxFormGroup>
                                        <NxFormGroup label={ThisBrowser.i18n.getMessage('LABEL_PASSWORD')} isRequired>
                                            <NxStatefulTextInput
                                                defaultValue={extensionConfigContext.token}
                                                validator={nonEmptyValidator}
                                                type='password'
                                                onChange={handleIqTokenChange}
                                            />
                                        </NxFormGroup>
                                        <NxButton variant='primary' onClick={handleLoginCheck}>
                                            {ThisBrowser.i18n.getMessage('OPTIONS_PAGE_SONATYPE_BUTTON_CONNECT_IQ')}
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
                            {hasPermissions && extensionConfigContext.iqAuthenticated === true && (
                                <IQApplicationSelector checkingConnection={checkingConnection} reloadApplications={reloadApplications} />
                            )}
                            {extensionConfigContext.iqAuthenticated === true &&
                                extensionConfigContext.iqApplicationInternalId != undefined &&
                                extensionConfigContext.iqApplicationPublidId != undefined &&
                                hasPermissions && (
                                    <>
                                        <a
                                            href='https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j-core/2.12.1'
                                            target='_blank'
                                            className='nx-btn'
                                            rel='noreferrer'>
                                            Maven {ThisBrowser.i18n.getMessage('EXAMPLE')}{' '}
                                            <NxFontAwesomeIcon icon={faExternalLink as IconDefinition} />
                                        </a>
                                        <a
                                            href='https://www.npmjs.com/package/handlebars/v/4.7.5'
                                            target='_blank'
                                            className='nx-btn'
                                            rel='noreferrer'>
                                            npmjs {ThisBrowser.i18n.getMessage('EXAMPLE')}{' '}
                                            <NxFontAwesomeIcon icon={faExternalLink as IconDefinition} />
                                        </a>
                                        <a
                                            href='https://pypi.org/project/feedparser/6.0.10/'
                                            target='_blank'
                                            className='nx-btn'
                                            rel='noreferrer'>
                                            PyPI {ThisBrowser.i18n.getMessage('EXAMPLE')}{' '}
                                            <NxFontAwesomeIcon icon={faExternalLink as IconDefinition} />
                                        </a>
                                    </>
                                )}

                            {extensionConfigContext.iqAuthenticated === true &&
                                extensionConfigContext.iqApplicationInternalId != undefined &&
                                extensionConfigContext.iqApplicationPublidId != undefined &&
                                hasPermissions && (
                                    <NxStatefulSuccessAlert>
                                        {ThisBrowser.i18n.getMessage('OPTIONS_SUCCESS_MESSAGE')}
                                    </NxStatefulSuccessAlert>
                                )}
                            {extensionConfigContext.iqApplicationInternalId === undefined &&
                                extensionConfigContext.iqApplicationPublidId === undefined &&
                                extensionConfigContext.supportsLifecycle === true &&
                                extensionConfigContext.iqAuthenticated === true &&
                                extensionConfigContext.iqApplications.length > 0 && (
                                    <NxStatefulInfoAlert>
                                        {ThisBrowser.i18n.getMessage('OPTIONS_INFO_MESSAGE_CHOOSE_APPLICATION')}
                                    </NxStatefulInfoAlert>
                                )}
                            {extensionConfigContext.host !== undefined &&
                                extensionConfigContext.user !== undefined &&
                                extensionConfigContext.token !== undefined &&
                                extensionConfigContext.iqAuthenticated === false &&
                                extensionConfigContext.iqLastAuthenticated > 0 &&
                                checkingConnection !== true && (
                                    <NxStatefulErrorAlert>
                                        {ThisBrowser.i18n.getMessage('OPTIONS_ERROR_MESSAGE_UNAUTHENTICATED')}
                                        <br />
                                        <br />
                                        {extensionConfigContext.iqLastError}
                                    </NxStatefulErrorAlert>
                                )}
                        </section>
                    </NxGrid.Row>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
