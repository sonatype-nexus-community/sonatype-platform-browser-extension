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
import { NxH2, NxP, NxPageMain, NxPageTitle, NxTile } from '@sonatype/react-shared-components'
import React from 'react'
import { ThisBrowser } from '../../common/constants'

export default function ReleaseNotesSubPage() {
    return (
        <NxPageMain>
            <h1>
                <NxPageTitle>
                    {ThisBrowser.i18n.getMessage('EXTENSION_NAME')} {ThisBrowser.i18n.getMessage('RELEASE_NOTES_PAGE_TITLE')}
                </NxPageTitle>
            </h1>
            <NxTile>
                <NxTile.Header>
                    <NxTile.HeaderTitle>
                        <NxH2>Version / Date</NxH2>
                    </NxTile.HeaderTitle>
                </NxTile.Header>
                <NxTile.Content>
                    <NxP>
                        Coming soon...
                    </NxP>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
