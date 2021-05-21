<template>
  <div class="app-container">
    <el-row>
      <!-- Server -->
      Server: 
      <el-select 
        v-model="selectServerValue"
        size="mini"
        filterable
        @change="handlerServer()"
        placeholder="ClickHouse Server">
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
      <el-span v-if="selectDatabases.length > 0">
        Database: 
        <el-select
          v-model="selectDatabaseValue"
          size="mini"
          filterable
          @change="handlerDatabase()"
          placeholder="ClickHouse Database">
          <el-option
            v-for="item in selectDatabases"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-span>
    </el-row>
    <el-row>
      <el-pagination
        v-if="columns.length > 0"
        layout="total, prev, pager, next"
        @current-change="handlerChangePage"
        :total="columns.length"
        background>
      </el-pagination>
      <el-table v-loading.body="loading"
        style="width: 100%"
        border
        :data="columns.slice((currentPage - 1) * pagesize, currentPage * pagesize)">
        <template v-for="(item,index) in headers">
          <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
        </template>
        <el-table-column
          v-if="columns.length > 0"
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
              content="Table DDL">
              <el-button type="text" 
                size="small" 
                slot="reference"
                :loading="buttonLoading"
                @click="handlerShowDDL(scope.row)">
                <i class="fa fa-bolt"></i> DDL
              </el-button>
            </el-popover>
          </template>
      </el-table-column>
      </el-table>
    </el-row>
    <!-- DDL -->
    <el-dialog
      :title="tableDDLTitle"
      :visible.sync="tableDDLDialogVisible">
      <code>{{tableDDL}}</code>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tableDDLDialogVisible = false" size="mini">Close</el-button>
      </span>
    </el-dialog>
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
      statistics: {},
      loading: false,
      buttonLoading: false,
      pagesize: 10,
      currentPage: 1,
      tableDDLDialogVisible: false,
      tableDDLTitle: '',
      tableDDL: ''
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
      this.loading = true
      const dataSource = this.selectServers.filter(item => item.name === this.selectServerValue)
      this.inputValue = stringFormat('http://{0}:{1}', [dataSource[0].host, dataSource[0].port])
      const sql = stringFormat('SELECT name, uuid, engine, partition_key, sorting_key, total_rows, total_bytes FROM system.tables WHERE database = \'{0}\'', [this.selectDatabaseValue])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.headers = response.data.meta
          this.columns = response.data.data
          this.loading = false
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
    },
    handlerChangePage(currentPage) {
      this.currentPage = currentPage
    },
    handlerShowDDL(row) {
      this.buttonLoading = true
      const dataSource = this.selectServers.filter(item => item.name === this.selectServerValue)
      this.inputValue = stringFormat('http://{0}:{1}', [dataSource[0].host, dataSource[0].port])
      const sql = stringFormat('SELECT create_table_query FROM system.tables WHERE database = \'{0}\' and name = \'{1}\'', [this.selectDatabaseValue, row.name])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.tableDDL = response.data.data[0].create_table_query
          this.tableDDLTitle = row.name + ' DDL'
          this.tableDDLDialogVisible = true
          this.buttonLoading = false
        }
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
