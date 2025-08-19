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
import $ from 'cash-dom'
import { PackageURL } from 'packageurl-js'
import { generatePackageURLWithNamespace } from '../purl-utils'
import { BasePageParser } from './base'
import { RepoFormat } from '../repo-type/types'

const PKG_GO_DEV_VERSION_SELECTOR = '#main-content a[href="?tab=versions"]'
const GO_PKG_IN_V1 = /^gopkg.in\/([^.]+).*/
const GO_PKG_IN_V2 = /^gopkg.in\/([^/]+)\/([^.]+).*/
const INCOMPATIBLE_VERSION_SUFFIX = '+incompatible'

interface NamespaceContainer {
    name: string
    namespace: string
}

export class PkgGoDevPageParser extends BasePageParser {
    parsePage(url: string): PackageURL[] {
        const uri = new URL(url)
        let nameAndNamespace: NamespaceContainer | undefined
        const nameVersion = uri.pathname.split('@')

        let version = this.getVersionFromURI(uri)
        if ((version?.endsWith(INCOMPATIBLE_VERSION_SUFFIX)) === true) {
            return []
        }

        if (version !== undefined) {
            nameAndNamespace = this.getName(this.handleGoPkgIn(nameVersion[0].replace(/^\//, '')))
        } else {
            const found = $(PKG_GO_DEV_VERSION_SELECTOR)

            if (typeof found !== 'undefined') {
                nameAndNamespace = this.getName(this.handleGoPkgIn(uri.pathname.replace(/^\//, '')))
                version = found.text().trim().replace('Version: ', '').trim()
                if ((version?.endsWith(INCOMPATIBLE_VERSION_SUFFIX)) === true) {
                    return []
                }
            }
        }

        if (nameAndNamespace && version != null) {
            const p = generatePackageURLWithNamespace(
                RepoFormat.GOLANG,
                nameAndNamespace.name,
                version,
                nameAndNamespace.namespace
            )
            this.annotateDomForPurl(p)
            return [p]
        }

        return []
    }

    private getName(name: string): NamespaceContainer | undefined {
        const nameAndNamespace = name.split('/')
        if (nameAndNamespace.length > 0) {
            if (nameAndNamespace.length > 2) {
                const namespace = nameAndNamespace.slice(0, nameAndNamespace.length - 1).join('/')
                return { name: nameAndNamespace[nameAndNamespace.length - 1], namespace: namespace }
            }
            return { name: nameAndNamespace[1], namespace: nameAndNamespace[0] }
        }
        return undefined
    }

    private getVersionFromURI(uri: URL): string | undefined {
        const nameVersion = uri.pathname.split('@')
        if (nameVersion.length > 1) {
            //check that the version doesnt have slashes to handle @v1.26.0/runtime/protoimpl
            return nameVersion[1].split('/')[0]
        }
        return undefined
    }

    private handleGoPkgIn(namespace: string): string {
        const foundV2 = GO_PKG_IN_V2.exec(namespace)
        if (foundV2) {
            return namespace.replace(GO_PKG_IN_V2, `github.com/$1/$2`)
        }

        const foundV1 = GO_PKG_IN_V1.exec(namespace)
        if (foundV1) {
            return namespace.replace(GO_PKG_IN_V1, `github.com/go-$1/$1`)
        }

        return namespace
    }
}