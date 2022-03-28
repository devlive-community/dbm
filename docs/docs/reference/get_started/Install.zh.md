---
template: overrides/main.html
---

DBM是一个跨平台的ClickHouse GUI桌面工具.

#### 系统要求

---

!!! warning

    软件的二进制包基于以下系统进行编译并测试通过,尚未在其他版本上测试,理论上是支持的.

    如有不支持的系统使用源码编译方式,主动编译二进制文件.

|系统| 版本           |
|---|--------------|
|Windows| windows-2022 |
|macOS| 11           |
|Ubuntu| 20.04 LTS    |

#### 二进制安装

---

!!! note

    通过以下地址下载对应系统的二进制软件包进行安装.

- [GitHub Release](https://github.com/EdurtIO/dbm/releases/latest)

#### 源码安装

---

!!! warning

    要手动编译安装DBM,需要执行以下步骤进行操作.

    系统需要安装 `yarn` ,如果该命令未安装请将 `yarn` 替换为 `npm` 执行

- 克隆源代码到本机

```bash
git clone https://github.com/EdurtIO/dbm.git
```

- 安装 `node-sass` 外部依赖

```bash
yarn add node-sass
```

- 安装软件依赖

```bash
yarn install
```

- 编译并构建应用

```bash
yarn run release
```

!!! warning

    编译完成后会在 `release` 目录下生成 `dbm-<version>-<os>-<arch>.zip` 软件包. 

    使用相关软件包安装即可.

!!! note

    如果您不想安装到本地软件目录,可使用以下方式启动开发模式进行软件使用

```bash
yarn run dev
```
