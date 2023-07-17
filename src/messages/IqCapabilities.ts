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
    ResponseError,
    CompositeSourceControlApi,
    FirewallApi,
    LicenseLegalMetadataApi,
} from '@sonatype/nexus-iq-api-client'
import { logger, LogLevel } from '../logger/Logger'
import { _get_iq_api_configuration } from './IqMessages'

/**
 * This file contains methods for determining the capability of an IQ Server.
 */

export async function determineSupportsFirewall(): Promise<boolean> {
    return _get_iq_api_configuration()
        .then((apiConfig) => {
            return apiConfig
        })
        .catch((err) => {
            throw err
        })
        .then((apiConfig) => {
            logger.logMessage('API Configiration', LogLevel.TRACE, apiConfig)
            const apiClient = new FirewallApi(apiConfig)

            return apiClient
                .getQuarantineSummaryRaw({ credentials: 'omit' })
                .then(() => {
                    return true
                })
                .catch((err: ResponseError) => {
                    if (err.response.status == 402) {
                        return false
                    } else {
                        logger.logMessage(
                            `Unexpected return code when checking Firewall Capability: ${err.response.status}`,
                            LogLevel.WARN
                        )
                        return false
                    }
                })
        })
}

export async function determineSupportsLifecycle(sandboxApplicationId: string): Promise<boolean> {
    return _get_iq_api_configuration()
        .then((apiConfig) => {
            return apiConfig
        })
        .catch((err) => {
            throw err
        })
        .then((apiConfig) => {
            logger.logMessage('API Configiration', LogLevel.TRACE, apiConfig)
            const apiClient = new CompositeSourceControlApi(apiConfig)

            return apiClient
                .getCompositeSourceControlByOwner(
                    {
                        ownerType: 'application',
                        internalOwnerId: sandboxApplicationId,
                    },
                    { credentials: 'omit' }
                )
                .then(() => {
                    return true
                })
                .catch((err: ResponseError) => {
                    if (err.response.status == 402) {
                        return false
                    } else {
                        logger.logMessage(
                            `Unexpected return code when checking Lifecycle Capability: ${err.response.status}`,
                            LogLevel.WARN
                        )
                        return false
                    }
                })
        })
}

export async function determineSupportsLifecycleAlp(): Promise<boolean> {
    return _get_iq_api_configuration()
        .then((apiConfig) => {
            return apiConfig
        })
        .catch((err) => {
            throw err
        })
        .then((apiConfig) => {
            logger.logMessage('API Configiration', LogLevel.TRACE, apiConfig)
            const apiClient = new LicenseLegalMetadataApi(apiConfig)

            return apiClient
                .getAllAttributionReportTemplates({ credentials: 'omit' })
                .then(() => {
                    return true
                })
                .catch((err: ResponseError) => {
                    if (err.response.status == 402) {
                        return false
                    } else {
                        logger.logMessage(
                            `Unexpected return code when checking Lifecycle ALP: ${err.response.status}`,
                            LogLevel.WARN
                        )
                        return false
                    }
                })
        })
}
