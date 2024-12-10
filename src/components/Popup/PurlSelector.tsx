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

import { NxFormGroup, NxFormSelect, nxFormSelectStateHelpers, NxTile } from "@sonatype/react-shared-components"
import React, { useContext } from "react"
import { ExtensionConfigurationContext } from "../../context/ExtensionConfigurationContext"
import { logger, LogLevel } from "../../logger/Logger"
import { PackageURL } from "packageurl-js"
import { getPurlHash } from "../../utils/Helpers"

export default function PurlSelector({ setPurl }: Readonly<{ setPurl: (purl: PackageURL) => void}>) {

    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const [selectState, setSelectValue] = nxFormSelectStateHelpers.useNxFormSelectState<string>('')

    function onChange(val: string) {
        logger.logMessage("New PURL Selected", LogLevel.INFO, val)
        setSelectValue(val)
        setPurl(PackageURL.fromString(val))
    }

    if (extensionConfigContext.purlsDiscovered.length > 1) {
        return (
            <NxTile>
                <NxFormGroup label={`Selected Component`}>
                    <NxFormSelect onChange={onChange} {...selectState}>
                        {extensionConfigContext.purlsDiscovered.map((purl) => {
                            return <option key={`purl-${getPurlHash(PackageURL.fromString(purl))}`} value={purl}>{purl}</option>
                        })}
                    </NxFormSelect>
                </NxFormGroup>
            </NxTile>
        )
    } else {
        return <></>
    }
    
}