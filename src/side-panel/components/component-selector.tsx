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

import { getUniqueId, NxFormGroup, NxFormSelect, nxFormSelectStateHelpers } from '@sonatype/react-shared-components'
import React from 'react'
import { PackageURL } from 'packageurl-js'
import { friendlyPackageUrlString } from '../../common/purl-utils'

export default function ComponentSelector(
    props: Readonly<{
        componentPurls: Array<string>
        selectedComponent: string,
        setPurl: (purl: string) => void
    }>    
) {
    const [selectedComponent, setSelectedComponent] = nxFormSelectStateHelpers.useNxFormSelectState<string>(props.selectedComponent)

    function onChange(val: string) {
        setSelectedComponent(val)
        props.setPurl(val)
    }
    
    return (
        <section className="nx-tile">
            <div className="nx-tile-content">
                <NxFormGroup label={`Select Component`} sublabel="Multiple components identified - choose which to view details on">
                    <NxFormSelect onChange={onChange} {...selectedComponent} className="nx-form-select--long">
                        {props.componentPurls.map((purl) => {
                            const packageUrl = PackageURL.fromString(purl)
                            return (
                                <option key={getUniqueId('purl')} value={purl}>{friendlyPackageUrlString(packageUrl)}</option>
                            )
                        })}
                    </NxFormSelect>
                </NxFormGroup>
            </div>
        </section>
    )
}
