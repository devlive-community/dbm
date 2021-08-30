export default {
  common: {
    server: 'Server',
    database: 'Database',
    table: 'Table',
    execute: 'Execute',
    cancel: 'Cancel',
    ok: 'OK',
    quick: 'Quick',
    quick_query: 'Quick Query',
    test_connection: 'Test Connection',
    alias_name: 'Alias Name',
    name: 'Name',
    host: 'Host',
    port: 'Port',
    username: 'User Name',
    password: 'Password',
    beta: 'Beta',
    setting: 'Setting',
    switch: 'Switch to English!',
    save: 'Save',
    basic: 'Basic',
    network: 'Network',
    timeout: 'Timeout',
    monitor: 'Monitor',
    new: 'New',
    processor: 'Processor',
    setting_connection: 'Connection Setting',
    advanced_connection: 'Advanced Setting',
    time: 'Time',
    rows: 'Rows',
    elapsed: 'Elapsed',
    bytes: 'Bytes',
    memoryUsage: 'Memory Usage',
    bytesRead: 'Bytes Read',
    bytesWritten: 'Bytes Written',
    hash: 'Hash',
    threshold: 'Threshold',
    auto: 'Auto',
    refresh: 'Refresh',
    count: 'Count',
    action: 'Action',
    ddl: 'DDL',
    kill: 'Kill',
    no_callback: 'No rollback',
    necessary: 'Necessary',
    success: 'Success',
    error: 'Error',
    add: 'Add',
    datasource: 'DataSource',
    status: 'Status',
    delete: 'Delete',
    query: 'Query',
    history: 'History',
    clear: 'Clear',
    notification: 'Notification',
    connection: 'Connection',
    copy: 'Copy',
    format: 'Format',
    editor: 'Editor',
    theme: 'Theme',
    activeLine: 'Highlight Active Line',
    yes: 'Yes',
    no: 'No',
    showLine: 'Show Line',
    reload: 'Reload',
    result: 'Result',
    select: 'Select',
    protocol: 'Protocol',
    mutations: 'Mutations',
    id: 'ID',
    createTime: 'Create Time',
    infomation: 'Infomation',
    edit: 'Edit',
    tools: 'Tools',
    track: 'Track',
    thread: 'Thread',
    type: 'Type',
    next: 'Next',
    preview: 'Preview',
    configuration: 'Configuration',
    previous: 'Previous',
    log: 'Log',
    column: 'Column',
    property: 'Property',
    comment: 'Comment',
    migrate: 'Migrate',
    source: 'Source',
    target: 'Target',
    clickhouse: 'ClickHouse',
    language: 'Language',
    uppercase: 'Uppercase',
    engine: 'Engine',
    kafka: 'Kafka',
    broker: 'Broker',
    topic: 'Topic',
    group: 'Group',
    hdfs: 'HDFS',
    uri: 'URI'
  },
  prompt: {
    component: {
      warning_drop: 'Drop operation is forbidden in data source<br/>If you need to recover, please modify the data source configuration'
    }
  },
  router: {
    index: 'Home',
    query: 'Query',
    data: {
      source: 'DataSource',
      metadata: 'Metadata',
      table: {
        detail: 'Table Detail'
      }
    }
  },
  view: {
    component: {
      data: {
        source: {
          placeholder: {
            alias_name: 'Please input alias name',
            host: 'Please input remote host',
            port: 'Please enter the port of the remote host',
            username: 'Please enter the username',
            password: 'Please enter the password'
          },
          tooltip: {
            alias_name: 'This field is only used to mark an alias of the current attribute <br/> which is easy to remember and has no special meaning',
            host: 'Enter the host name or IP address of the remote server here',
            port: 'Enter the host address of the remote server here, corresponding to the open port'
          },
          title: {
            warning_drop: 'Prohibit DROP operation (only support query)'
          }
        }
      },
      setting: {
        basic: {
          placeholder: {
            network: 'Please enter the network connection timeout'
          },
          tooltip: {
            network: 'The timeout of accessing remote server is seconds by default'
          }
        }
      }
    }
  },
  alter: {
    operation: 'We do not recommend that you do this',
    operation_submit: 'If you want to continue the follow-up operation, please input the necessary information in the input box and click OK or confirm!',
    result: 'This operation produces the following:',
    stop_on_cluster: 'This will stop the operation in the cluster',
    contrast_input: 'The value entered does not match the required value',
    are_you_delete: 'Are you sure you want to delete?',
    service_not_available: 'The current service is not available. Please check the configuration or remove it!',
    service_available: 'The current service is available for query or other operations!',
    refersh_config: 'After the configuration is modified, it needs to be reloaded manually!'
  },
  tooltip: {
    is_empty: 'Is not empty'
  },
  table: {
    engine: {
      log: {
        name: 'Log',
        tiny: 'TinyLog',
        stripe: 'StripeLog',
        description: 'Lightweight engines with minimum functionality. They’re the most effective when you need to quickly write many small tables (up to approximately 1 million rows) and read them later as a whole.'
      },
      integration: {
        name: 'Integration',
        description: 'It is mainly used to import external data into ClickHouse, or to manipulate external data sources directly in ClickHouse.',
        kafka: {
          name: 'Kafka',
          description: 'Import data from Kafka Topic directly into ClickHouse'
        },
        hdfs: {
          name: 'HDFS',
          description: 'Import data from HDFS directly into ClickHouse'
        }
      }
    }
  }
}
