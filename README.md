<br />
<p align="center">
    <a href="https://github.com/EdurtIO/incubator-dbm">
      <img src="src/shared/assets/icons/favicon.png" alt="Logo" width="120px" height="120px">
    </a>
    <h2 align="center">DBM</h3>
    <p align="center">
    An awesome database management tool specified for <a href='https://clickhouse.tech'>ClickHouse</a>. For more information: <a href='https://dbm.incubator.edurt.io'>https://dbm.incubator.edurt.io</a>.
    <br />
  </p>
</p>

---

Contributors:

![GitHub Contributors Image](https://contrib.rocks/image?repo=EdurtIO/dbm)

Basic:

![](https://visitor-badge.glitch.me/badge?page_id=dbm)
![version](https://img.shields.io/github/v/release/EdurtIO/dbm.svg)

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/downloads-pre/EdurtIO/dbm/latest/total?style=flat-square)
![GitHub all releases](https://img.shields.io/github/downloads/EdurtIO/dbm/total?style=flat-square)

![GitHub branch checks state](https://img.shields.io/github/checks-status/EdurtIO/dbm/master?style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/EdurtIO/dbm?style=flat-square)

![GitHub commit activity](https://img.shields.io/github/commit-activity/y/EdurtIO/dbm?style=flat-square)
![GitHub contributors](https://img.shields.io/github/contributors-anon/EdurtIO/dbm?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/EdurtIO/dbm?style=flat-square)

Workflow:

[![Test by push](https://github.com/EdurtIO/dbm/actions/workflows/push-compile-test.yml/badge.svg)](https://github.com/EdurtIO/dbm/actions/workflows/push-compile-test.yml)

[![Publish New Release](https://github.com/EdurtIO/dbm/actions/workflows/publish-release.yml/badge.svg)](https://github.com/EdurtIO/dbm/actions/workflows/upload-to-release.yml)

[![Publish docs via GitHub Pages](https://github.com/EdurtIO/dbm/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/EdurtIO/dbm/actions/workflows/publish-docs.yml)

Development:

[![codebeat badge](https://codebeat.co/badges/a291d700-2d4b-435f-aa70-468bd1800d19)](https://codebeat.co/projects/github-com-edurtio-incubator-dbm-master)
[![With Electron](https://img.shields.io/badge/with-electron-blue.svg)](https://electronjs.org/) 
[![With Angular](https://img.shields.io/badge/with-angular-blue.svg)](https://angular.io/)
[![With Jetbrains](https://img.shields.io/badge/with-Jetbrains-blue.svg)](https://www.jetbrains.com/)

GitHub:

[![GitHub stars](https://img.shields.io/github/stars/EdurtIO/incubator-dbm?style=for-the-badge)](https://github.com/EdurtIO/incubator-dbm/stargazers)
[![GitHub license](https://img.shields.io/github/license/EdurtIO/incubator-dbm?style=for-the-badge)](https://github.com/EdurtIO/incubator-dbm/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/EdurtIO/incubator-dbm?style=for-the-badge)](https://github.com/EdurtIO/incubator-dbm/issues)
[![GitHub forks](https://img.shields.io/github/forks/EdurtIO/incubator-dbm?style=for-the-badge)](https://github.com/EdurtIO/incubator-dbm/network)

## Join Us

Open the DingTalk software and scan the following QR code to join

<img src="src/shared/common/dingtalk.jpg" width="200px" height="250px"></img>

## Thank you

- [Jetbrains](https://www.jetbrains.com/)

## :rocket: Features

- Support query history (pagination, clear all, etc.)
- Support selected sql clauses query
- Support terminating query
- Support table management
  - Delete table operation
  - Get ddl operation
  - Get table preview data operation
  - Rename table operation
- Support column management
  - Add column operation
  - Delete column operation
  - Get column info operation
  - Modify column operation
  - Rename column operation
- Support database management (delete, create)
- Support custom query
- Support multiple data sources management(connection test, monitoring)
- Support customized appearance
- Support monitor (processor, connection, query)
- Support migrate data

## :laughing: Download

- [Windows](https://github.com/EdurtIO/incubator-dbm/releases/download/1.4.0/dbm-win.zip)
- [Mac](https://github.com/EdurtIO/incubator-dbm/releases/download/1.4.0/dbm-mac.tar.gz)

## :gear: Installation

macOS and Windows

- Download zip from [here](https://github.com/EdurtIO/incubator-dbm/releases).
- Unzip the archive, and install to macOS Applications.

Other platforms

- Unsupported temporarily. You can install the DBM by [building from source](#hammer_and_wrench-build-from-source).

Install other versions?

- Go ahead to [Github Release](https://github.com/EdurtIO/incubator-dbm/releases) for all releases.

## :hammer_and_wrench: Build from source

1. Install dependencies

```bash
npm install -g node-sass

yarn install
```

2. Build electron app for production

```bash
yarn run build
```

3. Install from built zip: `./build/dbm-<OS>.*`

4. Run dev mode

```bash
yarn run dev
```

or

```bash
npm start
```
