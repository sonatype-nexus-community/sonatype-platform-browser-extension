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
import { EpssData } from '@sonatype/nexus-iq-api-client'
import React, { useContext } from 'react'
import { ThisBrowser } from '../../common/constants'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'

export default function EpssScore(props: Readonly<{ epssData: EpssData | undefined }>) {
    const extensionConfigurationContext = useContext(ExtensionConfigurationContext)

    if (extensionConfigurationContext.iqVersion < 194) {
        return <em>{ThisBrowser.i18n.getMessage('UPGRADE_IQ_SERVER')}</em>
    }

    if (props.epssData === undefined) {
        return <em>{ThisBrowser.i18n.getMessage('DATA_NOT_AVAILABLE')}</em>
    }

    return <span>{(props.epssData.currentScore || 0 * 100).toFixed(4)}%</span>
}
