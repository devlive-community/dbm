---
template: overrides/main.html
---

This document describes how to use the query function to query.

##### Redirect Query

---

Click the <img src="http://images.edurt.io/2021/09/26/16326372138778.jpg" width="50" /> menu in the top menu bar and the next window appears

![](http://images.edurt.io/2021/09/26/16326381423772.jpg)

- The first Select box is used to Select the service we want to query (our configured DataSource)
- The second blue button labeled `Execute` is to execute the operation (after clicking, the executed content will be sent to the selected service for execution)
- The third blue button labeled `SelectExecute` is to select a part of the content to perform an operation (after clicking, the selected content will be sent to the selected service for execution)
- The fourth mark is the SQL source code in the formatting editor (pointing to it will display the button name)
- The fifth red button marked 'Cancel' is used to stop the query operation (by default, it is non-clickable and can only be used for the query. Note that it does not stop the query specifically in the server, but in the page)
- The sixth is the history of the query
- The seventh is to add a new editor window
- The first green button on the right labeled `Quick Query` is some shortcut operations for the server. Its sample page is as follows
  ![](http://images.edurt.io/2021/09/26/16326391062508.jpg)
- The second blue button on the right, marked as `+`, is the function of quickly adding DataSource

The components below these button groups are the editors for writing SQL, in which you can write the SQL text to be queried

##### Execute Query

---

We execute a query of `SELECT 1 = 1`

![](http://images.edurt.io/2021/09/26/16326393140587.jpg)

We can see that there is a list of query results displayed below the editor, and its result is to realize the front-end paging function

- `Elapsed Time` Shows the time-consuming of this query, which is the specific time-consuming time returned by the ClickHouse server
- `Total Rows` Display the total number of rows returned by this query
- `Total Read Rows` Display the total number of rows of metadata read in this query
- `Bytes Read` Display the total number of bytes of metadata read in this query

> It should be noted that each query will build a new query result Tab page

##### Quick Query

---

`Quick Query` currently contains the following shortcut functions

- `DESCRIBE ...`
- `SHOW CREATE TABLE ...`
- `SELECT ... LIMIT 100`
- `SELECT COUNT FROM ...`

After selecting them, SQL will be constructed and automatically entered into the currently selected editor
