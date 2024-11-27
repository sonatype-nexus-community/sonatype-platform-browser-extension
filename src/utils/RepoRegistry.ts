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

import { BaseRepo } from "./Types"
import { AlpineLinuxOrgRepo } from "./PageParsing/Alpine"
import { CentralSonatypeComRepo } from "./PageParsing/CentralSonatypeCom"
import { CocoaPodsOrgRepo } from "./PageParsing/CocoaPodsOrg"
import { ConanIoRepo } from "./PageParsing/ConanIo"
import { CranRRepo } from "./PageParsing/CRAN"
import { CratesIoRepo } from "./PageParsing/CratesIo"
import { HuggingfaceCoRepo } from "./PageParsing/HuggingfaceCo"
import { MvnRepositoryComRepo } from "./PageParsing/MVNRepository"
import { NpmJsComRepo } from "./PageParsing/NpmJsCom"
import { NugetOrgRepo } from "./PageParsing/NugetOrg"
import { PackagistOrgRepo } from "./PageParsing/Packagist"
import { PkgGoDevRepo } from "./PageParsing/PkgGoDev"
import { PypiOrgRepo } from "./PageParsing/PypiOrg"
import { Repo1MavenOrgRepo } from "./PageParsing/Repo1MavenOrg"
import { RepoMavenApacheOrgRepo } from "./PageParsing/RepoMavenApacheOrg"
import { RubygemsOrgRepo } from "./PageParsing/RubygemsOrg"
import { SearchMavenOrgRepo } from "./PageParsing/SearchMavenOrg"
import { logger, LogLevel } from "../logger/Logger"


class RepoRegistry {

    private repos = new Map<string, BaseRepo>

    getCount(): number {
        return this.repos.size
    }

    getRepoById(id: string): BaseRepo | undefined {
        for (const k of this.repos.keys()) {
            const r = this.repos.get(k)
            if (r && r.id() == id) {
                return r
            }
        }
        
        return undefined
    }

    getRepoForUrl(url: string): BaseRepo | undefined {
        for (const k of this.repos.keys()) {
            const r = this.repos.get(k)
            if (r && url.startsWith(r.baseUrl())) {
                logger.logMessage(`Current URL ${url} matches ${r.id()}`, LogLevel.INFO)
                return r
            } else {
                logger.logMessage(`Current URL ${url} does not match ${r?.id()}`, LogLevel.TRACE)
            }
        }
        
        return undefined
    }

    registerRepo(repo: BaseRepo) {
        this.repos.set(repo.id(), repo)
    }
}

export const DefaultRepoRegistry = new RepoRegistry

// Register all standard repositories
DefaultRepoRegistry.registerRepo(new AlpineLinuxOrgRepo)
DefaultRepoRegistry.registerRepo(new CentralSonatypeComRepo)
DefaultRepoRegistry.registerRepo(new CocoaPodsOrgRepo)
DefaultRepoRegistry.registerRepo(new ConanIoRepo)
DefaultRepoRegistry.registerRepo(new CranRRepo)
DefaultRepoRegistry.registerRepo(new CratesIoRepo)
DefaultRepoRegistry.registerRepo(new HuggingfaceCoRepo)
DefaultRepoRegistry.registerRepo(new MvnRepositoryComRepo)
DefaultRepoRegistry.registerRepo(new NpmJsComRepo)
DefaultRepoRegistry.registerRepo(new NugetOrgRepo)
DefaultRepoRegistry.registerRepo(new PackagistOrgRepo)
DefaultRepoRegistry.registerRepo(new PkgGoDevRepo)
DefaultRepoRegistry.registerRepo(new PypiOrgRepo)
DefaultRepoRegistry.registerRepo(new Repo1MavenOrgRepo)
DefaultRepoRegistry.registerRepo(new RepoMavenApacheOrgRepo)
DefaultRepoRegistry.registerRepo(new RubygemsOrgRepo)
DefaultRepoRegistry.registerRepo(new SearchMavenOrgRepo)