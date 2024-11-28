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
import { RubygemsOrgPageParser } from './RubygemsOrg'
import { RubygemsOrgRepo } from '../RepoType/RubygemsOrg'

const parser = new RubygemsOrgPageParser(new RubygemsOrgRepo)

function assertPageParsing(url: string, domFile: string | undefined, expected: PackageURL[] | undefined) {
    if (domFile) {
        const html = readFileSync(join(__dirname, 'testdata', domFile))
        window.document.body.innerHTML = html.toString()
    }
        
    const packageURLs = getArtifactDetailsFromDOM(parser, url)
    if (expected) {
        expect(packageURLs).toBeDefined()
        expect(packageURLs?.length).toBe(expected.length)
        const p = packageURLs?.pop()
        const e = expected.pop()
        expect(p).toBeDefined()
        expect(p?.version).toBe(e?.version)
        expect(p?.name).toBe(e?.name)
        if (e?.qualifiers) {
            expect(p?.qualifiers).toEqual(e?.qualifiers)
        } else {
            expect(p?.qualifiers).not.toBeDefined()
        }
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('rubygems.org Page Parsing', () => {
    
    test('/chelsea (no version in URL)', () => {
        assertPageParsing(
            'https://rubygems.org/gems/chelsea',
            'rubygems.org/chelsea-0.0.35.html',
            [PackageURL.fromString('pkg:gem/chelsea@0.0.35')]
        )
    })

    test('/chelsea (no version in URL) + query & fragment', () => {
        assertPageParsing(
            'https://rubygems.org/gems/chelsea?d=e#f',
            'rubygems.org/chelsea-0.0.35.html',
            [PackageURL.fromString('pkg:gem/chelsea@0.0.35')]
        )
    })

    test('/chelsea/0.0.32', () => {
        assertPageParsing(
            'https://rubygems.org/gems/chelsea/versions/0.0.32',
            'rubygems.org/chelsea-0.0.32.html',
            [PackageURL.fromString('pkg:gem/chelsea@0.0.32')]
        )
    })

    test('/chelsea/0.0.32 + query & fragment', () => {
        assertPageParsing(
            'https://rubygems.org/gems/chelsea/versions/0.0.32?p=q#o',
            'rubygems.org/chelsea-0.0.32.html',
            [PackageURL.fromString('pkg:gem/chelsea@0.0.32')]
        )
    })

    test('/logstash-input-tcp/versions/6.0.9-java', () => {
        assertPageParsing(
            'https://rubygems.org/gems/logstash-input-tcp/versions/6.0.9-java',
            'rubygems.org/logstash-input-tcp-6.0.9-java.html',
            [PackageURL.fromString('pkg:gem/logstash-input-tcp@6.0.9?platform=java')]
        )
    })
})
