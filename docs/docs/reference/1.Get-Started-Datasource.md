---
template: overrides/main.html
---

The datasource is mainly used to manage the Clickhouse service data source and for later query monitoring.

### Create DataSource

---
Open the DBM application and find the `DataSource` menu at the top. Click on the drop-down `DataSource submenu` and the following interface appears:

![-w1280](http://downloads.edurt.io/images/20210813/16287936723069-16287936892327.jpg)

---
Click the `+` button(blue) to add the DataSource. The following pop-up box appears:

![-w648](http://downloads.edurt.io/images/20210813/16287938888381-16287938950497.jpg)

There are two types of data source parameters:

##### Connection Setting

- `Alias Name`: This field is only used to mark an alias of the current attribute, default `localhost`
  which is easy to remember and has no special meaning
- `Protocol`: Connection Service Protocol, default `http`
- `Host`: Enter the host name or IP address of the remote server here, default `localhost`
- `Port`: Enter the host address of the remote server here, corresponding to the open port, default `8123`
- `User Name`: Connection service user name, enter if set, default `default`
- `Password`: Connection service user password, if set please enter

##### Advanced Setting

- `Prohibit DROP operation`: Forbids the DROP operation (only custom queries are supported) and is currently an experimental feature

---
The `Test Connection` button is used to Test whether the current configuration information can be connected

The `OK` button is used to save and persist the current configuration

After clicking `OK`, we will save the configuration information you wrote for your next use

The configuration information can be saved in two states

- `Stop`: Stop status, which indicates that the service is currently unavailable, marked with the stop icon
- `Start`: Enabled, which indicates that the service is currently available for operations such as queries, and is marked with a play icon

> The newly added data source is in the stopped state by default, and you need to manually refresh it. It takes effect for all data sources. Click the Refresh (green) button to take effect.

### Edit DataSource

In the data list Action, use an editor icon to indicate that the data source can be edited Click it.

### Delete DataSource

In the Action data list, use the recycle bin icon to indicate that the data source can be deleted. Click to modify.
