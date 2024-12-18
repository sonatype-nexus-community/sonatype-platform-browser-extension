# [2.21.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.20.1...v2.21.0) (2024-11-26)


### Bug Fixes

* analytics events not well formed in some cases ([dd54e2e](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/dd54e2ee76c88a518a2a8c550006ad82627b5053))


### Features

* official support for Golang on `pkg.go.dev` ([e9b1af6](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/e9b1af65a90f4776d98d984bc246590856988279))

## [2.20.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.20.0...v2.20.1) (2024-11-25)


### Bug Fixes

* nuget.org parsing pages with no version in URL and ending with `/` ([e7a1cac](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/e7a1cac9cde19b4a83a60c4ae5ed99e9d9117b31))

# [2.20.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.19.1...v2.20.0) (2024-11-14)


### Bug Fixes

* PyPi Page Parsing tests failing in CI and locally [#138](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/138) ([6c2c2b8](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/6c2c2b83009b0c175c9bd61cd810782d02eae0c8))


### Features

* add release workflow in GitHub actions ([d2f1f9c](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/d2f1f9ca17e8fa02bbc67a23463f2d1ec217774d))
* remove CircleCI configuration ([8bac23f](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/8bac23ff065d2d392dc2026661deeab2239a8f27))

## [2.19.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.19.0...v2.19.1) (2024-10-24)


### Bug Fixes

* update the titleSelector to h2 for npm. [#135](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/135) ([50da737](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/50da7377d4919dd2ce89313505d40effd0aa3f07))

# [2.19.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.18.1...v2.19.0) (2024-09-03)


### Bug Fixes

* updated CA and ES  description to be less than 132 characters ([3f4d7ff](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/3f4d7ffef8d3014ca97ce4c8ab2a2337d9fec05f))
* updated EL description to be less than 132 characters ([6401391](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/64013916a4550378307661bb64f9101b7054beca))
* updated finnish description to be less than 132 characters ([48d881d](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/48d881d009413e5ae78cc2c6dafd65810c703b81))
* updated FR description to be less than 132 characters ([4d1996d](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/4d1996d65268056424dd22212755f3738a103ac6))
* updated FR description to be less than 132 characters ([b1f0014](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/b1f0014b4d9a6164b0a0e21ae208b9d0aa1de501))
* updated german description to be less than 132 characters ([386ff9c](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/386ff9cc59a2015858f3e8d64e6dc51ee7efade0))
* updated PT descriptions to be less than 132 characters ([8690fe4](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/8690fe4299f9a7c0f352426ec91abf15ab4e6d27))


### Features

* add Integrity and Hygiene ratings if present ([dc639f5](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/dc639f5d0920a5f553ad9c98ff3561ed4e20d0e2))
* update translations for integrity and hygiene ratings ([93eb943](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/93eb9431843c32a58060b6245f7853e16e5921e6))

## [2.18.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.18.0...v2.18.1) (2024-08-27)


### Bug Fixes

* attempt to resolve [#126](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/126) by pinning version of `semantic-release` ([ca6ba79](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/ca6ba79e5a21174ad16720dba993e81957672af5))

# [2.18.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.17.1...v2.18.0) (2024-08-27)


### Features

* support PyPi packages where there is no source distribution published ([3d652f7](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/3d652f72f38b0c7f5c9fddce8ba7aec65194283c))

## [2.17.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.17.0...v2.17.1) (2024-04-26)


### Bug Fixes

* handle npmjs.com when package flagged as deprecated [#120](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/120) ([72087a8](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/72087a8d1117011a6c84c75b5f10b5d0ccabc3ad))

# [2.17.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.16.0...v2.17.0) (2024-04-02)


### Bug Fixes

* updated Page Parsing test data to be more deterministic ([dc922bb](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/dc922bb6a5b768defcf39b672026cde966a26e6b))


### Features

* support crates.io for Cargo ([c0b09e3](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/c0b09e303b69a74e7988282cd0d22fc2471b1271))

# [2.16.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.15.1...v2.16.0) (2024-03-12)


### Features

* build with Node 20 (LTS) ([fffe2d1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/fffe2d14bc9020080960655d4460d05c8d4c176b))
* updated dependencies as part of cadence ([11626cf](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/11626cf147e6fb5bd29a381c98907da281a8087d))

## [2.15.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.15.0...v2.15.1) (2024-01-03)


### Bug Fixes

* not all versions reported for some Python Packages [#113](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/113) ([1aab858](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/1aab858a17e8cd3c4c993b47d68c5ec22e82407b))

# [2.15.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.14.0...v2.15.0) (2024-01-02)


### Bug Fixes

* support Python Projects where Source Distribution is not `.tar.gz` as per PEP-0625 ([8a883df](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/8a883df5b5340d0d186c80220140949a1dff0f18))


### Features

* bump dependencies to latest to mitigate any known security issues ([2919810](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/29198106d60bd1d0fbb7ff4f132ed3d66b945f41))

# [2.14.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.13.1...v2.14.0) (2023-11-01)


### Features

* support navigation to versions of components for supported Public Registries ([#108](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/108)) ([2dbcc12](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/2dbcc12d2775cc90bb3447a263929aad9edde3a0))

## [2.13.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.13.0...v2.13.1) (2023-10-16)


### Bug Fixes

* more accurate DOM parsing for NPMJS which resolves navigation during brower history buttons ([#105](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/105)) ([36a6f87](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/36a6f8769ce32906d45f4f7f096f6dc85c84bbe2))

# [2.13.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.12.1...v2.13.0) (2023-10-16)


### Features

* automatically prompt user for updated credentials if they become invalid during use ([#103](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/103)) ([f3273bf](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/f3273bf5ca1986d678be3f89f192c96a1c3bc798))

## [2.12.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.12.0...v2.12.1) (2023-10-12)


### Bug Fixes

* Maven Central page parsing updates ([#101](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/101)) ([5260fa7](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/5260fa75c7af6318fe702e8d8467707ca8fb51bd))
* page annotation for npmjs.org change due to page html updates ([#100](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/100)) ([9a17066](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/9a1706622426612b3fb305afa7a453a72f4629d3))

# [2.12.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.11.0...v2.12.0) (2023-09-29)


### Features

* update page parsing due to npmjs.com HTML changes ([#95](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/95)) ([7ec5a10](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/7ec5a101211a46672b36e56d690414dc7a0531b9))

# [2.11.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.7...v2.11.0) (2023-09-11)


### Features

* update for Maven Central changes ([#93](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/93)) ([be7527f](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/be7527f359c3fa459ac58aedb92a3a97a5517361))

## [2.10.7](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.6...v2.10.7) (2023-09-07)


### Bug Fixes

* update Maven Central parsing to assume `type=jar` unless packaging is `aar`, `ear`, `jar` or `war` ([a9b2eac](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/a9b2eacc66285ac190a2d878e7dd7082849535c2))

## [2.10.6](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.5...v2.10.6) (2023-09-07)


### Bug Fixes

* force Maven Central components with packaging `bundle` to be `jar` ([18ee74b](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/18ee74b8794012b827c0c846f2ddfdd366262981))

## [2.10.5](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.4...v2.10.5) (2023-09-06)


### Bug Fixes

* detect packaging format for Maven Central from POM XML rather than always assuming `jar` ([3fa2723](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/3fa27230d022bca2a56a15e825e807b5aa6a96fe))
* detect source extension format for PyPi rather than always assuming `tar.gz` ([3635a05](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/3635a05cabacaae0f29ca028ee20bb01798ac40e))

## [2.10.4](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.3...v2.10.4) (2023-08-29)


### Bug Fixes

* [#82](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/82) - remove value on text input to stop overwrite ([058c471](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/058c47194fc48b2fec968377abe87f44b5afb650))

## [2.10.3](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.2...v2.10.3) (2023-08-24)


### Bug Fixes

* [#80](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/80) - fix the date formats when in between groupings ([2b83fdf](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/2b83fdf75eba34f7d8257642172cbcaaa9d9c4f5))

## [2.10.2](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.1...v2.10.2) (2023-08-22)


### Bug Fixes

* Sonatype IQ Server URL is not visually persisted in Options ([9f43b4b](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/9f43b4be244e1e65d76e46b3502a85a971e1c812))

## [2.10.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.10.0...v2.10.1) (2023-08-22)


### Bug Fixes

* udpate dom selector for conan.io for annotating the page ([509359f](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/509359fe2039353b4d94bbc43327a0354f1196cd))
* update to handle URL and HTML changes for conan.io [#69](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/69) ([dc33c88](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/dc33c88a1a59cf838e1f528fe5047085769e4a2a))

# [2.10.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.9.0...v2.10.0) (2023-08-21)


### Bug Fixes

* don't remove first application when no  to fix [#63](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/63) ([3698d6d](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/3698d6d886c8fef9c95a8bfcb0570b8de6b3dadc))
* upgrade internal configuration model (set defaults) when extension is upgraded to prevent [#64](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/64) ([ba23e3c](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/ba23e3c1d33a3bb66502dcfab240947fdc9e6384))
* upgrade internal configuration when Extension is upgraded ([21c7b7b](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/21c7b7b94685361db09d0645de04e138e86d795b))


### Features

* localisation in Greek ([ec73d2b](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/ec73d2b7c50cb161dcf2a56df825d5d6f965ec50))

# [2.9.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.8.0...v2.9.0) (2023-08-10)


### Bug Fixes

* add missing lifecycle icon in toolbar ([654d495](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/654d495ccbc57f6a73497ea3bc62de72dfe0dda6))
* missing icon in Popup corrected ([f891d77](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/f891d77c916386864f1cb10b39e3d7dab59ecbcf))


### Features

* add basic usage analytics collection ([#59](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/59)) ([9ad33df](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/9ad33df2fbf517de46258f5fcc894177bba57377))
* add localisation support in Catalan and Spanish ([409059b](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/409059be0b70e2bd09b83cb88c273f4a525091b3))
* localisation in Chinese ([fab01d2](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/fab01d2389b6621aed1cfba9f43a06ceb79f30e9))
* localisation in Taiwanese ([cc722f0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/cc722f04e037858648e4edcb6d114fca8634a0f1))
* support private Sonatype Nexus Repository instances as OSS Registries ([#49](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/49)) ([141e66e](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/141e66e8d202f73088a1d2e82c50902644457372))

# [2.8.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.7.0...v2.8.0) (2023-07-31)


### Features

* add release process to Microsoft Edge Webstore ([#19](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/19)) ([f981ed1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/f981ed1c35c520127a44cbdd98215cae9bc8576e))

# [2.7.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.6.0...v2.7.0) (2023-07-20)


### Bug Fixes

* additional French translations ([9bb453c](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/9bb453c0ddd5a6811d7a52bf45fc691384f6f7f1))
* additional translations for French ([e605120](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/e60512045a421fbf3c0e22d598f5b14d7cbaa0cd))
* additional translations for Korean ([969199b](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/969199b411b5f88a755f97d39c75b374544c357a))


### Features

* update icons for accessibility ([#48](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/48)) ([65a5aa8](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/65a5aa841e6b4face9005d00dfd84966b780770c))

# [2.6.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.5.1...v2.6.0) (2023-07-19)


### Bug Fixes

* typos in french translation ([#43](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/43)) ([215ff97](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/215ff97a5fed382b70f5bac275f1e6e70f7f7c31))


### Features

* add localisation support for Portugal and Brazil (Portuguese) ([124b39f](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/124b39f27978f245f971917fe6952b6b02d9d5f7))
* determine Sonatype IQ Server licensed capabilities with user feedback ([#41](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/41)) ([da4d40d](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/da4d40d066847ed3748b523f87bac241d12ba370))

## [2.5.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.5.0...v2.5.1) (2023-07-19)


### Bug Fixes

* fix typo in English ([7503b8d](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/7503b8d16a9ced00716d23f7a6da081bc3e487ad))

# [2.5.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.4.0...v2.5.0) (2023-07-19)


### Features

* add localisation support for German ([#40](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/40)) ([315629f](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/315629f85eaad0a058e21e73a31d3d0b9e0565b5))

# [2.4.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.3.1...v2.4.0) (2023-07-19)


### Features

* add localisation support for Korean ([56f62e7](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/56f62e73585421c438dcb08198a5481adcac142d))

## [2.3.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.3.0...v2.3.1) (2023-07-18)


### Bug Fixes

* improvements to French localisation ([ee9df37](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/ee9df37d5c54271d2cee7f45615c994abf6896b7))

# [2.3.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.2.1...v2.3.0) (2023-07-17)


### Features

* add localisation in Finnish ([59ac34f](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/59ac34f320f4e2012bec229b907d6f6dbca02eed))
* add localisation in French ([49d1bf1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/49d1bf16726cbeb709f9a53442c17d41a086b6c6))

## [2.2.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.2.0...v2.2.1) (2023-07-14)


### Bug Fixes

* incorrect PURL derived for RubyGems when platform was present [#28](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/28) ([4514424](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/45144248d382174577dd4ac203072db1ed5e56dd))

# [2.2.0](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.1.2...v2.2.0) (2023-07-13)


### Features

* implement histogram type view for policy violation types on all versions ([c528f17](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/c528f1729755243ef0e50e5f32a54c036734cebb))

## [2.1.2](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.1.1...v2.1.2) (2023-07-13)


### Bug Fixes

* Obtain version of this extension from the manifest ([a89c48c](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/a89c48cc010b608a4cbc50206b7d2a6b5ffbfd6c))

## [2.1.1](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/compare/v2.1.0...v2.1.1) (2023-07-12)


### Bug Fixes

* handle `repo.maven.apache.org` when no version is known [#16](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/16) ([e5bcb29](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/commit/e5bcb294aeb7d00bd92f7b87bad9cbbad4d407d0))

# Changelog

## 2.1.0

### Features

-   We've added a spinning Sonatype logo to pages during Component Evaluation to make it clearer evaluation is in progress [#14](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/14)
-   We've improved the Application selector in the Options page to ensure an Application is selected by the user [#15](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/15)

### Fixes

-   Tooltips were not working - they are now! [#13](https://github.com/sonatype-nexus-community/sonatype-platform-browser-extension/issues/13)

## 2.0.1

### Fixes

-   Fix for #10

## 2.0.0

Initial Release!

We released this new extension starting at version 2.0.0 to avoid any confusion with our old [Chrome Extension](https://chrome.google.com/webstore/detail/mjehedmoboadebjmbmobpedkdgenmlhd).
