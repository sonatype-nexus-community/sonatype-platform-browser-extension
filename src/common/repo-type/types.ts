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

export enum RepositoryId {
    ANACONDA_ORG_CONDA_FORGE = 'ANACONDA_ORG_CONDA_FORGE',
    CENTRAL_SONATYPE_COM = 'CENTRAL_SONATYPE_COM',
    COCOAPODS_ORG = 'COCOAPODS_ORG',
    CONAN_IO_CENTER = 'CONAN_IO_CENTER',
    CRAN_R_PROJECT_ORG = 'CRAN_R_PROJECT_ORG',
    CRATES_IO = 'CRATES_IO',
    HUGGINGFACE_CO = 'HUGGINGFACE_CO',
    MVNREPOSITORY_COM = 'MVNREPOSITORY_COM',
    NPMJS_COM = 'NPMJS_COM',
    NUGET_ORG = 'NUGET_ORG',
    PACKAGIST_ORG = 'PACKAGIST_ORG',
    PKG_GO_DEV = 'PKG_GO_DEV',
    PKGS_ALPINELINUX_ORG_PACKAGE = 'PKGS_ALPINELINUX_ORG_PACKAGE',
    PYPI_ORG = 'PYPI_ORG',
    REPO_MAVEN_APACHE_ORG = 'REPO_MAVEN_APACHE_ORG',
    REPO1_MAVEN_ORG = 'REPO1_MAVEN_ORG',
    RUBYGEMS_ORG = 'RUBYGEMS_ORG',
    SEARCH_MAVEN_ORG = 'SEARCH_MAVEN_ORG',
}

export interface RepoType {
    // Unique & Static Identifier for this Repository
    id: string          
    // Repo Format
    format: string
    // URL to the base of the Repository without package or version
    baseUrl: string
    // DOM selector to find the Package Title - used to annotate the page
    titleSelector: string
    // URL format with placeholders
    versionPath: string
    // Regex for parsing URL
    pathRegex: RegExp
    // DOM selector to find component version on the page (not always in the URL)
    versionDomPath: string
    // Whether to allow navigation using this extension to different versions
    supportsVersionNavigation: boolean
}