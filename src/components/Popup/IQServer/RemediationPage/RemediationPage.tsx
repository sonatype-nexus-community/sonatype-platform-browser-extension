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
import { NxH3 } from '@sonatype/react-shared-components'
import React, { useContext } from 'react'
import { ExtensionPopupContext } from '../../../../context/ExtensionPopupContext'
import { ExtensionConfigurationContext } from '../../../../context/ExtensionConfigurationContext'
import AllVersionsDetails from './AllVersionsPage/AllVersionsDetails/AllVersionsDetails'
import RemediationDetails from './RemediationDetails/RemediationDetails'
import { DATA_SOURCE } from '../../../../utils/Constants'
import SuggestedVersionChange from './RemediationDetails/SuggestedVersionChange'

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-explicit-any
const _browser: any = chrome ? chrome : browser

function IqRemediationPage() {
    const popupContext = useContext(ExtensionPopupContext)
    const versionChanges = popupContext.iq?.remediationDetails?.versionChanges
    const suggestedVersionChange = popupContext.iq?.remediationDetails?.suggestedVersionChange

    return (
        <React.Fragment>
            <div className='nx-grid-row'>
                <section className='nx-grid-col nx-grid-col--33 nx-scrollable'>
                    {suggestedVersionChange != null && (
                        <div>
                            <NxH3>{_browser.i18n.getMessage('SUGGESTED_VERSION')}</NxH3>
                            <SuggestedVersionChange suggestedVersion={suggestedVersionChange} />
                        </div>
                    )}
                    {versionChanges && versionChanges.length > 0 && <NxH3>
                        {_browser.i18n.getMessage('RECOMMENDED_VERSIONS')}
                        <RemediationDetails />
                        </NxH3>}
                    
                </section>
                <section className='nx-grid-col nx-grid-col--67 nx-scrollable'>
                    <NxH3>
                        {_browser.i18n.getMessage('ALL_VERSIONS')} ({popupContext.iq?.allVersions?.length})
                    </NxH3>
                    <AllVersionsDetails />
                </section>
            </div>
        </React.Fragment>
    )
}

export default function RemediationPage() {
    const extensionContext = useContext(ExtensionConfigurationContext)

    return <div>{extensionContext.dataSource === DATA_SOURCE.NEXUSIQ && <IqRemediationPage />}</div>
}
