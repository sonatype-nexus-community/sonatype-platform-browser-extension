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
import { describe, expect, it } from '@jest/globals'
import { readFileSync } from 'fs'
import { PackageURL } from 'packageurl-js'
import { join } from 'path'
import { CentralSonatypeComPageParser } from './central-sonatype-com'
import { CentralSonatypeComRepo } from '../repo-type/central-sonatype-com'

describe('central.sonatype.com Page Parsing', () => {
    const parser = new CentralSonatypeComPageParser(new CentralSonatypeComRepo)
    
    it.each([
        {
            name: 'cyclonedx-core-java/7.3.2 JAR',
            url: 'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2',
            testFile: 'cyclonedx-core-java-7.3.2.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')
            ]
        },
        {
            name: 'cyclonedx-core-java/7.3.2/versions JAR',
            url: 'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions',
            testFile: 'cyclonedx-core-java-7.3.2.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')
            ]
        },
        {
            name: 'cyclonedx-core-java/7.3.2/versions JAR (+query)',
            url: 'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions?something=else',
            testFile: 'cyclonedx-core-java-7.3.2.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')
            ]
        },
        {
            name: 'cyclonedx-core-java/7.3.2/versions JAR (+fragment)',
            url: 'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions#anchor',
            testFile: 'cyclonedx-core-java-7.3.2.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/org.cyclonedx/cyclonedx-core-java@7.3.2?type=jar')
            ]
        },
        {
            name: 'com.fpliu.ndk.pkg.prefab.android.21.curl/7.82.0 AAR',
            url: 'https://central.sonatype.com/artifact/com.fpliu.ndk.pkg.prefab.android.21/curl/7.82.0/overview',
            testFile: 'c-f-n-p-p-a-21-curl-7.82.0.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/com.fpliu.ndk.pkg.prefab.android.21/curl@7.82.0?type=aar')
            ]
        },
        {
            name: 'org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0 packaging=bundle',
            url: 'https://central.sonatype.com/artifact/org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0',
            testFile: 'scalacheck-bundle.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/org.scalatestplus/scalacheck-1-17_sjs1_3@3.2.17.0?type=jar')
            ]
        },
        {
            name: 'org.apache.logging.log4j/log4j/3.0.0-alpha1 packaging=pom',
            url: 'https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j/3.0.0-alpha1',
            testFile: 'log4j-parent.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/org.apache.logging.log4j/log4j@3.0.0-alpha1?type=jar')
            ]
        },
        {
            name: 'custom-properties-maven-plugin/4.0.3 packaging=maven-plugin',
            url: 'https://central.sonatype.com/artifact/net.sf.czsem/custom-properties-maven-plugin/4.0.3',
            testFile: 'custom-properties-maven-plugin.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/net.sf.czsem/custom-properties-maven-plugin@4.0.3?type=jar')
            ]
        },
        {
            name: 'it.cnr.si.cool.jconon/cool-jconon/5.2.44 packaging=war',
            url: 'https://central.sonatype.com/artifact/it.cnr.si.cool.jconon/cool-jconon/5.2.44',
            testFile: 'cool-jconon.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/it.cnr.si.cool.jconon/cool-jconon@5.2.44?type=war')
            ]
        },
        {
            name: 'com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1 packaging=ear',
            url: 'https://central.sonatype.com/artifact/com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1',
            testFile: 'jakarta-ivt.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/com.ibm.mq/wmq.jakarta.jmsra.ivt@9.3.3.1?type=ear')
            ]
        },
        {
            name: 'commons-io/commons-io/overview SEO changes made',
            url: 'https://central.sonatype.com/artifact/commons-io/commons-io/overview',
            testFile: 'commons-io.html',
            expectedPurls: [
                PackageURL.fromString('pkg:maven/commons-io/commons-io@2.15.1?type=jar')
            ]
        }
    ])('$name', async ({ url, testFile, expectedPurls }) => {
        if (testFile) {
            const html = readFileSync(join(__dirname, 'testdata', 'central.sonatype.com', testFile))
            window.document.body.innerHTML = html.toString()
        }
            
        const packageURLs = await parser.parsePage(url)
        if (expectedPurls) {
            expect(packageURLs).toBeDefined()
            expect(packageURLs?.length).toBe(expectedPurls.length)
            const p = packageURLs?.pop()
            const e = expectedPurls.pop()
            expect(p).toBeDefined()
            expect(p?.version).toBe(e?.version)
            expect(p?.namespace).toBe(e?.namespace)
            expect(p?.name).toBe(e?.name)
            expect(p?.qualifiers).toEqual(e?.qualifiers)
        } else {
            expect(packageURLs?.length).toBe(0)
        }
    })
})
