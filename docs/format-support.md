---
title: Format Support
layout: default
menus:
  main:
    title: Format Support
    weight: 50
---

### Public Registries

| Registry               | Language            | Enabled | URL                              | Component Version Navigation |
| ---------------------- | ------------------- | ------- | -------------------------------- | ------------------------------- |
| Alpine Linux           | Alpine Linux        | ✅      | `https://pkgs.alpinelinux.org/`  | ❌                              |
| Clojars                | Java                | ❌      | `https://clojars.org/`           | N/A                             |
| CocoaPods              | Swift / Objective-C | ✅      | `https://cocoapods.org/`         | ❌                              |
| Conan IO               | C / C++             | ✅      | `https://conan.io/center/`       | ✅                              |
| CRAN                   | R                   | ✅      | `https://cran.r-project.org`     | ❌                              |
| Crates.io              | Rust                | ✅      | `https://crates.io/`             | ✅                              |
| Go.dev                 | Go                  | ✅      | `https://pkg.go.dev/`            | ✅                              |
| Maven Central          | Java                | ✅      | `https://central.sonatype.com/`  | ✅                              |
| Maven Central (simple) | Java                | ✅      | `https://repo.maven.apache.org/` | ❌                              |
| Maven Central (simple) | Java                | ✅      | `https://repo1.maven.org/`       | ❌                              |
| Maven Central (old)    | Java                | ✅      | `https://search.maven.org/`      | ✅                              |
| MVN Repository         | Java                | ✅      | `https://mvnrepository.com/`     | ✅                              |
| NPM JS                 | Javascript          | ✅      | `https://www.npmjs.com/`         | ✅                              |
| NuGet Gallery          | .NET                | ✅      | `https://www.nuget.org/`         | ✅                              |
| Packagist              | PHP                 | ✅      | `https://packagist.org/`         | ✅                              |
| PyPI                   | Python              | ✅ <sup>2</sup>   | `https://pypi.org/`              | ✅                              |
| RubGems                | Ruby                | ✅      | `https://rubygems.org/`          | ✅                              |
| Spring.io              | Java                | ❌ <sup>1</sup>   | `https://repo.spring.io/list/`   | N/A                             |

_Notes:_

1. Run on a public instance of jFrog Artifactory - support coming soon
2. By default we lookup the Source Distribution. Where no Source Distribution is published we lookup the first Built Distribution - this can lead to an incomplete view of risk - [read more](#pypi-packages-with-no-source-distribution)

### Private Hosted Registries

Some public registires are hosted on instances of Sonatype Nexus Repository and jFrog Artifactory. You might also have private instances.

[Sonatype Nexus IQ Evaluation Extension](https://chrome.google.com/webstore/detail/mjehedmoboadebjmbmobpedkdgenmlhd) has support for both of these types, but this has yet to be ported to this extension.

### Missing or unsupported Registry?

Missing format or ecosystem? Why not raise an Issue to request?