<!--
  - SPDX-FileCopyrightText: 2019-2024 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->
# Changelog

All notable changes to this project will be documented in this file.

## 0.13.0 - 2024-06-16
### Changed
* chore: use vue 2.7 reactive function
* chore: install nextcloud/l10n, use imported translate functions
* chore: Add SPDX headers and REUSE CI workflow
* chore: bump dependencies

## 0.12.0 - 2024-01-30
### Changed
* enh: Migrate to @nextcloud/vue 8.5.1
* chore(repo): Fix repository links
* chore: update node engines to next LTS
* chore: update workflows from templates
* chore: Update linting, update workflows and fix linting issues
* Cleanup package a bit by
* chore: Use shared vite config
* Updated dependencies

## 0.11.1 - 2023-04-26
### Added
* Add ESM package build

### Changed
* Bump dependencies

## 0.11.0 - 2023-04-26
### Changed
* Migrate to Vite
* Bump dependencies

## 0.10.0 - 2022-05-03
### Added
* This adds an additional isActive prop which can be set to only trigger collection loading if the integrating app decides to `CollectionListItem` is also exported now

### Fixed
* Load collections of different resources on change

### Changed
* Dependency updates

## 0.9.0 - 2020-11-09
### Changed
* Require @nextcloud/vue 3.x as a peer dependency
* Bump dependencies

## 0.6.0 - 2019-10-16
### Added
* Update CollectionList to fit new sidebar design

### Fixed
* Fix line-height between rows

### Changed
* Remove vuex dependency
* Bump dependencies

## 0.5.6 - 2019-07-29
### Fixed
* Force `defaultHtml` setting of v-tooltip to be disabled

## 0.5.5 - 2019-07-29
### Fixed
* Fix issue when iterating over types

## 0.5.4 - 2019-07-09
### Fixed
* Make internal vuex store work without interfering with no/existing vuex stores

## 0.1.1 - 2019-02-22
* First release