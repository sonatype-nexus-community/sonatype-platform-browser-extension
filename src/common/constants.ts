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
export const IQ_VERSION_UNKNOWN = NaN
export const IQ_SANDBOX_APPLICATION_PUBLIC_ID = ''
export const OWNER_TYPE_APPLICATION = 'application'
export const OWNER_TYPE_ORGANIZATION = 'organization'
export const ROOT_ORGANIZATION_ID = 'ROOT_ORGANIZATION_ID'
export const STORAGE_KEY_SETTINGS = 'settings'
export const STORAGE_KEY_TABS = 'tabs'
export const STORAGE_KEY_VULNERABILITIES = 'vulnerabilities'
export const SOLUTION_DEVELOPER = 'developer'
export const SOLUTION_FIREWALL = 'firewall'
export const SOLUTION_LIFECYCLE = 'lifecycle'
export const SOLUTION_SBOM = 'sbom'

export enum ComponentStateType {
    CRITICAL,
    SEVERE,
    MODERATE,
    LOW,
    NONE,
    EVALUATING,
    UNKNOWN,
    INCOMPLETE_CONFIG,
    CLEAR,
}

export enum SIDE_PANEL_MODE {
    COMPONENTS,
    VULNERABILITY
}

export const ThisBrowser = chrome ? chrome : browser