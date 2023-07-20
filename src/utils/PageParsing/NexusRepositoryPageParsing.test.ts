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
import { readFileSync } from 'fs'
import { join } from 'path'
import { FORMATS, REPOS, REPO_TYPES } from '../Constants'
import { ensure } from '../Helpers'
import { getArtifactDetailsFromNxrmDom } from './NexusRepositoryPageParsing'

describe('NXRM3 Page Parsing', () => {
    const repoType = {
        url: 'https://repo.tld',
        repoFormat: FORMATS.NXRM,
        repoID: 'NXRM-https://repo.tld',
    }

    test('#browse/browse:npm-proxy:%40sonatype%2Fnexus-iq-api-client', () => {
        const html = readFileSync(join(__dirname, 'testdata/nxrm3-browse-npm.html'))

        window.document.body.innerHTML = html.toString()

        const PackageURL = getArtifactDetailsFromNxrmDom(ensure(repoType), 'https://pypi.org/project/Django/')

        expect(PackageURL).toBeDefined()
        expect(PackageURL?.type).toBe(FORMATS.pypi)
        expect(PackageURL?.name).toBe('Django')
        expect(PackageURL?.version).toBe('4.2.1')
    })
})
