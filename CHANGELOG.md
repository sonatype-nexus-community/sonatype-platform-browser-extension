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
