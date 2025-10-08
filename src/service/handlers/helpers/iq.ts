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
import { ApiComponentEvaluationResultDTOV2, ApiComponentEvaluationTicketDTOV2, ApiComponentOrPurlIdentifierDTOV2, ApplicationsApi, ComponentsApi, CompositeSourceControlApi, Configuration, FirewallApi, GetSuggestedRemediationForComponent200Response, GetSuggestedRemediationForComponentOwnerTypeEnum, LicenseLegalMetadataTemplateApi, PolicyEvaluationApi, ResponseError, SolutionsApi, UserTokensApi, VulnerabilityDetailsApi } from "@sonatype/nexus-iq-api-client"
import { PackageURL } from "packageurl-js"
import { ExtensionConfigurationState } from "../../../common/configuration/extension-configuration"
import { DEFAULT_SONATYPE_SOLUTION_SUPPORT, SonatypeSolutionSupport } from "../../../common/configuration/types"
import { IQ_VERSION_UNKNOWN, OWNER_TYPE_ORGANIZATION, ROOT_ORGANIZATION_ID, SOLUTION_FIREWALL, SOLUTION_LIFECYCLE, ThisBrowser } from "../../../common/constants"
import { GeneralConnectivityError, IncompleteConfigurationError, SonatypeIqError, UserAuthenticationError } from "../../../common/error"
import { logger, LogLevel } from "../../../common/logger"
import { MessageResponseStatus } from "../../../common/message/constants"
import { MessageResponseIqConnectivityAndVersionCheck, MessageResponseLoadApplications, MessageResponseLoadComponentVersions, MessageResponseLoadVulnerability } from "../../../common/message/types"

const extensionManifest = ThisBrowser.runtime.getManifest()

export class IqMessageHelper {

    public constructor(private readonly extensionConfigState: ExtensionConfigurationState) { }

    public async checkConnectivityAndDetermineIqVersion(): Promise<MessageResponseIqConnectivityAndVersionCheck> {
        try {
            const tokenCheck = await new UserTokensApi(this.getApiConfiguration()).getUserTokenExistsForCurrentUserRaw()
            const serverHeader = tokenCheck.raw.headers.get('server')
            const iqVersion = this.parseServerHeader(serverHeader || '')
            const iqCapabilities = await this.determineIqCapabilities(iqVersion)
            return {
                "status": MessageResponseStatus.SUCCESS,
                "iqAuthenticated": true,
                "iqLastAuthenticated": new Date(),
                "iqLastError": undefined,
                "iqVersion": iqVersion,
                "supportsFirewall": iqCapabilities.supportsFirewall,
                "supportsLifecycle": iqCapabilities.supportsLifecycle,
                "supportsLifecycleAlp": iqCapabilities.supportsLifecycleAlp
            }
        } catch (err) {
            if (err instanceof ResponseError) {
                const responseBody = await err.response.blob()
                switch (err.response.status) {
                    case 401:
                    case 402:
                    case 403:
                        return {
                            "status": MessageResponseStatus.AUTH_ERROR,
                            "iqAuthenticated": false,
                            "iqLastAuthenticated": new Date(),
                            "iqLastError": `${err.message}: [${err.response.status}] ${await responseBody.text()}`,
                            "iqVersion": IQ_VERSION_UNKNOWN,
                            ...DEFAULT_SONATYPE_SOLUTION_SUPPORT
                        }
                }
                
            }
            return {
                "status": MessageResponseStatus.FAILURE,
                "status_error": err,
                "iqAuthenticated": false,
                "iqLastError": err.message,
                "iqLastAuthenticated": new Date(0),
                "iqVersion": IQ_VERSION_UNKNOWN,
                ...DEFAULT_SONATYPE_SOLUTION_SUPPORT
            }
        }
    }

    public async determineIqCapabilities(iqVersion: number): Promise<SonatypeSolutionSupport> {
        logger.logServiceWorker("Determining IQ capabilities", LogLevel.DEBUG)
        const sonatypeSolutionSupport = { ...DEFAULT_SONATYPE_SOLUTION_SUPPORT }
        if (iqVersion >= 192) {
            // New API available since IQ 192
            const licensedSolutions = await new SolutionsApi(this.getApiConfiguration()).getLicensedSolutions({allowRelativeUrls: true})
            for (const i of licensedSolutions) {
                switch (i.id) {
                    case SOLUTION_FIREWALL:
                        sonatypeSolutionSupport.supportsFirewall = true
                        break
                    case SOLUTION_LIFECYCLE:
                        sonatypeSolutionSupport.supportsLifecycle = true
                        break
                }
            }
        } else {
            // Old capability detection
            sonatypeSolutionSupport.supportsFirewall = await this.detectFirewallSupport()
            sonatypeSolutionSupport.supportsLifecycle = await this.detectLifecycleSupport()
        }

        // Detect ALP
        sonatypeSolutionSupport.supportsLifecycleAlp = await this.detectLifecycleAlpSupport()

        logger.logServiceWorker("Determined IQ capabilities", LogLevel.DEBUG, sonatypeSolutionSupport)
        return sonatypeSolutionSupport
    }

    private async detectFirewallSupport(): Promise<boolean> {
        try {
            await new FirewallApi(this.getApiConfiguration()).getQuarantineSummaryRaw({ credentials: 'omit' })
            return true
        } catch (err) {
            logger.logServiceWorker("detectFirewallSupport check failed", LogLevel.DEBUG, err)
            return false
        }
    }

    private async detectLifecycleSupport(): Promise<boolean> {
        try {
            await new CompositeSourceControlApi(this.getApiConfiguration()).getCompositeSourceControlByOwner({
                        ownerType: OWNER_TYPE_ORGANIZATION,
                        internalOwnerId: ROOT_ORGANIZATION_ID,
                    },
                    { credentials: 'omit' })
            return true
        } catch (err) {
            logger.logServiceWorker("detectLifecycleSupport check failed", LogLevel.DEBUG, err)
            return false
        }
    }

    private async detectLifecycleAlpSupport(): Promise<boolean> {
        try {
            await new LicenseLegalMetadataTemplateApi(this.getApiConfiguration()).getAllAttributionReportTemplates({ credentials: 'omit' })
            return true
        } catch (err) {
            logger.logServiceWorker("detectLifecycleAlpSupport check failed", LogLevel.DEBUG, err)
            return false
        }
    }

    public async evaluateComponents(componentPurls: Array<string>): Promise<ApiComponentEvaluationResultDTOV2> {
        return this.submitComponentsEvaluation(componentPurls).then((evaluationTicket) => {
            const { promise } = this.pollForComponentsEvaluationResult(
                evaluationTicket.applicationId || '',
                evaluationTicket.resultId || '',
                1000
            )
            return promise
        }).catch((err: Error) => {
            throw err
        })
    }

    private async submitComponentsEvaluation(componentPurls: Array<string>): Promise<ApiComponentEvaluationTicketDTOV2> {
        try {
            return await new PolicyEvaluationApi(this.getApiConfiguration()).evaluateComponents({
                applicationId: this.extensionConfigState.getExtensionConfig().iqApplicationInternalId || '',
                apiComponentEvaluationRequestDTOV2: {
                    components: componentPurls.map((purl) => {
                        const p = PackageURL.fromString(purl)
                        if (p.type === 'golang') {
                            return {
                                componentIdentifier: {
                                    format: "golang",
                                    coordinates: {
                                        name: p.namespace + '/' + p.name,
                                        version: p.version as string
                                    }
                                }
                            }
                        } else {
                            return { packageUrl: purl }
                        }
                    })
                }
            }, { credentials: 'omit' })
        } catch (err) {
            throw this.handleIqError(err)
        }
    }

    private readonly pollForComponentsEvaluationResult = (applicationId: string, resultId: string, pollIntervalSeconds: number): {
        promise: Promise<ApiComponentEvaluationResultDTOV2>;
        stopPolling: () => void;
    } => {
        let polling = false
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let rejectThis: (reject: any) => void

        const stopPolling = () => {
            if (polling) {
                logger.logServiceWorker('Polling was already stopped...', LogLevel.DEBUG)
            } else {
                logger.logServiceWorker('Stopping polling...', LogLevel.DEBUG)
                polling = false
                rejectThis(new Error('Polling cancelled'))
            }
        }

        const promise: Promise<ApiComponentEvaluationResultDTOV2> = new Promise((resolve, reject) => {
            polling = true
            rejectThis = reject

            const executePoll = async () => {
                try {
                    const result = await new PolicyEvaluationApi(this.getApiConfiguration()).getComponentEvaluation(
                        {
                            applicationId: applicationId,
                            resultId: resultId,
                        },
                        { credentials: 'omit' }
                    )

                    if (polling && result.isError) {
                        reject(new SonatypeIqError(result.errorMessage as string))
                    }

                    if (polling && result.results) {
                        polling = false
                        resolve(result)
                    } else {
                        setTimeout(executePoll, pollIntervalSeconds)
                    }
                } catch (error) {
                    if (error instanceof ResponseError && error.response.status == 404) {
                        // Continue polling
                        logger.logServiceWorker(`ResultId ${resultId} not ready (404). Continuing to poll...`, LogLevel.INFO)
                        setTimeout(executePoll, pollIntervalSeconds)
                    } else {
                        polling = false
                        reject(new Error('Polling cancelled due to API error'))
                    }
                }
            }

            setTimeout(executePoll, pollIntervalSeconds)
        })

        return { promise, stopPolling }
    }

    public async getComponentRemediationDetails(componentPurlString: string): Promise<GetSuggestedRemediationForComponent200Response> {
        try {
            return await new ComponentsApi(this.getApiConfiguration()).getSuggestedRemediationForComponent(
                {
                    ownerId: this.extensionConfigState.getExtensionConfig().iqApplicationInternalId as string,
                    ownerType: GetSuggestedRemediationForComponentOwnerTypeEnum.Application,
                    apiComponentDTOV2: {
                        packageUrl: componentPurlString
                    }
                }, { credentials: 'omit' }
            )
        } catch (err) {
             throw this.handleIqError(err)
        }
    }

    public async getComponentVersions(componentIdentifier: ApiComponentOrPurlIdentifierDTOV2): Promise<Array<string>> {
        try {
            return await new ComponentsApi(this.getApiConfiguration()).getComponentVersions(
                {
                    apiComponentOrPurlIdentifierDTOV2: componentIdentifier
                }, { credentials: 'omit' }
            )
        } catch (err) {
            throw this.handleIqError(err)
        }
    }

    public async getApplications(): Promise<MessageResponseLoadApplications> {
        try {
            const applications = await new ApplicationsApi(this.getApiConfiguration()).getApplications()
            return {
                "status": MessageResponseStatus.SUCCESS,
                "applications": applications.applications ?? []
            }
        } catch (err) {
            return {
                "status": MessageResponseStatus.FAILURE,
                "status_error": err,
                "applications": []
            }
        }
    }

    public async getVulnerability(vulnerabilityReference: string): Promise<MessageResponseLoadVulnerability> {
        try {
            const vulnerability = await new VulnerabilityDetailsApi(this.getApiConfiguration()).getSecurityVulnerabilityDetails({
                refId: vulnerabilityReference
            })
            return {
                "status": MessageResponseStatus.SUCCESS,
                "vulnerability": vulnerability
            }
        } catch (err) {
            return {
                "status": MessageResponseStatus.FAILURE,
                "status_error": err,
                "vulnerability": undefined
            }
        }
    }

    protected getApiConfiguration(): Configuration {
        if (this.extensionConfigState.getExtensionConfig().host === undefined) {
            logger.logServiceWorker('Host is not set for IQ Server', LogLevel.WARN)
            throw new IncompleteConfigurationError('Host is not set for IQ Server')
        }
        if (this.extensionConfigState.getExtensionConfig().user === undefined) {
            logger.logServiceWorker('User is not set for IQ Server', LogLevel.WARN)
            throw new IncompleteConfigurationError('User is not set for IQ Server')
        }
        if (this.extensionConfigState.getExtensionConfig().token === undefined) {
            logger.logServiceWorker('Token is not set for IQ Server', LogLevel.WARN)
            throw new IncompleteConfigurationError('Token is not set for IQ Server')
        }

        const host = this.extensionConfigState.getExtensionConfig().host ?? '';
        return new Configuration({
            basePath: host.endsWith('/') ? host.slice(0, -1) : host,
            username: this.extensionConfigState.getExtensionConfig().user ?? '',
            password: this.extensionConfigState.getExtensionConfig().token ?? '',
            headers: {
                'User-Agent': this.getUserAgent(),
                'X-User-Agent': this.getUserAgent(),
            },
        })
    }

    protected getUserAgent(): string {
        return `sonatype_platform_browser_extension/${extensionManifest.version}`
    }

    protected parseServerHeader(serverHeader: string): number {
        const match = /^NexusIQ\/1\.(?<iqVersion>\d+)\..*$/.exec(serverHeader)
        const iqVersion = match?.groups?.iqVersion
        return iqVersion ? Number(iqVersion) : Number.NaN
    }

    private readonly handleIqError = (err: Error): Error =>  {
        logger.logServiceWorker("Handling Error from Sonatype IQ", LogLevel.DEBUG, err)
        if (err instanceof ResponseError) {
            if (err.response.status > 400 && err.response.status < 404) {
                return new UserAuthenticationError('Sonatype user credentials invalid')
            } else {
                return new GeneralConnectivityError(`${err.response.status}: ${err.message}`)
            }
        }
        return err
    }
}