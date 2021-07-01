export default {
  common: {
    server: '服务',
    database: '数据库',
    table: '数据表',
    execute: '执行',
    cancel: '取消',
    ok: '确认',
    quick: 'Quick',
    quick_query: '快速查询',
    test_connection: '测试连接',
    alias_name: '别名',
    name: '名称',
    host: '主机',
    port: '端口',
    username: '用户名',
    password: '密码',
    beta: '测试版',
    setting: '设置',
    switch: '切换为中文！',
    save: '保存',
    basic: '基础',
    network: '网络',
    timeout: '超时',
    setting_connection: '连接设置',
    advanced_connection: '高级设置'
  },
  prompt: {
    component: {
      warning_drop: '数据源中禁止删除操作<br/>如果需要恢复，请修改数据源配置'
    }
  },
  router: {
    index: '主页',
    query: '查询',
    data: {
      source: '数据源',
      metadata: '元数据',
      table: {
        detail: '表详情'
      }
    }
  },
  view: {
    component: {
      data: {
        source: {
          placeholder: {
            alias_name: '请输入别名',
            host: '请输入远程主机',
            port: '请输入远程主机的端口'
          },
          tooltip: {
            alias_name: '此字段仅用于标记当前属性的别名<br/>该属性易于记忆，没有特殊意义',
            host: '在此处输入远程服务器的主机名或IP地址',
            port: '在此处输入远程服务器的主机地址，对应于打开的端口'
          },
          title: {
            warning_drop: '禁止DROP操作（仅支持查询）'
          }
        }
      },
      setting: {
        basic: {
          placeholder: {
            network: '请输入网络连接的超时时间'
          },
          tooltip: {
            network: '访问远程服务器超时时间，默认是秒'
          }
        }
      }
    }
  }
}
