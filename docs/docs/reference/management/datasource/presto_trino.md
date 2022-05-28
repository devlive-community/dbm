---
template: overrides/main.html
---

!!! note "Presto & Trino"

    It is mainly used to describe how the software builds the Presto & Trino data source for subsequent operations.

!!! warning "System requirements"

    \>= `1.17.0`

### Supported Versions

---

| Version   | Tested?                                     |
|-----------|---------------------------------------------|
| `Presto`  | :material-checkbox-marked-circle:{.success} |
| `Trino`   | :material-checkbox-marked-circle:{.success} |

!!! note "Supported versions"

    Most versions have been tested, please submit issues for non-adapted versions.

### Created a Source

---

After entering the data source management page, click the Add data source button.

![img.png](../../../assets/images/others/management/datasource/datasource_type.png)

Select the ClickHouse icon in the `Basic` type (Presto is the second, Trino is the third).

After selecting the type, click the `Next` button at the bottom to configure the relevant information.

![img.png](../../../assets/images/others/management/datasource/presto_trino/img.png)

!!! note "Supported protocols"

    - [x] `HTTP`

#### HTTP Protocol

---

!!! note "HTTP Protocol"

    Use the HTTP interface provided by Presto & Trino to connect to the service.

| Parameter   | Description                                                                                         | Required | Unique | Default |
|-------------|-----------------------------------------------------------------------------------------------------|----------|--------|---------|
| `Alias`     | The alias of the data source, which will be displayed later in the selected data source on the page | Yes      | Yes    |         |
| `Host`      | The host of the Presto & Trino server                                                               | Yes      | Yes    |         |
| `Port`      | The port of the Presto & Trino server                                                               | Yes      | Yes    |         |
| `User Name` | The user name of the Presto & Trino server                                                          | Yes      | No     |         |
| `Password`  | The password of the Presto & Trino server                                                           | Yes      | No     |         |
