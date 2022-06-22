---
template: overrides/main.html
---

!!! note "MySQL"

    It is mainly used to describe how the software builds the PostgreSQL data source for subsequent operations.

!!! warning "System requirements"

    \>= `1.19.0`

### Supported Versions

---

| Version  | Tested?                                     |
|----------|---------------------------------------------|
| `14.2.x` | :material-checkbox-marked-circle:{.success} |

!!! note "Supported versions"

    Most versions have been tested, please submit issues for non-adapted versions.

### Created a Source

---

After entering the data source management page, click the Add data source button.

![img.png](../../../assets/images/others/management/datasource/postgresql/img.png)

Select the MySQL icon in the `Experimental` type (the fourth).

After selecting the type, click the `Next` button at the bottom to configure the relevant information.

![img.png](../../../assets/images/others/management/datasource/postgresql/img_1.png)

!!! note "Supported protocols"

    - [x] `TCP`

#### TCP Protocol

---

!!! note "TCP Protocol"

    Use the TCP interface provided by PostgreSQL to connect to the service.

| Parameter   | Description                                                                                         | Required | Unique | Default |
|-------------|-----------------------------------------------------------------------------------------------------|----------|--------|---------|
| `Alias`     | The alias of the data source, which will be displayed later in the selected data source on the page | Yes      | Yes    |         |
| `Host`      | The host of the PostgreSQL server                                                                   | Yes      | Yes    |         |
| `Port`      | The port of the PostgreSQL server                                                                   | Yes      | Yes    | `5443`  |
| `User Name` | The user name of the PostgreSQL server                                                              | No       | Yes    |         |
| `Password`  | The password of the PostgreSQL server                                                               | No       | Yes    |         |
| `Database`  | The database of the PostgreSQL server                                                               | No       | Yes    |         |

When we have configured the above parameters, click the `Test` button at the bottom. If the service can be accessed normally, the `OK` button can be used. Click it and it will be saved.
