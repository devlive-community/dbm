<br />
<p align="center">
    <a href="https://github.com/EdurtIO/incubator-dbm">
      <img src="static/images/logo.svg" alt="Logo" width="120px" height="120px">
    </a>
    <h2 align="center">DBM(Incubator)</h3>
    <p align="center">
    An awesome database management tool specified for <a href='https://clickhouse.tech'>ClickHouse</a>. For more information: <a href='https://dbm.incubator.edurt.io'>https://dbm.incubator.edurt.io</a>.
    <br />
  </p>
</p>

---

## :rocket: Features

- Support query history (pagination, clear all, etc.)
- Support selected sql clauses query
- Support terminating query
- Support table management (metadata, delete, preview)
- Support database management (delete, create)
- Support custom query
- Support multiple data sources management(connection test, monitoring)
- Support customized appearance
- Support monitor (processor, connection, query)

## :gear: Installation

macOS

- Download zip from [here](/releases/download/1.3.0-SNAPSHOT/DBM-Incubator-mac.zip).
- Unzip the archive, and install to macOS Applications.

Other platforms

- Unsupported temporarily. You can install the DBM by [building from source](#hammer_and_wrench-build-from-source).

Install other versions?

- Go ahead to [Github Release](/releases) for all releases.

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

3. Install from built zip: `./build/dbm-<VERSION>-<OS>.zip`

4. Run dev mode

```bash
yarn run dev
```

or

```bash
npm start
```
