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
import { PackageURL } from 'packageurl-js'
import { join } from 'path'
import { SearchMavenOrgPageParser } from './search-maven-org'
import { SearchMavenOrgRepo } from '../repo-type/search-maven-org'

const parser = new SearchMavenOrgPageParser(new SearchMavenOrgRepo)

function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = parser.parsePage(url)
    if (expected) {
        expect(packageURLs).toBeDefined()
        expect(packageURLs?.length).toBe(expected.length)
        const p = packageURLs?.pop()
        const e = expected.pop()
        expect(p).toBeDefined()
        expect(p?.namespace).toBe(e?.namespace)
        expect(p?.name).toBe(e?.name)
        expect(p?.version).toBe(e?.version)
        expect(p?.qualifiers).toEqual(e?.qualifiers)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('central.sonatype.com Page Parsing', () => {
    
    test('org.apache.struts/struts2-core/2.3.30/jar', () => {
        assertPageParsing(
            'https://search.maven.org/artifact/org.apache.struts/struts2-core/2.3.30/jar',
            undefined,
            [PackageURL.fromString('pkg:maven/org.apache.struts/struts2-core@2.3.30?type=jar')]
        )
    })

    test('org.cyclonedx/cyclonedx-maven-plugin/2.7.6/maven-plugin', () => {
        assertPageParsing(
            'https://search.maven.org/artifact/org.cyclonedx/cyclonedx-maven-plugin/2.7.6/maven-plugin',
            undefined,
            [PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-maven-plugin@2.7.6?type=maven-plugin')]
        )
    })
})
