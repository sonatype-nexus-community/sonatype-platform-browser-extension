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

import { logger, LogLevel } from "./logger"
import { AlpineLinuxOrgRepo } from "./repo-type/alpine"
import { BaseRepo } from "./repo-type/base"
import { CentralSonatypeComRepo } from "./repo-type/central-sonatype-com"
import { CocoaPodsOrgRepo } from "./repo-type/cocoa-pods-org"
import { ConanIoRepo } from "./repo-type/conan-io"
import { CranRProjectOrg } from "./repo-type/cran-r-project-org"
import { CratesIoRepo } from "./repo-type/crates-io"
import { HuggingfaceCoRepo } from "./repo-type/huggingface-co"
import { MvnRepositoryComRepo } from "./repo-type/mvnrepository-com"
import { NpmJsComRepo } from "./repo-type/npmjs-com"
import { NugetOrgRepo } from "./repo-type/nuget-org"
import { Nxrm3Repo } from "./repo-type/nxrm3"
import { PackagistOrgRepo } from "./repo-type/packagist-org"
import { PkgGoDevRepo } from "./repo-type/pkg-go-dev"
import { PypiOrgRepo } from "./repo-type/pypi-org"
import { RepoMavenApacheOrgRepo } from "./repo-type/repo-maven-apache-org"
import { Repo1MavenOrgRepo } from "./repo-type/repo1-maven-org"
import { RubygemsOrgRepo } from "./repo-type/rubygems-org"
import { SearchMavenOrgRepo } from "./repo-type/search-maven-org"
import { ExternalRepositoryManager, ExternalRepositoryManagerType, SonatypeNexusRepostitoryHost } from "./configuration/types"

// This is used by Extension Service Worker - cannot directly or indirectly require
// access to DOM.

class RepoRegistry {

    private readonly repos = new Map<string, BaseRepo>

    getCount(): number {
        return this.repos.size
    }

    getRepoById(id: string): BaseRepo {
        for (const k of this.repos.keys()) {
            const r = this.repos.get(k)
            if (r && r.id == id) {
                return r
            }
        }
        
        throw new Error(`Unknown Repo requested from RepoRegistry: ${id}`)
    }

    getRepoForUrl(url: string): BaseRepo | undefined {
        for (const k of this.repos.keys()) {
            const r = this.repos.get(k)
            if (r && url.startsWith(r.baseUrl)) {
                logger.logGeneral(`Current URL ${url} matches ${r.id}`, LogLevel.DEBUG)
                return r
            } else {
                logger.logGeneral(`Current URL ${url} does not match ${r?.id}`, LogLevel.TRACE)
            }
        }
        
        return undefined
    }

    registerExternalRepositoryManager = (externalRepoManager: ExternalRepositoryManager): void => {
        switch (externalRepoManager.type) {
            case ExternalRepositoryManagerType.NXRM3:
                this.registerRepo(new Nxrm3Repo(externalRepoManager.id, externalRepoManager.url, externalRepoManager.version))
        }
    }

    registerRepo(repo: BaseRepo) {
        this.repos.set(repo.id, repo)
    }
}

export const DefaultRepoRegistry = new RepoRegistry

// Register all standard repositories
DefaultRepoRegistry.registerRepo(new AlpineLinuxOrgRepo)
DefaultRepoRegistry.registerRepo(new CentralSonatypeComRepo)
DefaultRepoRegistry.registerRepo(new CocoaPodsOrgRepo)
DefaultRepoRegistry.registerRepo(new ConanIoRepo)
DefaultRepoRegistry.registerRepo(new CranRProjectOrg)
DefaultRepoRegistry.registerRepo(new CratesIoRepo)
DefaultRepoRegistry.registerRepo(new HuggingfaceCoRepo)
DefaultRepoRegistry.registerRepo(new MvnRepositoryComRepo)
DefaultRepoRegistry.registerRepo(new NpmJsComRepo)
DefaultRepoRegistry.registerRepo(new NugetOrgRepo)
DefaultRepoRegistry.registerRepo(new PackagistOrgRepo)
DefaultRepoRegistry.registerRepo(new PkgGoDevRepo)
DefaultRepoRegistry.registerRepo(new PypiOrgRepo)
DefaultRepoRegistry.registerRepo(new RepoMavenApacheOrgRepo)
DefaultRepoRegistry.registerRepo(new Repo1MavenOrgRepo)
DefaultRepoRegistry.registerRepo(new RubygemsOrgRepo)
DefaultRepoRegistry.registerRepo(new SearchMavenOrgRepo)
