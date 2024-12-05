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
    Configuration,
    ApplicationsApi,
    ComponentsApi,
    PolicyEvaluationApi,
    ResponseError,
    GetSuggestedRemediationForComponentOwnerTypeEnum,
    LicenseLegalMetadataApi,
    GetLicenseLegalComponentReportOwnerTypeEnum,
    ApiComponentOrPurlIdentifierDTOV2,
    ApiComponentEvaluationResultDTOV2,
} from '@sonatype/nexus-iq-api-client'
import { logger, LogLevel } from '../logger/Logger'
import { readExtensionConfiguration } from '../messages/SettingsMessages'
import { ExtensionConfiguration } from '../types/ExtensionConfiguration'
import { GeneralConnectivityError, IncompleteConfigurationError, InvalidConfigurationError, UserAuthenticationError } from '../error/ExtensionError'
import { MessageRequest, MessageResponse, MESSAGE_RESPONSE_STATUS, MessageRequestGetAllComponentVersions, MessageResponseGetRemediationDetailsForComponent } from '../types/Message'
import { DATA_SOURCE, FORMATS } from '../utils/Constants'
import { UserAgentHelper } from '../utils/UserAgentHelper'
import { PackageURL } from 'packageurl-js'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome || browser

export async function requestComponentEvaluationByPurls(request: MessageRequest): Promise<MessageResponse> {
    return readExtensionConfiguration()
        .then((response) => {
            return response.data as ExtensionConfiguration
        })
        .then((extensionConfig) => {
            return _get_iq_api_configuration()
                .then((apiConfig) => {
                    return apiConfig
                })
                .catch((err) => {
                    throw err
                })
                .then((apiConfig) => {
                    logger.logMessage('API Configiration', LogLevel.INFO, apiConfig)
                    const applicationId = extensionConfig.iqApplicationInternalId ?? 'UNKNOWN'
                    const apiClient = new PolicyEvaluationApi(apiConfig)

                    // @typescript-eslint/strict-boolean-expressions:
                    let purls: Array<string> = []
                    if (request.params && 'purls' in request.params) {
                        purls = request.params['purls'] as Array<string>
                    }

                    return apiClient
                        .evaluateComponents(
                            {
                                applicationId: applicationId,
                                apiComponentEvaluationRequestDTOV2: {
                                    components: purls.map((purl) => {
                                        return { packageUrl: purl }
                                    }),
                                },
                            },
                            { credentials: 'omit' }
                        )
                        .then((evaluateRequestResponse) => {
                            logger.logMessage(
                                'Response from evaluateComponents',
                                LogLevel.INFO,
                                evaluateRequestResponse
                            )
                            return {
                                status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                                data: evaluateRequestResponse,
                            }
                        })
                        .catch(_handle_iq_error_repsonse)
                })
        })
}

export function pollForComponentEvaluationResult(applicationId: string, resultId: string, time: number) {
    let polling = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rejectThis: (reject: any) => void

    const stopPolling = () => {
        if (polling) {
            logger.logMessage('Polling was already stopped...', LogLevel.DEBUG)
        } else {
            logger.logMessage('Stopping polling...', LogLevel.DEBUG)
            polling = false
            rejectThis(new Error('Polling cancelled'))
        }
    }

    const promise: Promise<ApiComponentEvaluationResultDTOV2> = new Promise((resolve, reject) => {
        polling = true
        rejectThis = reject

        const executePoll = async () => {
            try {
                const apiConfig = await _get_iq_api_configuration()
                const apiClient = new PolicyEvaluationApi(apiConfig)
                const result = await apiClient.getComponentEvaluation(
                    {
                        applicationId: applicationId,
                        resultId: resultId,
                    },
                    { credentials: 'omit' }
                )

                if (polling && result.results) {
                    polling = false
                    resolve(result)
                } else {
                    setTimeout(executePoll, time)
                }
            } catch (error) {
                if (error instanceof ResponseError && error.response.status == 404) {
                    // Continue polling
                    logger.logMessage(`ResultId ${resultId} not ready (404). Continuing to poll...`, LogLevel.INFO)
                    setTimeout(executePoll, time)
                } else {
                    polling = false
                    reject(new Error('Polling cancelled due to API error'))
                }
            }
        }

        setTimeout(executePoll, time)
    })

    return { promise, stopPolling }
}

export async function getAllComponentVersions(request: MessageRequestGetAllComponentVersions): Promise<MessageResponse> {
    return _get_iq_api_configuration()
        .then((apiConfig) => {
            return apiConfig
        })
        .catch((err) => {
            throw err
        })
        .then((apiConfig) => {
            logger.logMessage('Making API Call ComponentsApi::getComponentVersions()', LogLevel.DEBUG, apiConfig)
            const apiClient = new ComponentsApi(apiConfig)

            const payloadPurl = PackageURL.fromString(request.params.purl)
            const payload: ApiComponentOrPurlIdentifierDTOV2 = {
                packageUrl: request.params.purl
            }
            if (payloadPurl.type == FORMATS.pypi) {
                // Fix for #112 where qualifiers of source distributions can vary over time for a Python Project
                payloadPurl.qualifiers = {}
                payload.packageUrl = payloadPurl.toString()
            }

            return apiClient
                .getComponentVersions(
                    { apiComponentOrPurlIdentifierDTOV2: payload },
                    { credentials: 'omit' }
                )
                .then((componentVersions) => {
                    return {
                        status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                        data: {
                            versions: componentVersions,
                        },
                    }
                })
                .catch(_handle_iq_error_repsonse)
        })
}

export async function getApplications(): Promise<MessageResponse> {
    return _get_iq_api_configuration()
        .then((apiConfig) => {
            return apiConfig
        })
        .catch((err) => {
            throw err
        })
        .then((apiConfig) => {
            logger.logMessage('API Configiration', LogLevel.INFO, apiConfig)
            const apiClient = new ApplicationsApi(apiConfig)

            return apiClient
                .getApplications({})
                .then((applications) => {
                    return {
                        status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                        data: applications,
                    }
                })
                .catch(_handle_iq_error_repsonse)
        })
}

export async function getComponentDetails(request: MessageRequest): Promise<MessageResponse> {
    return _get_iq_api_configuration()
        .then((apiConfig) => {
            return apiConfig
        })
        .catch((err) => {
            throw err
        })
        .then((apiConfig) => {
            logger.logMessage('Making API Call ComponentsApi::getComponentDetails()', LogLevel.DEBUG, apiConfig)
            const apiClient = new ComponentsApi(apiConfig)

            // @typescript-eslint/strict-boolean-expressions:
            let purls: Array<string> = []
            if (request.params && 'purls' in request.params) {
                purls = request.params['purls'] as Array<string>
            }
            logger.logMessage('Making API Call ComponentsApi::getComponentDetails() sending purls: ', LogLevel.DEBUG, purls)
            return apiClient
                .getComponentDetails(
                    {
                        apiComponentDetailsRequestDTOV2: {
                            components: purls.map((purl) => {
                                return { packageUrl: purl }
                            }),
                        },
                    },
                    { credentials: 'omit' }
                )
                .then((componentDetailsResponse) => {
                    logger.logMessage('getComponentDetails response', LogLevel.DEBUG, componentDetailsResponse)
                    return {
                        status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                        data: componentDetailsResponse,
                    }
                })
                .catch(_handle_iq_error_repsonse)
        })
}

export async function getComponentLegalDetails(request: MessageRequest): Promise<MessageResponse> {
    return readExtensionConfiguration()
        .then((response) => {
            return response.data as ExtensionConfiguration
        })
        .then((extensionConfig) => {
            return _get_iq_api_configuration()
                .then((apiConfig) => {
                    return apiConfig
                })
                .catch((err) => {
                    throw err
                })
                .then((apiConfig) => {
                    logger.logMessage(
                        'Making API Call LicenseLegalMetadataApi::getLicenseLegalComponentReport()',
                        LogLevel.DEBUG,
                        apiConfig
                    )
                    const apiClient = new LicenseLegalMetadataApi(apiConfig)

                    return apiClient
                        .getLicenseLegalComponentReport(
                            {
                                ownerType: GetLicenseLegalComponentReportOwnerTypeEnum.Application,
                                ownerId:
                                    extensionConfig.iqApplicationPublidId !== undefined
                                        ? extensionConfig.iqApplicationPublidId
                                        : '',
                                packageUrl: (request.params !== undefined && 'purl' in request.params
                                    ? request.params.purl
                                    : '') as string,
                            },
                            { credentials: 'omit' }
                        )
                        .then((componentLegalDetailsResponse) => {
                            logger.logMessage(
                                'getComponentLegalDetails response',
                                LogLevel.DEBUG,
                                componentLegalDetailsResponse
                            )
                            return {
                                status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                                data: {
                                    componentLegalDetails: componentLegalDetailsResponse,
                                },
                            }
                        })
                        .catch(_handle_iq_error_repsonse)
                })
        })
}

export async function getRemediationDetailsForComponent(request: MessageRequest): Promise<MessageResponseGetRemediationDetailsForComponent> {
    return readExtensionConfiguration()
        .then((response) => {
            return response.data as ExtensionConfiguration
        })
        .then((extensionConfig) => {
            return _get_iq_api_configuration()
                .then((apiConfig) => {
                    return apiConfig
                })
                .catch((err) => {
                    throw err
                })
                .then((apiConfig) => {
                    logger.logMessage(
                        'Making API Call ComponentsApi::getSuggestedRemediationForComponent()',
                        LogLevel.DEBUG,
                        apiConfig
                    )
                    const apiClient = new ComponentsApi(apiConfig)

                    return apiClient
                        .getSuggestedRemediationForComponent(
                            {
                                ownerType: GetSuggestedRemediationForComponentOwnerTypeEnum.Application,
                                ownerId:
                                    extensionConfig.iqApplicationInternalId !== undefined
                                        ? extensionConfig.iqApplicationInternalId
                                        : '',
                                apiComponentDTOV2: {
                                    packageUrl: (request.params !== undefined && 'purl' in request.params
                                        ? request.params.purl
                                        : '') as string,
                                },
                            },
                            { credentials: 'omit' }
                        )
                        .then((remediationDetailsResponse) => {
                            logger.logMessage(
                                'getSuggestedRemediationForComponent response',
                                LogLevel.DEBUG,
                                remediationDetailsResponse
                            )
                            return {
                                status: MESSAGE_RESPONSE_STATUS.SUCCESS,
                                data: remediationDetailsResponse.remediation,
                            }
                        })
                        .catch(_handle_iq_error_repsonse)
                })
        })
}

export async function _get_iq_api_configuration(): Promise<Configuration> {
    return readExtensionConfiguration()
        .then((response) => {
            if (response !== undefined && response.status == MESSAGE_RESPONSE_STATUS.SUCCESS) {
                const settings = response.data as ExtensionConfiguration
                if (settings.dataSource !== DATA_SOURCE.NEXUSIQ) {
                    logger.logMessage(
                        `Attempt to get connection configuration for ${DATA_SOURCE.NEXUSIQ}, but DATA_SOURCE is ${settings.dataSource}`,
                        LogLevel.ERROR,
                        settings
                    )
                    throw new InvalidConfigurationError(
                        'Attempt to get connection configuration for Sonatype IQ Server, but DATA_SOURCE is not NEXUSIQ'
                    )
                }

                if (settings.host === undefined) {
                    logger.logMessage('Host is not set for IQ Server', LogLevel.WARN)
                    throw new IncompleteConfigurationError('Host is not set for IQ Server')
                }
                if (settings.user === undefined) {
                    logger.logMessage('User is not set for IQ Server', LogLevel.WARN)
                    throw new IncompleteConfigurationError('User is not set for IQ Server')
                }
                if (settings.token === undefined) {
                    logger.logMessage('Token is not set for IQ Server', LogLevel.WARN)
                    throw new IncompleteConfigurationError('Token is not set for IQ Server')
                }

                return new Configuration({
                    basePath: settings.host.endsWith('/') ? settings.host.slice(0, -1) : settings.host,
                    username: settings.user,
                    password: settings.token,
                    headers: {
                        'User-Agent': UserAgentHelper.getUserAgent(),
                        'X-User-Agent': UserAgentHelper.getUserAgent(),
                    },
                })
            } else {
                throw new IncompleteConfigurationError(_browser.i18n.getMessage('INVALID_CONFIGURATION_DEFAULT'))
            }
        })
        .catch((err) => {
            throw err
        })
}

function _handle_iq_error_repsonse(err) {
    logger.logMessage(`Handling Error Response from IQ ${err}`, LogLevel.WARN)
    if (err instanceof ResponseError) {
        logger.logMessage(`   IQ Error: ${err.response.status}: ${err.response.statusText}`, LogLevel.WARN)
        if (err.response.status > 400 && err.response.status < 404) {
            return Promise.reject(new UserAuthenticationError('User credentials invalid'))
        } else {
            return Promise.reject(new GeneralConnectivityError(`${err.response.status}: ${err.message}`))
        }
    }
    return Promise.reject(new GeneralConnectivityError(`${err}`))
}
