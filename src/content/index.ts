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
import { ThisBrowser } from '../common/constants'
import { logger, LogLevel } from '../common/logger'
import { MessageRequestType } from '../common/message/constants'
import { MessageRequestExtensionConfigurationUpdated } from '../common/message/types'
import { DefaultPageParserRegistry } from '../common/page-parsing/registry'
import '../public/css/content.css'
import { ContentScriptRuntimeOnMessageHandler } from './handlers/runtime-on-message'

// This script is loaded into the visible Browser Tab for sites that are on
// the supported list (extensible via custom NXRM installations).
//
// It's primary purposes are for web sites that are "supported" or "enabled" for this Extension:
// 1. Handle a requst to parse Component Identities
// 2. Handle a request to annotate the current Page

const onMessageHandler = new ContentScriptRuntimeOnMessageHandler()
ThisBrowser.runtime.onMessage.addListener(onMessageHandler.handleOnMessage)
logger.logContent("Content Script Message Handler registered", LogLevel.INFO)

ThisBrowser.runtime
    .connect({ name: 'CONTENT-SCRIPT' })
    .onMessage.addListener((request: MessageRequestExtensionConfigurationUpdated) => {
        if (request.messageType === MessageRequestType.EXTENSION_CONFIGURATION_UPDATED) {
            logger.setLevel(request.newExtensionConfig.logLevel)
            DefaultPageParserRegistry.setEnableDomAnnotation(request.newExtensionConfig.enablePageAnnotations)
        }
    }
)