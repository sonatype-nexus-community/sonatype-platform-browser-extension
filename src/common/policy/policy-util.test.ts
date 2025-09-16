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
import { describe, expect, it } from '@jest/globals'
import { ThreatLevelNumber } from '@sonatype/react-shared-components'
import { MATCH_STATE_EXACT, MATCH_STATE_SIMILAR, MATCH_STATE_UNKNOWN } from '../component/constants'
import { PolicyThreatLevelUtil } from './policy-util'

describe('Common : Policy : Policy Util : PolicyThreatLevelUtil.getAnnotationCssClassForThreatLevel', () => {
    it.each([
        {
            name: '10 --> critical (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 10,
            expectedClass: 'sonatype-policy-violation-critical',
        },
        {
            name: '9 --> critical (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 9,
            expectedClass: 'sonatype-policy-violation-critical',
        },
        {
            name: '8 --> critical (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 8,
            expectedClass: 'sonatype-policy-violation-critical',
        },
        {
            name: '7 --> severe (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 7,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '6 --> severe (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 6,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '5 --> severe (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 5,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '4 --> severe (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 4,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '3 --> moderate (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 3,
            expectedClass: 'sonatype-policy-violation-moderate',
        },
        {
            name: '2 --> moderate (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 2,
            expectedClass: 'sonatype-policy-violation-moderate',
        },
        {
            name: '1 --> low (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 1,
            expectedClass: 'sonatype-policy-violation-low',
        },
        {
            name: '0 --> none (exact)',
            matchSate: MATCH_STATE_EXACT,
            threatLevel: 0,
            expectedClass: 'sonatype-policy-violation-none',
        },
        {
            name: '0 --> none (unknown)',
            matchSate: MATCH_STATE_UNKNOWN,
            threatLevel: 0,
            expectedClass: 'sonatype-component-unknown',
        },
        {
            name: '10 --> critical (similar)',
            matchSate: MATCH_STATE_SIMILAR,
            threatLevel: 10,
            expectedClass: 'sonatype-policy-violation-critical',
        },
    ])('$name', ({ matchSate, threatLevel, expectedClass }) => {
        expect(
            PolicyThreatLevelUtil.getAnnotationCssClassForMatchStateAndThreatLevel({
                matchState: matchSate,
                threatLevel: threatLevel as ThreatLevelNumber,
            })
        ).toEqual(expectedClass)
    })
})
