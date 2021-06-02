<template>
  <el-dialog title="Quick Query" :visible.sync="bodyLoading" @close="closeDialog">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><i class="fa fa-server"></i> DataSource</span>
          </div>
          <el-menu>
            <el-menu-item
              v-for="(server, index) in servers" 
              :key="index"
              :index="server.name"
              @click="handlerShowData(server, 'database')">
              <span slot="title"> {{server.name}} </span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><i class="fa fa-database"></i> Databases</span>
          </div>
          <el-menu>
            <el-menu-item
              v-for="(database, index) in databases" 
              :key="index"
              :index="database.name"
              @click="handlerShowData(database.name, 'table')">
              <span slot="title"> {{database.name}} </span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><i class="fa fa-table"></i> Tables</span>
          </div>
          <el-menu>
            <el-menu-item
              v-for="(table, index) in tables" 
              :key="index"
              :index="table.name"
              @click="handlerShowData(table.name, null)">
              <span slot="title"> {{table.name}} </span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">Cancel</el-button>
      <el-dropdown v-if="remoteTable !== null" size="mini" split-button type="primary" @command="hadnlerGenerSql"> Quick
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="DESCRIBE">DESCRIBE ...</el-dropdown-item>
          <el-dropdown-item command="LIMIT">SELECT ... LIMIT 100</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-dialog>
</template>

<script>
import { runExecute } from '@/api/query'
import { stringFormat } from '@/utils/utils'

export default {
  name: 'QuickQuery',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.servers = JSON.parse(localStorage.getItem('DataSources'))
  },
  data() {
    return {
      bodyLoading: false,
      remoteServer: null,
      remoteDatabase: null,
      remoteTable: null,
      remoteQuerySql: null,
      quickSql: null,
      servers: [],
      databases: [],
      tables: []
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    handlerShowData(source, type) {
      switch (type) {
        case 'database':
          this.remoteServer = stringFormat('http://{0}:{1}', [source.host, source.port])
          this.remoteQuerySql = 'SHOW DATABASES'
          this.remoteTable = null
          break
        case 'table':
          this.remoteDatabase = source
          this.remoteQuerySql = stringFormat('SELECT name, engine FROM system.tables WHERE database = \'{0}\'', [source])
          this.remoteTable = null
          break
        default:
          this.remoteTable = source
      }
      runExecute(this.remoteServer, this.remoteQuerySql).then(response => {
        if (response.status === 200) {
          switch (type) {
            case 'database':
              this.databases = response.data.data
              break
            case 'table':
              this.tables = response.data.data
              break
          }
        }
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
      })
    },
    hadnlerGenerSql(quick) {
      switch (quick) {
        case 'DESCRIBE':
          this.quickSql = stringFormat('DESCRIBE {0}.{1}', [this.remoteDatabase, this.remoteTable])
          break
        case 'LIMIT':
          this.quickSql = stringFormat('SELECT * FROM {0}.{1} LIMIT 100', [this.remoteDatabase, this.remoteTable])
          break
      }
      this.$emit('getQuickSql', this.quickSql)
      this.closeDialog()
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.bodyLoading = this.loading
      }
    }
  }
}
</script>
<style scoped>
  /deep/ .el-card__header {
    padding: 5px 15px;
  }
  /deep/ .el-card__body {
      padding: 0px;
  }
  /deep/ .el-menu {
    border-right: solid 0px #e6e6e6;
  }
  .el-menu-item {
    padding: 0;
    cursor: pointer;
  }
  /deep/ .el-menu-item, .el-submenu__title {
    line-height: 25px;
    height: 30px;
    border-bottom: solid 1px #e6e6e6;
  }
  /deep/ .el-dialog__body {
    padding: 10px 15px;
  }
  /deep/ .el-row {
    margin-top: 0px;
  }
</style>
