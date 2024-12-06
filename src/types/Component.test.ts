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
import { ComponentState, ComponentStateUtil } from './Component'

describe('ComponentStateUtil', () => { 
    it.each([
        {
            state: ComponentState.CRITICAL,
            cssClass: 'sonatype-iq-extension-vuln-critical'
        },
        {
            state: ComponentState.SEVERE,
            cssClass: 'sonatype-iq-extension-vuln-severe'
        },
        {
            state: ComponentState.MODERATE,
            cssClass: 'sonatype-iq-extension-vuln-moderate'
        },
        {
            state: ComponentState.LOW,
            cssClass: 'sonatype-iq-extension-vuln-low'
        },
        {
            state: ComponentState.NONE,
            cssClass: 'sonatype-iq-extension-vuln-none'
        },
        {
            state: ComponentState.EVALUATING,
            cssClass: 'sonatype-iq-extension-vuln-evaluating'
        },
        {
            state: ComponentState.INVALID_CONFIG,
            cssClass: 'sonatype-iq-extension-vuln-invalid-config'
        },
        {
            state: ComponentState.UNSPECIFIED,
            cssClass: 'sonatype-iq-extension-vuln-unspecified'
        }
    ])('toCssClass for $state', ({ state, cssClass }) => {
        expect(ComponentStateUtil.toCssClass(state)).toEqual(cssClass)
    })
})