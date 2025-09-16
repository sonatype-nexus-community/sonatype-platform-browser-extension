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
import { ApiComponentDetailsDTOV2 } from '@sonatype/nexus-iq-api-client'
import { MATCH_STATE_UNKNOWN } from '../component/constants'
import { PurlWithThreatLevelAndMatchState } from '../message/types'

export interface PolicyThreatLevelSummary {
    criticalCount: number
    severeCount: number
    moderateCount: number
    lowCount: number
}

export class PolicyThreatLevelUtil {
    public static getAnnotationCssClassForMatchStateAndThreatLevel(
        purlMatchAndThreat: PurlWithThreatLevelAndMatchState
    ): string {
        if (purlMatchAndThreat.matchState !== MATCH_STATE_UNKNOWN) {
            return `sonatype-policy-violation-${categoryByPolicyThreatLevel[purlMatchAndThreat.threatLevel]}`
        }
        return `sonatype-component-${purlMatchAndThreat.matchState}`
    }

    public static getColorForThreatLevel(threatLevel: number): string {
        switch (categoryByPolicyThreatLevel[threatLevel]) {
            case 'critical':
                return '#cc0129'
            case 'severe':
                return '#ff8300'
            default:
                return '#02b3fe'
        }
    }

    public static getColourForComponentsUnknown(): string {
        return '#7034ee'
    }

    public static getIconForThreatLevel(threatLevel: number): string {
        return `/images/alert-${categoryByPolicyThreatLevel[threatLevel]}.png`
    }

    public static getIconForComponentsUnknown(): string {
        return `/images/alert-unknown.png`
    }

    public static getThreatLevelSummary(component: ApiComponentDetailsDTOV2): PolicyThreatLevelSummary {
        const ptls = {
            criticalCount: 0,
            severeCount: 0,
            moderateCount: 0,
            lowCount: 0,
        }

        component.policyData?.policyViolations?.forEach((pv) => {
            switch (categoryByPolicyThreatLevel[pv.threatLevel as number]) {
                case 'critical':
                    ptls.criticalCount++
                    break
                case 'severe':
                    ptls.severeCount++
                    break
                case 'moderate':
                    ptls.moderateCount++
                    break
                case 'low':
                    ptls.lowCount++
                    break
            }
        })

        return ptls
    }
}

/**
 * All Possible Policy Threat Level Categories
 */
export const allThreatLevelCategories = ['unspecified', 'none', 'low', 'moderate', 'severe', 'critical'] as const

/**
 * All Possible Policy Threat Levels
 */
export const allThreatLevelNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

/**
 * The type containing only the possible ThreatLevelCategory values
 */
export type ThreatLevelCategory = (typeof allThreatLevelCategories)[number]

/**
 * The type containing only the possible ThreatLevelNumber values
 */
export type ThreatLevelNumber = (typeof allThreatLevelNumbers)[number]

type ThreatLevelCategoryLookup = {
    readonly [idx in ThreatLevelNumber]: ThreatLevelCategory
}

/**
 * A lookup array used for mapping ThreatLevelNumbers to ThreatLevelCategories. Indexing into this array using a
 * given ThreatLevelNumber will result in the ThreatLevelCategory to which that number belongs.
 */
export const categoryByPolicyThreatLevel: ThreatLevelCategoryLookup = [
    'none',
    'low',
    'moderate',
    'moderate',
    'severe',
    'severe',
    'severe',
    'severe',
    'critical',
    'critical',
    'critical',
] as const

Object.freeze(allThreatLevelCategories)
Object.freeze(allThreatLevelNumbers)
Object.freeze(categoryByPolicyThreatLevel)
