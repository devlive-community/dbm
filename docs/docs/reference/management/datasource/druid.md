---
template: overrides/main.html
---

!!! note "Apache Druid"

    It is mainly used to describe how the software builds the Apache Druid data source for subsequent operations.

!!! warning "System requirements"

    \>= `1.21.0`

### Supported Versions

---

| Version  | Tested?                                     |
|----------|---------------------------------------------|
| `0.23.x` | :material-checkbox-marked-circle:{.success} |

!!! note "Supported versions"

    Most versions have been tested, please submit issues for non-adapted versions.

### Created a Source

---

After entering the data source management page, click the Add data source button.

![img.png](../../../assets/images/others/management/datasource/druid/img.png)

Select the Apache Druid icon in the `Basic` type (The last one).

After selecting the type, click the `Next` button at the bottom to configure the relevant information.

![img_1.png](../../../assets/images/others/management/datasource/druid/img_1.png)

!!! note "Supported protocols"

    - [x] `HTTP`

#### HTTP Protocol

---

!!! note "HTTP Protocol"

    Use the HTTP interface provided by Apache Druid to connect to the service.

| Parameter | Description                                                                                         | Required | Unique | Default |
|-----------|-----------------------------------------------------------------------------------------------------|----------|--------|---------|
| `Alias`   | The alias of the data source, which will be displayed later in the selected data source on the page | Yes      | Yes    |         |
| `Host`    | The host of the Apache Druid server                                                                 | Yes      | Yes    |         |
| `Port`    | The port of the Apache Druid server                                                                 | Yes      | Yes    | `8123`  |

When we have configured the above parameters, click the `Test` button at the bottom. If the service can be accessed normally, the `OK` button can be used. Click it and it will be saved.
