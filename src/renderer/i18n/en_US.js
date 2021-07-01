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
    hash: 'Hase',
    threshold: 'Threshold',
    auto: 'Auto',
    refresh: 'Refresh'
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
            port: 'Please enter the port of the remote host'
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
  }
}
