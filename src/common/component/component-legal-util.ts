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
import { ApiLicenseDTO } from '@sonatype/nexus-iq-api-client'
import { ComponentData } from '../data/types'
import { logger, LogLevel } from '../logger'
import { ThreatLevelNumber } from '@sonatype/react-shared-components'

export interface ApiLicenseDTOWithThreatLevel extends ApiLicenseDTO {
    threatLevel: ThreatLevelNumber
}

export class ComponentLegalUtil {
    private declaredWithThreatLevel = Array<ApiLicenseDTOWithThreatLevel>()
    private effectiveWithThreatLevel = Array<ApiLicenseDTOWithThreatLevel>()
    private observedWithThreatLevel = Array<ApiLicenseDTOWithThreatLevel>()

    constructor(private componentData: ComponentData) {
        this.recalculateData()
    }

    public getDeclaredWithThreatLevel = (): Array<ApiLicenseDTOWithThreatLevel> => {
        return this.declaredWithThreatLevel
    }

     public getEffectivedWithThreatLevel = (): Array<ApiLicenseDTOWithThreatLevel> => {
        return this.effectiveWithThreatLevel
    }

     public getObservedWithThreatLevel = (): Array<ApiLicenseDTOWithThreatLevel> => {
        return this.observedWithThreatLevel
    }

    public getThreatLevelForLicenseId = (licenseId: string): ThreatLevelNumber => {
        let threatLevel = 0 as ThreatLevelNumber
        this.componentData.componentDetails?.policyData?.policyViolations?.forEach((pv) => {
            pv.constraintViolations?.forEach((cv) => {
                cv.reasons?.forEach((r) => {
                    const licenseIdMatched = parseLicenseFromReason(r.reason as string)
                    if (licenseIdMatched === licenseId) {
                        if ((pv.threatLevel as number) > threatLevel) threatLevel = pv.threatLevel as ThreatLevelNumber
                    }
                })
            })
        })
        return threatLevel
    }

    public setComponentData = (componentData: ComponentData) => {
        this.componentData = componentData
        this.recalculateData()
    }

    private readonly recalculateData = () => {
        logger.logGeneral('ComponentLegalUtil.recalculateData starting', LogLevel.DEBUG)
        this.declaredWithThreatLevel = []
        this.effectiveWithThreatLevel = []
        this.observedWithThreatLevel = []

        if (!this.componentData?.componentDetails) return

        this.declaredWithThreatLevel = this.recalculateLicenses(
            this.componentData.componentDetails.licenseData?.declaredLicenses || []
        )
        this.effectiveWithThreatLevel = this.recalculateLicenses(
            this.componentData.componentDetails.licenseData?.effectiveLicenses || []
        )
        this.observedWithThreatLevel = this.recalculateLicenses(
            this.componentData.componentDetails.licenseData?.observedLicenses || []
        )
    }

    private recalculateLicenses(licenses: Array<ApiLicenseDTO>): Array<ApiLicenseDTOWithThreatLevel> {
        let licensesWithThreatLevel = Array<ApiLicenseDTOWithThreatLevel>()
        licenses.forEach((lic) => {
            const dtoWithThreatLevel = lic as ApiLicenseDTOWithThreatLevel
            logger.logGeneral(`Processing License: ${lic.licenseId}`, LogLevel.DEBUG)
            dtoWithThreatLevel.threatLevel = this.getThreatLevelForLicenseId(lic.licenseId as string)
            logger.logGeneral(`--> Determined Threat Level`, LogLevel.DEBUG, dtoWithThreatLevel)
            licensesWithThreatLevel.push(dtoWithThreatLevel)
        })

        // Sort by Threat Level descending
        licensesWithThreatLevel = licensesWithThreatLevel.sort((a: ApiLicenseDTOWithThreatLevel, b: ApiLicenseDTOWithThreatLevel) => {
            return (b.threatLevel ?? 0) - (a.threatLevel ?? 0)
        })
        return licensesWithThreatLevel
    }
}

export function parseLicenseFromReason(reason: string): string | undefined {
    // eslint-disable-next-line no-useless-escape
    const matches = /^[^(]+\(\'(?<licenseId>[^']+)\'\)$/gm.exec(reason)

    if (matches?.groups?.licenseId) {
        return matches?.groups?.licenseId
    }

    return undefined
}
