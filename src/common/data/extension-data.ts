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
import { logger, LogLevel } from "../logger"
import { ExtensionTabsData, ExtensionVulnerabilitiesData } from "./types"

// This is used by Service Worker only

export class ExtensionDataState {

    constructor(public tabsData: ExtensionTabsData, public vulnerabilityData: ExtensionVulnerabilitiesData) { 
        logger.logServiceWorker("Loaded ExtensionDataState", LogLevel.DEBUG)
    }

    public getMaxThreatLevel = (tabId: number): number => {
        let maxThreatLevel = 0
        for (const k of Object.keys(this.tabsData.tabs[tabId].components)) {
            const componentThreatLevel = this.getMaxThreatLevelForComponent(tabId, k)
            maxThreatLevel = (componentThreatLevel > maxThreatLevel) ? componentThreatLevel : maxThreatLevel
        }
        return maxThreatLevel
    }

    public getMaxThreatLevelForComponent = (tabId: number, purl: string): number => {
        let maxThreatLevel = 0
        const component = this.tabsData.tabs[tabId].components[purl]
        component.componentDetails?.policyData?.policyViolations?.forEach((pv) => {                
            maxThreatLevel = (pv.threatLevel || 0) > maxThreatLevel ? pv.threatLevel as number : maxThreatLevel
        })
        return maxThreatLevel
    }

    public getPolicyViolationCount = (tabId: number): number => {
        let count = 0
        for (const k of Object.keys(this.tabsData.tabs[tabId].components)) {
            const component = this.tabsData.tabs[tabId].components[k]
            count += component.componentDetails?.policyData?.policyViolations?.length || 0
        }
        return count
    }
}