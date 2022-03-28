---
template: overrides/main.html
---

DBM is a cross-platform ClickHouse GUI desktop tool.

#### System requirements

---

!!! warning

    The binary package of the software was compiled and tested based on the following system, has not been tested on other versions and is theoretically supported.

    If unsupported systems use source compilation, actively compile binaries.

| System  | version      |
|---------|--------------|
| Windows | windows-2022 |
| macOS   | 11           |
| Ubuntu  | 20.04 LTS    |

#### Binary installation

---

!!! note

    Download the binary software package to install the system.

- [GitHub Release](https://github.com/EdurtIO/dbm/releases/latest)

#### The source code to install

---

!!! warning

    To manually compile and install DBM, follow these steps.

    The system needs to install `yarn` , if the command is not installed, please replace `yarn` with `npm` to execute

- Clone the source code to this machine

```bash
git clone https://github.com/EdurtIO/dbm.git
```

- Install `node-sass` external dependencies

```bash
yarn add node-sass
```

- Install software dependencies

```bash
yarn install
```

- Compile and build the app

```bash
yarn run release
```

!!! warning

    After the compilation is completed, the `dbm-<version>-<os>-<arch>.zip` package will be generated in the `release` directory.

    You can install it with the relevant package.

!!! note

    If you do not want to install to the local software directory, you can use the following methods to start the development mode for software use.

```bash
yarn run dev
```
