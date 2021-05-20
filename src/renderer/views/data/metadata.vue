<template>
  <div class="app-container">
    <el-row>
      <!-- Server -->
      <el-select v-model="selectServerValue" size="mini" @change="handlerServer()" placeholder="ClickHouse Server">
        <el-option
          v-for="item in selectServers"
          :key="item.name"
          :label="item.name"
          :value="item.name">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.host }}</span>
        </el-option>
      </el-select>
      <!-- Database -->
      <el-select v-if="selectDatabases.length > 0"
        v-model="selectDatabaseValue"
        size="mini"
        @change="handlerDatabase()"
        placeholder="ClickHouse Database">
        <el-option
          v-for="item in selectDatabases"
          :key="item.name"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <!-- Table -->
      <el-select v-if="selectTables.length > 0"
        v-model="selectTableValue"
        size="mini"
        @change="handlerTable()"
        placeholder="ClickHouse Table">
        <el-option
          v-for="item in selectTables"
          :key="item.name"
          :label="item.name"
          :value="item.name">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.engine }}</span>
        </el-option>
        </el-option>
      </el-select>
    </el-row>
    <el-row>
      <el-table style="width: 100%" border :data="columns">
        <template v-for="(item,index) in headers">
          <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
        </template>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { runExecute } from '@/api/query'
import { stringFormat } from '@/utils/utils'

export default {
  data() {
    return {
      selectServers: [],
      selectServerValue: {},
      selectDatabases: [],
      selectDatabaseValue: {},
      selectTables: [],
      selectTableValue: {},
      headers: [],
      columns: [],
      rows: null,
      statistics: {}
    }
  },
  mounted() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this._initializeServer()
    },
    _initializeServer() {
      this.selectServers = JSON.parse(localStorage.getItem('DataSources'))
    },
    handlerServer() {
      const dataSource = this.selectServers.filter(item => item.name === this.selectServerValue)
      if (dataSource.length < 1) {
        this.$notify({
          title: 'Notification',
          type: 'error',
          message: 'Please select data source!'
        })
      } else {
        this.inputValue = stringFormat('http://{0}:{1}', [dataSource[0].host, dataSource[0].port])
        runExecute(this.inputValue, 'SHOW DATABASES').then(response => {
          if (response.status === 200) {
            this.selectDatabases = response.data.data
          }
        }).catch(response => {
          this.$notify.error({
            title: 'Error',
            message: response.data
          })
        })
      }
    },
    handlerDatabase() {
      const dataSource = this.selectServers.filter(item => item.name === this.selectServerValue)
      this.inputValue = stringFormat('http://{0}:{1}', [dataSource[0].host, dataSource[0].port])
      const sql = stringFormat('SELECT engine, name FROM system.tables where database=\'{0}\'', [this.selectDatabaseValue])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.selectTables = response.data.data
        }
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
      })
    },
    handlerTable() {
      const dataSource = this.selectServers.filter(item => item.name === this.selectServerValue)
      this.inputValue = stringFormat('http://{0}:{1}', [dataSource[0].host, dataSource[0].port])
      const sql = stringFormat('SELECT * FROM system.columns WHERE database = \'{0}\' and table = \'{1}\'', [this.selectDatabaseValue, this.selectTableValue])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.headers = response.data.meta
          this.columns = response.data.data
        }
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }
</style>
