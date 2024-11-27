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
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { CentralSonatypeComRepo } from './CentralSonatypeCom'

const repo = new CentralSonatypeComRepo

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
        expect(p?.namespace).toBe(e?.namespace)
        expect(p?.name).toBe(e?.name)
        expect(p?.qualifiers).toEqual(e?.qualifiers)
    } else {
        expect(packageURLs?.length).toBe(0)
    }
}

describe('central.sonatype.com Page Parsing', () => {
    
    test('cyclonedx-core-java/7.3.2 JAR', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2',
            'central.sonatype.com/cyclonedx-core-java-7.3.2.html',
            [PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')]
        )
    })

    test('cyclonedx-core-java/7.3.2/versions JAR', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions',
            'central.sonatype.com/cyclonedx-core-java-7.3.2.html',
            [PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')]
        )
    })

    test('cyclonedx-core-java/7.3.2/versions JAR (+query)', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions?something=else',
            'central.sonatype.com/cyclonedx-core-java-7.3.2.html',
            [PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')]
        )
    })

    test('cyclonedx-core-java/7.3.2/versions JAR (+fragment)', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions#anchor',
            'central.sonatype.com/cyclonedx-core-java-7.3.2.html',
            [PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')]
        )
    })

    test('com.fpliu.ndk.pkg.prefab.android.21.curl/7.82.0 AAR', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/com.fpliu.ndk.pkg.prefab.android.21/curl/7.82.0/overview',
            'central.sonatype.com/c-f-n-p-p-a-21-curl-7.82.0.html',
            [PackageURL.fromString('pkg:maven/com.fpliu.ndk.pkg.prefab.android.21/curl@7.82.0?type=aar')]
        )
    })

    test('org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0 packaging=bundle', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0',
            'central.sonatype.com/scalacheck-bundle.html',
            [PackageURL.fromString('pkg:maven/org.scalatestplus/scalacheck-1-17_sjs1_3@3.2.17.0?type=jar')]
        )
    })

    test('org.apache.logging.log4j/log4j/3.0.0-alpha1 packaging=pom', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j/3.0.0-alpha1',
            'central.sonatype.com/log4j-parent.html',
            [PackageURL.fromString('pkg:maven/org.apache.logging.log4j/log4j@3.0.0-alpha1?type=jar')]
        )
    })

    test('custom-properties-maven-plugin/4.0.3 packaging=maven-plugin', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/net.sf.czsem/custom-properties-maven-plugin/4.0.3',
            'central.sonatype.com/custom-properties-maven-plugin.html',
            [PackageURL.fromString('pkg:maven/net.sf.czsem/custom-properties-maven-plugin@4.0.3?type=jar')]
        )
    })

    test('it.cnr.si.cool.jconon/cool-jconon/5.2.44 packaging=war', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/it.cnr.si.cool.jconon/cool-jconon/5.2.44',
            'central.sonatype.com/cool-jconon.html',
            [PackageURL.fromString('pkg:maven/it.cnr.si.cool.jconon/cool-jconon@5.2.44?type=war')]
        )
    })

    test('com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1 packaging=ear', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1',
            'central.sonatype.com/jakarta-ivt.html',
            [PackageURL.fromString('pkg:maven/com.ibm.mq/wmq.jakarta.jmsra.ivt@9.3.3.1?type=ear')]
        )
    })

    test('commons-io/commons-io/overview SEO changes made', () => {
        assertPageParsing(
            'https://central.sonatype.com/artifact/commons-io/commons-io/overview',
            'central.sonatype.com/commons-io.html',
            [PackageURL.fromString('pkg:maven/commons-io/commons-io@2.15.1?type=jar')]
        )
    })
})
