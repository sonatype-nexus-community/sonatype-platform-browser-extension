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
import { describe, expect, test } from '@jest/globals'
import { logger, LogLevel } from '../../logger/Logger'
import { REPOS, RepoType } from '../Constants'
import { readFileSync } from 'fs'
import { join } from 'path'

export const getTitleTextFromTitleSelector = (repoFormat: RepoType, filePath: string): string | undefined => {
    logger.logMessage('In getTitleTextFromTitleSelector', LogLevel.TRACE, repoFormat, filePath)

    const html = readFileSync(join(__dirname, 'testdata/npm.html'))

        window.document.body.innerHTML = html.toString()


        return ""
}