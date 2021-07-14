<template>
  <div class="app-container">
    <el-row>
      <!-- Server -->
      <i class="fa fa-server"></i>
      <data-source-select
        v-if="getLengthGtZore(selectServers)"
        :items="selectServers"
        @getValue="handlerServer"
        :placeholder="'ClickHouse Server'">
      </data-source-select>
      <!-- Database -->
      <span v-if="selectDatabases && selectDatabases.length > 0">
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
      </span>
      <el-tooltip v-if="disabled.showButton" class="item" effect="dark" content="Add DataBase" placement="top">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="loading.addDatabase = true">
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="disabled.showButton && selectDatabaseValue" class="item" effect="dark" content="Delete Database" placement="top">
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="loading.deleteDatabase = true">
        </el-button>
      </el-tooltip>
      <el-tooltip v-if="disabled.showButton" class="item" effect="dark" content="Infomation" placement="top">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-info"
          @click="loading.serverStatus = true">
        </el-button>
      </el-tooltip>
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
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">{{ $t('common.ddl') }}</div>
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
            <el-tooltip v-if="selectDatabaseValue !== 'system'" class="item" effect="dark" content="Delete Table" placement="top">
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
    <delete-table
      :loading="loading.deleteTable"
      :server="selectServerValue"
      :database="selectDatabaseValue"
      :table="selectTableValue"
      @close="handlerCloseDeleteTable">
    </delete-table>
    <delete-database
      :loading="loading.deleteDatabase"
      :server="selectServerValue"
      :database="selectDatabaseValue"
      @close="handlerCloseDeleteDatabase">
    </delete-database>
    <table-ddl :loading="ddl.visible" :title="ddl.title" :ddl="ddl.context" @close="ddl.visible = false"></table-ddl>
  </div>
</template>

<script>
import CodeMirror from '@/components/CodeMirror'
import AddDatabase from '@/views/components/database/DatabaseAdd'
import DeleteDatabase from '@/views/components/database/DatabaseDelete'
import DeleteTable from '@/views/components/table/TableDelete'
import ServerStatus from '@/views/components/ServerStatus'
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import TableDdl from '@/views/components/table/TableDdl'

import { getQuery } from '@/services/Metadata'
import { stringFormat } from '@/utils/Utils'

export default {
  components: {
    CodeMirror,
    AddDatabase,
    DeleteTable,
    ServerStatus,
    DeleteDatabase,
    DataSourceSelect,
    TableDdl
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
      ddl: {
        visible: false,
        title: '',
        context: null
      },
      tableDetailDialogVisible: false,
      disabled: {
        showButton: false
      },
      loading: {
        tableBody: false,
        serverStatus: false,
        addDatabase: false,
        deleteTable: false,
        deleteDatabase: false
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
    async handlerServer(value) {
      this.selectServerValue = value
      const response = await getQuery(this.selectServerValue, 'SHOW DATABASES')
      if (response.status) {
        this.selectDatabases = response.columns
        this.disabled.showButton = true
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
    },
    async handlerDatabase() {
      this.loading.tableBody = true
      const sql = stringFormat('SELECT ' +
        'uuid, name, engine, partition_key, sorting_key, total_rows, total_bytes ' +
        'FROM system.tables ' +
        'WHERE database = \'{0}\'', [this.selectDatabaseValue])
      const response = await getQuery(this.selectServerValue, sql)
      if (response.status) {
        this.headers = response.headers
        this.columns = response.columns
        this.loading.tableBody = false
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
    },
    handlerChangePage(currentPage) {
      this.currentPage = currentPage
    },
    async handlerShowDDL(row) {
      this.buttonLoading = true
      const sql = stringFormat('SELECT ' +
        'create_table_query ' +
        'FROM system.tables ' +
        'WHERE database = \'{0}\' AND name = \'{1}\'', [this.selectDatabaseValue, row.name])
      const response = await getQuery(this.selectServerValue, sql)
      if (response.status) {
        this.ddl.context = response.columns[0].create_table_query
        this.ddl.title = row.name + ' ' + this.$t('common.ddl')
        this.ddl.visible = true
        this.buttonLoading = false
      }
    },
    handlerToDetail(row) {
      const path = stringFormat('/data/detail/{0}/{1}/{2}', [this.selectServerValue, this.selectDatabaseValue, row.name])
      this.$router.push({
        path: path
      })
    },
    handlerDeleteTable(row) {
      this.loading.deleteTable = true
      this.selectTableValue = row.name
    },
    handlerCloseDeleteTable() {
      this.loading.deleteTable = false
    },
    handlerCloseDeleteDatabase() {
      this.loading.deleteDatabase = false
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }
</style>
