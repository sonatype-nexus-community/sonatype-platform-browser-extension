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
import { DEFAULT_EXTENSION_SETTINGS, ExtensionConfiguration } from "../common/configuration/types"
import { ThisBrowser } from "../common/constants"
import { SonatypeIqError } from "../common/error"
import { logger, LogLevel } from "../common/logger"
import { MessageRequestType, MessageResponseStatus } from "../common/message/constants"
import { lastRuntimeError, sendRuntimeMessage } from "../common/message/helpers"
import { MessageResponseExtensionConfigurationUpdated } from "../common/message/types"

export default class ExtensionConfigurationStateHelper {

    public static extensionConfiguration: ExtensionConfiguration = DEFAULT_EXTENSION_SETTINGS

    private static hasBrowserPermissionToIqHost = false

    public static async doConnectivityAndVersionCheck() {
        const msgResponse = await sendRuntimeMessage({
            messageType: MessageRequestType.CONNECTIVITY_AND_VERSION_CHECK
        }).finally(() => {
            const lastError = lastRuntimeError()
            if (lastError) {
                logger.logReact('Runtime Error in doConnectivityAndVersionCheck', LogLevel.WARN, lastError)
            }
        })
        return msgResponse
    }
    
    /**
     * Returns the IQ URL from Extension Configuraiton ensuring it has a trailing /
     */
    public static getUnifiedIqUrl(): string {
        logger.logReact("ExtensionConfigurationStateHelper.getUnifiedIqUrl", LogLevel.DEBUG, ExtensionConfigurationStateHelper.extensionConfiguration)
        if (ExtensionConfigurationStateHelper.extensionConfiguration?.host !== undefined) {
            if (ExtensionConfigurationStateHelper.extensionConfiguration.host.endsWith('/')) {
                return ExtensionConfigurationStateHelper.extensionConfiguration.host
            } else {
                return `${ExtensionConfigurationStateHelper.extensionConfiguration.host}/`
            }
        }
        return ''
    }

    public static hasAuthenticationError(): boolean {
        return (
            ExtensionConfigurationStateHelper.extensionConfiguration.user !== undefined 
            && ExtensionConfigurationStateHelper.extensionConfiguration.token !== undefined
            && ExtensionConfigurationStateHelper.extensionConfiguration.iqAuthenticated === false
            && ExtensionConfigurationStateHelper.extensionConfiguration.iqLastAuthenticated === 0
        )
    }

    public static hasBrowserPermissionForIqHost(): boolean {
        return ExtensionConfigurationStateHelper.hasBrowserPermissionToIqHost
    }

    public static isAuthenticated(): boolean {
        return ExtensionConfigurationStateHelper.extensionConfiguration.iqAuthenticated
    }

    /**
     * Reflects the UI - is a Host URL configured for IQ Server
     * 
     * @returns boolean
     */
    public static isConfiguredStage1(): boolean {
        return ExtensionConfigurationStateHelper.extensionConfiguration.host !== undefined
    }

    /**
     * Reflects the UI - is a Host URL configured for IQ Server
     * 
     * @returns boolean
     */
    public static isConfiguredStage2(): boolean {
        return (
            ExtensionConfigurationStateHelper.isConfiguredStage1()
            && ExtensionConfigurationStateHelper.extensionConfiguration.iqAuthenticated
        )
    }

    /**
     * Reflects the UI - are credentials and Stage 1 configuration supplied
     * 
     * @returns boolean
     */
    public static isReadyForStage2(): boolean {
        logger.logReact("ExtensionConfigurationStateHelper.isReadyForStage2", LogLevel.DEBUG, ExtensionConfigurationStateHelper.extensionConfiguration)
        return (
            ExtensionConfigurationStateHelper.isConfiguredStage1()
            && ExtensionConfigurationStateHelper.hasBrowserPermissionToIqHost
        )
    }

    /**
     * Reflects the UI - are credentials and Stage 1 configuration supplied
     * 
     * @returns boolean
     */
    public static isReadyForStage3(): boolean {
        return (
            ExtensionConfigurationStateHelper.isConfiguredStage2()
        )
    }

    /**
     * Single place for Options pages to invoke to set updated configuration into stable storage.
     * 
     * @param newExtensionConfig 
     */
    public static async persistExtensionConfiguration(newExtensionConfig: ExtensionConfiguration): Promise<void> {
        logger.logReact(`ExtensionConfigurationStateHelper persistExtensionConfiguration`, LogLevel.DEBUG, newExtensionConfig)
        return await sendRuntimeMessage({
            messageType: MessageRequestType.SET_NEW_EXTENSION_CONFIGURATION,
            newExtensionConfig
        }).then((msgResponse: MessageResponseExtensionConfigurationUpdated) => {
            const lastError = lastRuntimeError()
            if (lastError) {
                logger.logReact('Runtime Error in persistExtensionConfiguration', LogLevel.WARN, lastError)
            }

            if (msgResponse.status === MessageResponseStatus.SUCCESS) {
                ExtensionConfigurationStateHelper.extensionConfiguration = msgResponse.newConfiguration
            } else {
                throw new SonatypeIqError(`Failed to update Extension Configuration: ${msgResponse.status}: ${msgResponse.status_detail}`)
            }
        }).then(ExtensionConfigurationStateHelper.reviewUpdatedExtensionConfiguration)
    }

    public static async requestBrowserPermissionsForIq(): Promise<boolean> {
        if (!ExtensionConfigurationStateHelper.hasBrowserPermissionToIqHost) {
            logger.logReact(`ExtensionConfigurationStateHelper requestBrowserPermissionsForIq`, LogLevel.DEBUG)
            const granted = await ThisBrowser.permissions.request({
                origins: [ExtensionConfigurationStateHelper.getUnifiedIqUrl()]
            }).then((granted) => {
                const lastError = lastRuntimeError()
                if (lastError) {
                    logger.logReact('Runtime Error in requestBrowserPermissionsForIq', LogLevel.WARN, lastError)
                }
                return granted
            })
            ExtensionConfigurationStateHelper.hasBrowserPermissionToIqHost = granted
            return granted
        }
        return Promise.resolve(ExtensionConfigurationStateHelper.hasBrowserPermissionForIqHost())
    }

    public static async reviewUpdatedExtensionConfiguration() {
        logger.logReact("ExtensionConfigurationStateHelper.reviewUpdatedExtensionConfiguration", LogLevel.DEBUG)
        if (ExtensionConfigurationStateHelper.getUnifiedIqUrl() != '') {
            await ThisBrowser.permissions.contains({
                origins: [ExtensionConfigurationStateHelper.getUnifiedIqUrl()],
            }).then((result: boolean) => {
                const lastError = lastRuntimeError()
                if (lastError) {
                    logger.logReact('Runtime Error in reviewUpdatedExtensionConfiguration', LogLevel.WARN, lastError)
                }

                logger.logReact("ExtensionConfigurationStateHelper.reviewUpdatedExtensionConfiguration: hasBrowserPermissionToIqHost", LogLevel.DEBUG, result)
                ExtensionConfigurationStateHelper.hasBrowserPermissionToIqHost = result
            })
        }
    }
}