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

import { ComponentStateType } from "../constants"

export class ComponentStateUtil {
    public static getIconForComponentState(componentState: ComponentStateType): string {
        switch (componentState) {
            case ComponentStateType.CRITICAL:
                return '/images/sonatype-platform-icon-critical.png'
            case ComponentStateType.SEVERE:
                return '/images/sonatype-platform-icon-severe.png'
            case ComponentStateType.MODERATE:
                return '/images/sonatype-platform-icon-moderate.png'
            case ComponentStateType.LOW:
                return '/images/sonatype-platform-icon-low.png'
            case ComponentStateType.NONE:
                return '/images/sonatype-platform-icon-none.png'
            case ComponentStateType.EVALUATING:
                return '/images/sonatype-platform-spinning.gif'
        }

        return '/images/sonatype-platform-icon-unspecified.png'
    }

    public static toCssClass(componentState: ComponentStateType): string {
        return `sonatype-iq-extension-vuln-${componentState.toString().toLowerCase()}`
    }
}