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
                        <NxH2>Release <code>3.0.0</code></NxH2>
                    </NxTile.HeaderTitle>
                </NxTile.Header>
                <NxTile.Content>
                    <NxP>
                        Release <code>3.0.0</code> contains numerous changes and improvements over <code>2.x.x</code>.
                    </NxP>
                    <h3 className="nx-h3">Notable Changes</h3>
                    <ol className="nx-list nx-list--numbered">
                        <li className="nx-list__item">
                            <h4>Side Panel Mode</h4>
                            <span className="nx-list__text">
                                The Sonatype Platform Browser Extension now display Component Intelligence in your Browsers Side Panel.
                            </span>
                        </li>
                        <li className="nx-list__item">
                            <h4>Support for HuggingFace</h4>
                            <span className="nx-list__text">
                                HuggingFace.co is now a supported Open Source Registry - see how for a given Model different formats can yield <em>different</em> risk.
                            </span>
                        </li>
                        <li className="nx-list__item">
                            <h4>Improved support for PyPi.org</h4>
                            <span className="nx-list__text">
                                Component Intelligence is now available for both source and binary distributions. Simply use the selector drop-down in the Side Panel.
                            </span>
                        </li>
                        <li className="nx-list__item">
                            <h4>Less noise, more focus</h4>
                            <span className="nx-list__text">
                                Based on feedback, we have reduced the amount of information presented and highlighed the more pertinent information.
                            </span>
                        </li>
                        <li className="nx-list__item">
                            <h4>Native Notifications</h4>
                            <span className="nx-list__text">
                                Component Intelligence warnings are now (by default) made through native Browser Notifications.<br />
                                You can configure this in <NxTextLink href="?general">Advanced Settings</NxTextLink>.
                            </span>
                        </li>
                        <li className="nx-list__item">
                            <h4>User Customization</h4>
                            <span className="nx-list__text">
                                Based on feedback, users can now opt out of Page Annoations (where our Extension modifies the web-page you are viewing).<br />
                                You can configure this in <NxTextLink href="?general">Advanced Settings</NxTextLink>.
                            </span>
                        </li>
                    </ol>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
