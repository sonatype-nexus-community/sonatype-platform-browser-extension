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
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { PackageURL } from 'packageurl-js'
import { NugetOrgRepo } from './NugetOrg'

const repo = new NugetOrgRepo

function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = getArtifactDetailsFromDOM(repo, url)
    if (expected) {
        expect(packageURLs).toBeDefined()
        expect(packageURLs?.length).toBe(expected.length)
        const p = packageURLs?.pop()
        const e = expected.pop()
        expect(p).toBeDefined()
        expect(p?.version).toBe(e?.version)
        expect(p?.name).toBe(e?.name)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('nuget.org Page Parsing', () => {
    
    test('/Newtonsoft.Json (no version in URL)', () => {      
        assertPageParsing(
            'https://www.nuget.org/packages/Newtonsoft.Json',
            'nuget.org/Newtonsoft.Json-13.0.1.html',
            [PackageURL.fromString('pkg:nuget/Newtonsoft.Json@13.0.1')]
        )
    })

    test('/Newtonsoft.Json/ (no version in URL)', () => {      
        assertPageParsing(
            'https://www.nuget.org/packages/Newtonsoft.Json/',
            'nuget.org/Newtonsoft.Json-13.0.1.html',
            [PackageURL.fromString('pkg:nuget/Newtonsoft.Json@13.0.1')]
        )
    })

    test('/Newtonsoft.Json/13.0.3', () => {      
        assertPageParsing(
            'https://www.nuget.org/packages/Newtonsoft.Json/13.0.3',
            undefined,
            [PackageURL.fromString('pkg:nuget/Newtonsoft.Json@13.0.3')]
        )
    })

    test('/Newtonsoft.Json/13.0.3/', () => {      
        assertPageParsing(
            'https://www.nuget.org/packages/Newtonsoft.Json/13.0.3/',
            undefined,
            [PackageURL.fromString('pkg:nuget/Newtonsoft.Json@13.0.3')]
        )
    })

     test('/Newtonsoft.Json/13.0.3/ + query & fragment', () => {      
        assertPageParsing(
            'https://www.nuget.org/packages/Newtonsoft.Json/13.0.3/?c=d#e',
            undefined,
            [PackageURL.fromString('pkg:nuget/Newtonsoft.Json@13.0.3')]
        )
    })
})
