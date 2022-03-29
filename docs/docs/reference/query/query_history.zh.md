---
template: overrides/main.html
---

查询历史功能主要用于标记我们对每个数据源的一些查询记录.

!!! warning

    目前最多支持 `100` 条查询历史,后续我们会扩展该功能支持更多的数据存储!

鼠标移向顶部菜单 `Query` 等待下拉选择项出来后, 点击 `History` 即可进入查询历史界面, 它类似于以下页面

![Query History](/assets/images/query/query_history.png)

在页面顶部右侧我们可以看到 <img src="/assets/images/query/clear_history.png" width="80" /> 按钮, 它用于清理所有的查询历史, 当点击后此处展示的查询历史将被全部清空!

#### 字段描述

---

|字段| 含义                         |
|---|----------------------------|
|ID| 此次查询生成的MD5标记, 用于标记此次查询的唯一性 |
|Server| 查询调用的远程服务标记(即数据源)          |
|State| 本次查询状态, 1: 查询失败, 0: 查询成功   |
|StartTime| 查询开始时间戳                    |
|EndTime| 查询结束时间戳                    |
|ElapsedTime| 本次查询总耗时时间(单位毫秒)            |

!!! warning "注意"

    在列表中我们可以看到, 查询失败的记录我们使用特殊颜色进行高亮展示

:octicons-search-16: 按钮用于查看本次查询的SQL语句

![Query DDL](/assets/images/query/query_ddl.png)

:warning: 按钮用于查看本次执行失败后的错误信息, 它只在查询失败后生效

![Query Error](/assets/images/query/query_error.png)
