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
import { REPOS, REPO_TYPES } from '../Constants'
import { getArtifactDetailsFromDOM } from '../PageParsing'
import { ensure } from '../Helpers'

describe('central.sonatype.com Page Parsing', () => {
    const repoType = REPO_TYPES.find((e) => e.repoID == REPOS.centralSonatypeCom)
    expect(repoType).toBeDefined()

    test('should parse a valid central.sonatype.com page', () => {
        const html = readFileSync(join(__dirname, 'testdata/CentralSonatypeCom.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('org.cyclonedx')
        expect(packageURL?.name).toBe('cyclonedx-core-java')
        expect(packageURL?.version).toBe('7.3.2')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com page with additional path', () => {
        const html = readFileSync(join(__dirname, 'testdata/CentralSonatypeCom.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('org.cyclonedx')
        expect(packageURL?.name).toBe('cyclonedx-core-java')
        expect(packageURL?.version).toBe('7.3.2')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com page with additional path and query string', () => {
        const html = readFileSync(join(__dirname, 'testdata/CentralSonatypeCom.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions?something=else'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('org.cyclonedx')
        expect(packageURL?.name).toBe('cyclonedx-core-java')
        expect(packageURL?.version).toBe('7.3.2')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com page with additional path and fragment', () => {
        const html = readFileSync(join(__dirname, 'testdata/CentralSonatypeCom.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/org.cyclonedx/cyclonedx-core-java/7.3.2/versions#anchor'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('org.cyclonedx')
        expect(packageURL?.name).toBe('cyclonedx-core-java')
        expect(packageURL?.version).toBe('7.3.2')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com where artefact is AAR', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-android.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/com.fpliu.ndk.pkg.prefab.android.21/curl/7.82.0/overview'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('com.fpliu.ndk.pkg.prefab.android.21')
        expect(packageURL?.name).toBe('curl')
        expect(packageURL?.version).toBe('7.82.0')
        expect(packageURL?.qualifiers).toEqual({ type: 'aar' })
    })

    test('should parse a valid central.sonatype.com where artefact is not of type JAR', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-scalacheck-bundle.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/org.scalatestplus/scalacheck-1-17_sjs1_3/3.2.17.0'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('org.scalatestplus')
        expect(packageURL?.name).toBe('scalacheck-1-17_sjs1_3')
        expect(packageURL?.version).toBe('3.2.17.0')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com where artefact is not of type POM', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-log4j-parent.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/org.apache.logging.log4j/log4j/3.0.0-alpha1'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('org.apache.logging.log4j')
        expect(packageURL?.name).toBe('log4j')
        expect(packageURL?.version).toBe('3.0.0-alpha1')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com where packaging is maven-plugin', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-custom-properties-maven-plugin.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/net.sf.czsem/custom-properties-maven-plugin/4.0.3'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('net.sf.czsem')
        expect(packageURL?.name).toBe('custom-properties-maven-plugin')
        expect(packageURL?.version).toBe('4.0.3')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })

    test('should parse a valid central.sonatype.com where packaging is WAR', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-cool-jconon.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/it.cnr.si.cool.jconon/cool-jconon/5.2.44'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('it.cnr.si.cool.jconon')
        expect(packageURL?.name).toBe('cool-jconon')
        expect(packageURL?.version).toBe('5.2.44')
        expect(packageURL?.qualifiers).toEqual({ type: 'war' })
    })

    test('should parse a valid central.sonatype.com where packaging is EAR', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-jakarta-ivt.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/com.ibm.mq/wmq.jakarta.jmsra.ivt/9.3.3.1'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('com.ibm.mq')
        expect(packageURL?.name).toBe('wmq.jakarta.jmsra.ivt')
        expect(packageURL?.version).toBe('9.3.3.1')
        expect(packageURL?.qualifiers).toEqual({ type: 'ear' })
    })

    test('should parse a valid central.sonatype.com where SEO changes made', () => {
        const html = readFileSync(join(__dirname, 'testdata/central-s-c-commons-io.html'))

        window.document.body.innerHTML = html.toString()

        const packageURL: PackageURL | undefined = getArtifactDetailsFromDOM(
            ensure(repoType),
            'https://central.sonatype.com/artifact/commons-io/commons-io/overview'
        )

        expect(packageURL).toBeDefined()
        expect(packageURL?.type).toBe('maven')
        expect(packageURL?.namespace).toBe('commons-io')
        expect(packageURL?.name).toBe('commons-io')
        expect(packageURL?.version).toBe('2.15.1')
        expect(packageURL?.qualifiers).toEqual({ type: 'jar' })
    })
})
