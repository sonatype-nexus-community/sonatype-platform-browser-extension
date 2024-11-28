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

import { REPOS } from "./Constants"
import { AlpineLinuxOrgPageParser } from "./PageParsing/Alpine"
import { BasePageParser } from "./PageParsing/BasePageParser"
import { CentralSonatypeComPageParser } from "./PageParsing/CentralSonatypeCom"
import { CocoaPodsOrgPageParser } from "./PageParsing/CocoaPodsOrg"
import { ConanIoPageParser } from "./PageParsing/ConanIo"
import { CranRPageParser } from "./PageParsing/CRAN"
import { CratesIoPageParser } from "./PageParsing/CratesIo"
import { HuggingfaceCoPageParser } from "./PageParsing/HuggingfaceCo"
import { MvnRepositoryComPageParser } from "./PageParsing/MVNRepository"
import { NpmJsComPageParser } from "./PageParsing/NpmJsCom"
import { NugetOrgPageParser } from "./PageParsing/NugetOrg"
import { PackagistOrgPageParser } from "./PageParsing/Packagist"
import { PkgGoDevPageParser } from "./PageParsing/PkgGoDev"
import { PypiOrgPageParser } from "./PageParsing/PypiOrg"
import { Repo1MavenOrgPageParser } from "./PageParsing/Repo1MavenOrg"
import { RepoMavenApacheOrgPageParser } from "./PageParsing/RepoMavenApacheOrg"
import { RubygemsOrgPageParser } from "./PageParsing/RubygemsOrg"
import { SearchMavenOrgPageParser } from "./PageParsing/SearchMavenOrg"
import { DefaultRepoRegistry } from "./RepoRegistry"

class PageParserRegistry {

    private readonly parsers = new Map<string, BasePageParser>

    getCount(): number {
        return this.parsers.size
    }

    getParserByRepoId(id: string): BasePageParser {
        for (const k of this.parsers.keys()) {
            if (k == id) {
                const p = this.parsers.get(k)
                if (p) return p
            }
        }
        
        throw new Error(`Unknown Parser requested from PageParserRegistry: ${id}`)
    }

    registerPageParser(pageParser: BasePageParser) {
        this.parsers.set(pageParser.repoType.id(), pageParser)
    }
}

export const DefaultPageParserRegistry = new PageParserRegistry

// Register all standard repositories
DefaultPageParserRegistry.registerPageParser(
    new AlpineLinuxOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.alpineLinux))
)
DefaultPageParserRegistry.registerPageParser(
    new CentralSonatypeComPageParser(DefaultRepoRegistry.getRepoById(REPOS.centralSonatypeCom))
)
DefaultPageParserRegistry.registerPageParser(
    new CocoaPodsOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.cocoaPodsOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new ConanIoPageParser(DefaultRepoRegistry.getRepoById(REPOS.conanIo))
)
DefaultPageParserRegistry.registerPageParser(
    new CranRPageParser(DefaultRepoRegistry.getRepoById(REPOS.cranRProject))
)
DefaultPageParserRegistry.registerPageParser(
    new CratesIoPageParser(DefaultRepoRegistry.getRepoById(REPOS.cratesIo))
)
DefaultPageParserRegistry.registerPageParser(
    new HuggingfaceCoPageParser(DefaultRepoRegistry.getRepoById(REPOS.huggingfaceCo))
)
DefaultPageParserRegistry.registerPageParser(
    new MvnRepositoryComPageParser(DefaultRepoRegistry.getRepoById(REPOS.mvnRepositoryCom))
)
DefaultPageParserRegistry.registerPageParser(
    new NpmJsComPageParser(DefaultRepoRegistry.getRepoById(REPOS.npmJsCom))
)
DefaultPageParserRegistry.registerPageParser(
    new NugetOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.nugetOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new PackagistOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.packagistOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new PkgGoDevPageParser(DefaultRepoRegistry.getRepoById(REPOS.pkgGoDev))
)
DefaultPageParserRegistry.registerPageParser(
    new PypiOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.pypiOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new Repo1MavenOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.repo1MavenOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new RepoMavenApacheOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.repoMavenApacheOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new RubygemsOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.rubyGemsOrg))
)
DefaultPageParserRegistry.registerPageParser(
    new SearchMavenOrgPageParser(DefaultRepoRegistry.getRepoById(REPOS.searchMavenOrg))
)