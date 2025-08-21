/**
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
import {
    NxFormGroup,
    NxGrid,
    NxPageMain,
    NxPageTitle,
    NxTable,
    NxTextInput,
    NxTextInputStateProps,
    NxTile
} from '@sonatype/react-shared-components'
import { initialState, userInput } from '@sonatype/react-shared-components/components/NxTextInput/stateHelpers'
import React, { useContext, useEffect, useState } from 'react'
import { ExternalRepositoryManager } from '../../common/configuration/types'
import { ThisBrowser } from '../../common/constants'
import { ExtensionConfigurationContext } from '../../common/context/extension-configuration'
import { MessageRequestType } from '../../common/message/constants'
import { sendRuntimeMessage } from '../../common/message/helpers'
import { isHttpUriValidator } from './validators'
import ExternalRepositoryManagerItem from './external-repository-manager'

export default function ExternalRepositoryOptionsSubPage() {
    const extensionConfigContext = useContext(ExtensionConfigurationContext)
    const [externalRepositoryManagerCount, setExternalRepositoryManagerCount] = useState(0)
    const [externalRepositoryUrl, setExternalRepositoryUrl] = useState<NxTextInputStateProps>(initialState(''))

    useEffect(() => {
        setExternalRepositoryManagerCount(Object.keys(extensionConfigContext.externalRepositoryManagers).length)
    }, [extensionConfigContext.externalRepositoryManagers])

    /**
     * Field onChange Handlers
     */
    function handleExternalRepositoryHostChange(host: string) {
        setExternalRepositoryUrl(
            userInput((val) => {
                if (!isHttpUriValidator(val)) {
                    return 'Must be a valid URL'
                } else {
                    return null
                }
            }, host)
        )
    }

    /**
     * Request Permissions for External Respository Host
     */
    const askForPermissions = () => {
        const unifiedExternalRepositoryUrl = externalRepositoryUrl.trimmedValue.endsWith('/')
            ? externalRepositoryUrl.trimmedValue
            : `${externalRepositoryUrl.trimmedValue}/`
        ThisBrowser.permissions
            .contains({
                origins: [unifiedExternalRepositoryUrl],
            })
            .then((hasPermission) => {
                if (!hasPermission) {
                    return ThisBrowser.permissions.request({
                        origins: [unifiedExternalRepositoryUrl],
                    })
                } else {
                    return hasPermission
                }
            })
            .then((hasPermission) => {
                if (!hasPermission) {
                    // Failed to get permission to External Repository URL
                    return Promise.reject(new Error('Failed to grant permissions to External Repository URL'))
                }
            })
            .then(() => {
                sendRuntimeMessage({
                    messageType: MessageRequestType.REQUEST_NEW_EXTERNAL_REPOSITORY_MANAGER,
                    url: unifiedExternalRepositoryUrl,
                })
            })
    }

    return (
        <NxPageMain>
            <h1>
                <NxPageTitle>{ThisBrowser.i18n.getMessage('CONFIGURE_NXRM_PAGE_TITLE')}</NxPageTitle>
            </h1>

            <NxTile>
                <NxTile.Content>
                    <NxGrid.Row>
                        <section className='nx-grid-col nx-grid-col--50'>
                            <div className='nx-form-row'>
                                <NxFormGroup label={'Add a Repository Manager'}>
                                    <NxTextInput
                                        {...externalRepositoryUrl}
                                        onChange={handleExternalRepositoryHostChange}
                                        placeholder='Repository Manager URL'
                                        validatable={true}
                                    />
                                </NxFormGroup>
                                <button
                                    className='nx-btn grant-permissions'
                                    onClick={askForPermissions}
                                >
                                    {'Add'}
                                    
                                </button>
                            </div>
                        </section>
                        <section className='nx-grid-col nx-grid-col--50'>
                            {externalRepositoryManagerCount === 0 && <em>None added yet</em>}
                            {externalRepositoryManagerCount > 0 && (
                                <NxTable caption="Configured External Repository Managers">
                                    <NxTable.Head>
                                        <NxTable.Row>
                                            <NxTable.Cell>Type</NxTable.Cell>
                                            <NxTable.Cell>URL</NxTable.Cell>
                                            <NxTable.Cell>Version</NxTable.Cell>
                                            <NxTable.Cell>Status</NxTable.Cell>
                                            <NxTable.Cell hasIcon>&nbsp;</NxTable.Cell>
                                        </NxTable.Row>
                                    </NxTable.Head>
                                    <NxTable.Body>
                                    {Object.keys(extensionConfigContext.externalRepositoryManagers).map(
                                        (extRepoManagerUrl) => {
                                            const extRepoManager = extensionConfigContext.externalRepositoryManagers[
                                                extRepoManagerUrl
                                            ] as ExternalRepositoryManager
                                            return (
                                                <ExternalRepositoryManagerItem externalRepositoryManager={extRepoManager} key={extRepoManager.id} />
                                            )
                                        }
                                    )}
                                    </NxTable.Body>
                                </NxTable>
                            )}
                        </section>
                    </NxGrid.Row>
                </NxTile.Content>
            </NxTile>
        </NxPageMain>
    )
}
