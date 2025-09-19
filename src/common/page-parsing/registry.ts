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
import { DefaultRepoRegistry } from "../repo-registry"
import { RepositoryId } from "../repo-type/types"
// import { AlpineLinuxOrgPageParser } from "./alpinelinux-org"
import { BasePageParser } from "./base"
import { CentralSonatypeComPageParser } from "./central-sonatype-com"
import { CocoaPodsOrgPageParser } from "./cocoapods-org"
import { ConanIoPageParser } from "./conan-io"
import { CranRPageParser } from "./cran-r-project-org"
import { CratesIoPageParser } from "./crates-io"
import { HuggingfaceCoPageParser } from "./huggingface-co"
import { MvnRepositoryComPageParser } from "./mvnrepository-com"
import { NpmJsComPageParser } from "./npmjs-com"
import { NugetOrgPageParser } from "./nuget-org"
import { PackagistOrgPageParser } from "./packagist-org"
import { PkgGoDevPageParser } from "./pkg-go-dev"
import { PypiOrgPageParser } from "./pypi-org"
import { RepoMavenApacheOrgPageParser } from "./repo-maven-apache-org"
import { Repo1MavenOrgPageParser } from "./repo1-maven-org"
import { RubygemsOrgPageParser } from "./rubygems-org"
import { SearchMavenOrgPageParser } from "./search-maven-org"

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
        this.parsers.set(pageParser.repoType.id, pageParser)
    }

    public setEnableDomAnnotation = (enabled: boolean): void => {
        for (const k of this.parsers.keys()) {
            this.parsers.get(k)?.setEnableDomAnnotation(enabled)
        }
    }
}

export const DefaultPageParserRegistry = new PageParserRegistry

// Register all standard repositories
// DefaultPageParserRegistry.registerPageParser(
//     new AlpineLinuxOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.PKGS_ALPINELINUX_ORG_PACKAGE))
// )
DefaultPageParserRegistry.registerPageParser(
    new CentralSonatypeComPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.CENTRAL_SONATYPE_COM))
)
DefaultPageParserRegistry.registerPageParser(
    new CocoaPodsOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.COCOAPODS_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new ConanIoPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.CONAN_IO_CENTER))
)
DefaultPageParserRegistry.registerPageParser(
    new CranRPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.CRAN_R_PROJECT_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new CratesIoPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.CRATES_IO))
)
DefaultPageParserRegistry.registerPageParser(
    new HuggingfaceCoPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.HUGGINGFACE_CO))
)
DefaultPageParserRegistry.registerPageParser(
    new MvnRepositoryComPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.MVNREPOSITORY_COM))
)
DefaultPageParserRegistry.registerPageParser(
    new NpmJsComPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.NPMJS_COM))
)
DefaultPageParserRegistry.registerPageParser(
    new NugetOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.NUGET_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new PackagistOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.PACKAGIST_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new PkgGoDevPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.PKG_GO_DEV))
)
DefaultPageParserRegistry.registerPageParser(
    new PypiOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.PYPI_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new Repo1MavenOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.REPO1_MAVEN_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new RepoMavenApacheOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.REPO_MAVEN_APACHE_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new RubygemsOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.RUBYGEMS_ORG))
)
DefaultPageParserRegistry.registerPageParser(
    new SearchMavenOrgPageParser(DefaultRepoRegistry.getRepoById(RepositoryId.SEARCH_MAVEN_ORG))
)