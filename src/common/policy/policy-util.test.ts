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
import { PolicyThreatLevelUtil } from './policy-util'

describe('Common : Policy : Policy Util : PolicyThreatLevelUtil.getAnnotationCssClassForThreatLevel', () => {
    
    it.each([
        {
            name: '10 --> critical',
            threatLevel: 10,
            expectedClass: 'sonatype-policy-violation-critical',
        },
        {
            name: '9 --> critical',
            threatLevel: 9,
            expectedClass: 'sonatype-policy-violation-critical',
        },
        {
            name: '8 --> critical',
            threatLevel: 8,
            expectedClass: 'sonatype-policy-violation-critical',
        },
        {
            name: '7 --> severe',
            threatLevel: 7,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '6 --> severe',
            threatLevel: 6,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '5 --> severe',
            threatLevel: 5,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '4 --> severe',
            threatLevel: 4,
            expectedClass: 'sonatype-policy-violation-severe',
        },
        {
            name: '3 --> moderate',
            threatLevel: 3,
            expectedClass: 'sonatype-policy-violation-moderate',
        },
        {
            name: '2 --> moderate',
            threatLevel: 2,
            expectedClass: 'sonatype-policy-violation-moderate',
        },
        {
            name: '1 --> low',
            threatLevel: 1,
            expectedClass: 'sonatype-policy-violation-low',
        },
        {
            name: '0 --> none',
            threatLevel: 0,
            expectedClass: 'sonatype-policy-violation-none',
        },
    ])('$name', ({ threatLevel, expectedClass }) => { 
        expect(PolicyThreatLevelUtil.getAnnotationCssClassForThreatLevel(threatLevel)).toEqual(expectedClass)
    })
})