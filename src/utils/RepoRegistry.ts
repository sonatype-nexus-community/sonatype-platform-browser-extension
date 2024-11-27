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

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

import { logger, LogLevel } from "../logger/Logger"
import { BaseRepo } from "./RepoType/BaseRepo"
import { AlpineLinuxOrgRepo } from "./RepoType/Alpine"
import { CentralSonatypeComRepo } from "./RepoType/CentralSonatypeCom"
import { CocoaPodsOrgRepo } from "./RepoType/CocoaPodsOrg"
import { ConanIoRepo } from "./RepoType/ConanIo"
import { CranRRepo } from "./RepoType/CRAN"
import { CratesIoRepo } from "./RepoType/CratesIo"
import { HuggingfaceCoRepo } from "./RepoType/HuggingfaceCo"
import { MvnRepositoryComRepo } from "./RepoType/MVNRepository"
import { NpmJsComRepo } from "./RepoType/NpmJsCom"
import { NugetOrgRepo } from "./RepoType/NugetOrg"
import { PackagistOrgRepo } from "./RepoType/Packagist"
import { PkgGoDevRepo } from "./RepoType/PkgGoDev"
import { PypiOrgRepo } from "./RepoType/PypiOrg"
import { RepoMavenApacheOrgRepo } from "./RepoType/RepoMavenApacheOrg"
import { Repo1MavenOrgRepo } from "./RepoType/Repo1MavenOrg"
import { RubygemsOrgRepo } from "./RepoType/RubygemsOrg"
import { SearchMavenOrgRepo } from "./RepoType/SearchMavenOrg"

class RepoRegistry {

    private repos = new Map<string, BaseRepo>

    getCount(): number {
        return this.repos.size
    }

    getRepoById(id: string): BaseRepo {
        for (const k of this.repos.keys()) {
            const r = this.repos.get(k)
            if (r && r.id() == id) {
                return r
            }
        }
        
        throw new Error(`Unknown Repo requested from RepoRegistry: ${id}`)
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