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
import { ApiApplicationDTO } from "@sonatype/nexus-iq-api-client"
import { LogLevel } from "../logger"

export interface SonatypeNexusRepostitoryHost {
    id: string
    url: string
    version: string
}

export enum ExternalRepositoryManagerType {
    UNKNOWN,
    NXRM3
}

export enum ExternalRepositoryManagerStatus {
    REQEUESTED,
    READY,
    BROKEN,
}

export interface ExternalRepositoryManager {
    id: string
    type: ExternalRepositoryManagerType,
    status: ExternalRepositoryManagerStatus,
    url: string
    version: string
}

export interface SonatypeSolutionSupport {
    supportsFirewall: boolean
    supportsLifecycle: boolean
    supportsLifecycleAlp: boolean
}

export const DEFAULT_SONATYPE_SOLUTION_SUPPORT = {
    supportsFirewall: false,
    supportsLifecycle: false,
    supportsLifecycleAlp: false,
}

export interface ExtensionConfiguration extends SonatypeSolutionSupport {
    host?: string
    user?: string
    token?: string
    iqApplicationInternalId?: string
    iqApplicationPublidId?: string
    logLevel: LogLevel
    iqApplications: Array<ApiApplicationDTO>
    iqAuthenticated: boolean
    iqLastError: string | undefined
    iqLastAuthenticated: number
    iqVersion: number
    enableNotifications: boolean
    enablePageAnnotations: boolean
    // Keyed on canonical URL with trailing slash
    externalRepositoryManagers: { [key: string]: ExternalRepositoryManager }
}

export const DEFAULT_EXTENSION_SETTINGS: ExtensionConfiguration = {
    logLevel: LogLevel.TRACE,
    supportsFirewall: false,
    supportsLifecycle: false,
    supportsLifecycleAlp: false,
    iqApplications: [],
    iqAuthenticated: false,
    iqLastError: undefined,
    iqLastAuthenticated: 0,
    iqVersion: NaN,
    enableNotifications: true,
    enablePageAnnotations: true,
    externalRepositoryManagers: {}
}
