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
import { NxH2, NxP, NxPageMain, NxPageTitle, NxTextLink, NxTile } from '@sonatype/react-shared-components'
import React from 'react'
import { ThisBrowser } from '../../common/constants'


export default function HelpSubPage() {
    const extension = ThisBrowser.runtime.getManifest()

    return (
        <NxPageMain>
            <h1>
                <NxPageTitle>
                    {ThisBrowser.i18n.getMessage('EXTENSION_NAME')} {ThisBrowser.i18n.getMessage('HELP_PAGE_TITLE')}
                </NxPageTitle>
            </h1>
            <NxTile>
                <NxTile.Header>
                    <NxTile.HeaderTitle>
                        <NxH2>{ThisBrowser.i18n.getMessage('HELP_TILE_TITLE_WHERE_TO_GET_HELP')}</NxH2>
                    </NxTile.HeaderTitle>
                </NxTile.Header>
                <NxTile.Content>
                    <NxP>
                        {ThisBrowser.i18n.getMessage('HELP_TILE_CONTENT_WHERE_TO_GET_HELP')}
                        <NxTextLink external href={extension.homepage_url}>
                            {ThisBrowser.i18n.getMessage('LINK_TEXT_HERE')}
                        </NxTextLink>
                        &nbsp;.
                    </NxP>
                </NxTile.Content>
            </NxTile>
            <NxTile>
                <NxTile.Header>
                    <NxTile.HeaderTitle>
                        <NxH2>{ThisBrowser.i18n.getMessage('HELP_TILE_TITLE_FEATURE_REQUEST')}</NxH2>
                    </NxTile.HeaderTitle>
                </NxTile.Header>
                <NxTile.Content>
                    <NxP>{ThisBrowser.i18n.getMessage('HELP_TILE_CONTENT_FEATURE_REQUEST')}</NxP>
                    <NxTextLink external href={`${extension.homepage_url}/issues`}>
                        {ThisBrowser.i18n.getMessage('LINK_FEATURE_REQUEST')}
                    </NxTextLink>
                </NxTile.Content>
            </NxTile>
            <NxTile>
                <NxTile.Header>
                    <NxTile.HeaderTitle>
                        <NxH2>{ThisBrowser.i18n.getMessage('HELP_TILE_TITLE_RAISE_BUG')}</NxH2>
                    </NxTile.HeaderTitle>
                </NxTile.Header>
                <NxTile.Content>
                    <NxP>
                        {ThisBrowser.i18n.getMessage('HELP_TILE_CONTENT_RAISE_BUG')}
                    </NxP>
                    <ul>
                        <li>{ThisBrowser.i18n.getMessage('HELP_TITLE_CONTENT_BUG_DETAIL_1')}</li>
                        <li>{ThisBrowser.i18n.getMessage('HELP_TITLE_CONTENT_BUG_DETAIL_2')}</li>
                        <li>{ThisBrowser.i18n.getMessage('HELP_TITLE_CONTENT_BUG_DETAIL_3')}</li>
                        <li>{ThisBrowser.i18n.getMessage('HELP_TITLE_CONTENT_BUG_DETAIL_4')}</li>
                        <li>{ThisBrowser.i18n.getMessage('HELP_TITLE_CONTENT_BUG_DETAIL_5')}</li>
                    </ul>
                    <NxTextLink external href={`${extension.homepage_url}/issues`}>
                        {ThisBrowser.i18n.getMessage('LINK_BUG_REPORT')}
                    </NxTextLink>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
