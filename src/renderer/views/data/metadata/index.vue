<template>
  <div class="app-container">
    <el-row>
      <!-- Server -->
      <i class="fa fa-server"></i>
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
        <i class="fa fa-database"></i>
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
      <el-button type="primary" size="mini" @click="loading.addDatabase = true">Add DataBase</el-button>
      <el-button
        v-if="disabled.infomation"
        type="success"
        size="mini"
        icon="el-icon-info"
        @click="loading.serverStatus = true">
        Infomation
      </el-button>
    </el-row>
    <el-row>
      <el-pagination
        v-if="columns.length > 0"
        layout="total, prev, pager, next"
        @current-change="handlerChangePage"
        :total="columns.length"
        background>
      </el-pagination>
      <el-table v-loading.body="loading.tableBody"
        style="width: 100%"
        border
        :data="columns.slice((currentPage - 1) * pagesize, currentPage * pagesize)">
        <template v-for="(item,index) in headers">
          <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
        </template>
        <el-table-column
          v-if="columns.length > 0"
          fixed="right"
          label="Action">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Table DDL" placement="top">
              <el-button type="text" 
                size="small" 
                :loading="buttonLoading"
                icon="el-icon-search"
                @click="handlerShowDDL(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Table Detail" placement="top">
              <el-button type="text" 
                size="small" 
                :loading="buttonLoading"
                icon="el-icon-more"
                @click="handlerToDetail(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete Table" placement="top">
              <el-button type="text" 
                size="small" 
                :loading="buttonLoading"
                icon="el-icon-delete"
                @click="handlerDeleteTable(scope.row)"></el-button>
            </el-tooltip>
          </template>
      </el-table-column>
      </el-table>
    </el-row>
    <!-- Add Database -->
    <add-database :loading="loading.addDatabase" :server="selectServerValue" @close="loading.addDatabase = false"></add-database>
    <server-status :loading="loading.serverStatus" :server="selectServerValue" @close="loading.serverStatus = false"></server-status>
    <!-- Delete Table -->
    <delete-table
      :loading="deleteTableLoading"
      :server="selectServerValue"
      :database="selectDatabaseValue"
      :table="selectTableValue"
      @close="handlerCloseDeleteTable"></delete-table>
    <!-- DDL -->
    <el-dialog
      :title="tableDDLTitle"
      :visible.sync="tableDDLDialogVisible">
      <code-mirror :value="tableDDL" :config="{'readOnly': 'nocursor'}"></code-mirror>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tableDDLDialogVisible = false" size="mini">Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CodeMirror from '@/components/CodeMirror'
import AddDatabase from '../components/AddDatabase'
import DeleteTable from '../components/DeleteTable'
import ServerStatus from '../components/ServerStatus'

import { runExecute } from '@/api/query'
import { stringFormat, getDataSource, getServerURL } from '@/utils/utils'

export default {
  components: {
    CodeMirror,
    AddDatabase,
    DeleteTable,
    ServerStatus
  },
  data() {
    return {
      selectServers: [],
      selectServerValue: null,
      selectDatabases: [],
      selectDatabaseValue: null,
      selectTables: [],
      selectTableValue: null,
      headers: [],
      columns: [],
      rows: null,
      statistics: {},
      buttonLoading: false,
      pagesize: 10,
      currentPage: 1,
      tableDDLDialogVisible: false,
      tableDDLTitle: '',
      tableDDL: '',
      tableDetailDialogVisible: false,
      deleteTableLoading: false,
      disabled: {
        infomation: false
      },
      loading: {
        tableBody: false,
        serverStatus: false,
        addDatabase: false
      }
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
            this.disabled.infomation = true
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
      this.loading.tableBody = true
      const dataSource = getDataSource(this.selectServerValue)
      this.inputValue = stringFormat('http://{0}:{1}', [dataSource[0].host, dataSource[0].port])
      const sql = stringFormat('SELECT uuid, name, engine, partition_key, sorting_key, total_rows, total_bytes FROM system.tables WHERE database = \'{0}\'', [this.selectDatabaseValue])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.headers = response.data.meta
          this.columns = response.data.data
          this.loading.tableBody = false
        }
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
      })
    },
    handlerTable() {
      const dataSource = getDataSource(this.selectServerValue)
      this.inputValue = getServerURL(dataSource[0].host, dataSource[0].port, null)
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
      const dataSource = getDataSource(this.selectServerValue)
      this.inputValue = getServerURL(dataSource[0].host, dataSource[0].port, null)
      const sql = stringFormat('SELECT create_table_query FROM system.tables WHERE database = \'{0}\' and name = \'{1}\'', [this.selectDatabaseValue, row.name])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.tableDDL = response.data.data[0].create_table_query
          this.tableDDLTitle = row.name + ' DDL'
          this.tableDDLDialogVisible = true
          this.buttonLoading = false
        }
      })
    },
    handlerToDetail(row) {
      const path = stringFormat('/data/detail/{0}/{1}/{2}', [this.selectServerValue, this.selectDatabaseValue, row.name])
      this.$router.push({
        path: path
      })
    },
    handlerDeleteTable(row) {
      this.deleteTableLoading = true
      this.selectTableValue = row.name
    },
    handlerCloseDeleteTable() {
      this.deleteTableLoading = false
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }
</style>
