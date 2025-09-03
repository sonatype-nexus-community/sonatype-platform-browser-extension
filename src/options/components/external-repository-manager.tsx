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
import { NxCloseButton, NxIntermediateStatusIndicator, NxLoadingSpinner, NxNegativeStatusIndicator, NxPositiveStatusIndicator, NxSmallTag, NxTable } from '@sonatype/react-shared-components'
import React from 'react'
import { ExternalRepositoryManager, ExternalRepositoryManagerStatus } from '../../common/configuration/types'
import { ThisBrowser } from '../../common/constants'
import { lastRuntimeError, sendRuntimeMessage } from '../../common/message/helpers'
import { MessageRequestType } from '../../common/message/constants'
import { logger, LogLevel } from '../../common/logger'

export default function ExternalRepositoryManagerItem (
    props: Readonly<{ externalRepositoryManager: ExternalRepositoryManager }>
) {
    const removeExternalRepositoryManager = (url: string) => {
        ThisBrowser.permissions.remove({
            origins: [url],
        }).then(() => {
            sendRuntimeMessage({
                messageType: MessageRequestType.REQUEST_REMOVAL_EXTERNAL_REPOSITORY_MANAGER,
                url
            }).then(() => {
                const lastError = lastRuntimeError()
                if (lastError) {
                    logger.logReact('Runtime Error in removeExternalRepositoryManager', LogLevel.WARN, lastError)
                }
            })
        })
    }

    const getStatusIndicator = () => {
        switch (props.externalRepositoryManager.status) {
            case ExternalRepositoryManagerStatus.REQEUESTED:
                return <NxIntermediateStatusIndicator>Pending</NxIntermediateStatusIndicator>
            case ExternalRepositoryManagerStatus.READY:
                return <NxPositiveStatusIndicator>Ready</NxPositiveStatusIndicator>
            case ExternalRepositoryManagerStatus.BROKEN:
            default:
                return <NxNegativeStatusIndicator>Error</NxNegativeStatusIndicator>
        }
    }

    if (props.externalRepositoryManager.status === ExternalRepositoryManagerStatus.REQEUESTED) {
        return (
            <NxTable.Row>
                <NxTable.Cell>
                    <NxLoadingSpinner />
                </NxTable.Cell>
                <NxTable.Cell>{props.externalRepositoryManager.url}</NxTable.Cell>
                <NxTable.Cell>
                    <em>Registering...</em>
                </NxTable.Cell>
                <NxTable.Cell>{getStatusIndicator()}</NxTable.Cell>
                <NxTable.Cell></NxTable.Cell>
            </NxTable.Row>
        )
    }

    return (
        <NxTable.Row>
            <NxTable.Cell>
                <img
                    src='./images/sonatype-repository-icon.svg'
                    width={38}
                    height={38}
                    alt='Sonatype Nexus Repository'
                    style={{ marginRight: '10px' }}
                />
            </NxTable.Cell>
            <NxTable.Cell>{props.externalRepositoryManager.url}</NxTable.Cell>
            <NxTable.Cell>
                <NxSmallTag color='green'>{props.externalRepositoryManager.version}</NxSmallTag>
            </NxTable.Cell>
            <NxTable.Cell>{getStatusIndicator()}</NxTable.Cell>
            <NxTable.Cell>
                <NxCloseButton onClick={() => {
                    removeExternalRepositoryManager(props.externalRepositoryManager.id)
                }} />
            </NxTable.Cell>
        </NxTable.Row>
    )
}
