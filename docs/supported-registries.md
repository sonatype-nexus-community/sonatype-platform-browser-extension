---
title: Supported Open Source Registries
layout: default
menus:
    main:
        title: Supported Registries
        weight: 50
toc: true
---

## Public Open Source Registries

The following are the supported public Open Source Registries.

| Type / Language         | Registry                         | [Multi-Component]({{ 'usage.html#multiple-components-identified' | relative_url }})? | Further Details                                                    |
| ----------------------- | -------------------------------- | ---------------- | ------------------------------------------------------------------ |
| AI / ML                 | `https://huggingface.co`         | ✅               | [here]({{ 'registry-details/hugging-face.html' \| relative_url }}) |
| C / C++                 | `https://conan.io/center/`       | −                |                                                                    |
| DotNet (.NET)           | `https://www.nuget.org/`         | -                |                                                                    |
| Go / Golang             | `https://pkg.go.dev/`            | -                |                                                                    |
| Java                    | `https://central.sonatype.com/`  | -                |                                                                    |
| Java                    | `https://repo.maven.apache.org/` | -                |                                                                    |
| Java                    | `https://repo1.maven.org/`       | -                |                                                                    |
| Java                    | `https://search.maven.org/`      | -                |                                                                    |
| Java                    | `https://mvnrepository.com/`     | -                |                                                                    |
| Javascript / Typescript | `https://www.npmjs.com/`         | -                |                                                                    |
| PHP                     | `https://packagist.org/`         | -                |                                                                    |
| Python                  | `https://pypi.org`               | ✅               |                                                                    |
| R / Cran                | `https://cran.r-project.org`     | -                |                                                                    |
| Ruby                    | `https://rubygems.org/`          | -                |                                                                    |
| Rust                    | `https://crates.io/`             | -                |                                                                    |
| Swift / Objective-C     | `https://cocoapods.org/`         | -                |                                                                    |


## Private Open Source Registries

Through [Advanced Configuration]({{ 'configure-external-repository-managers.html' | relative_url }}), you can also configure private installations of Sonatype Nexus Repository Manager 3.

### Supported Formats for Sonatype Nexus Repository Manager 3

-   CocoaPods
-   Cran / R
-   Maven
-   PyPi
-   Ruby
