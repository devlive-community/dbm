<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="selectValue" size="mini" placeholder="ClickHouse Server">
        <el-option
          v-for="item in selectServers"
          :key="item.name"
          :label="item.name"
          :value="item.name">
          <span style="float: left">{{ item.name }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.host }}</span>
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-edit" size="mini" :loading="executeLoading" @click="handlerExecute()">Execute</el-button>
      <el-tooltip class="item" effect="dark" content="Actual execution process will not be cancelled!" placement="bottom">
        <el-button
          type="danger"
          size="mini" 
          :disabled="disabled.cancel" 
          @click="handlerCancel()">Cancel
        </el-button>
      </el-tooltip>
      <el-button
        type="success"
        icon="el-icon-more"
        size="mini"
        style="float: right;"
        :disabled="disabled.quickQuery" 
        @click="handlerQuickQuery()">Quick Query</el-button>
    </el-row>
    <el-row v-loading="executeLoading">
      <textarea ref='mycode' class='codesql' v-model='code'></textarea>
    </el-row>
    <el-row v-loading="executeLoading">
      <el-tag size="mini">
        <i class="fa fa-clock-o"></i> Elapsed Time {{ statistics.elapsed }} sec
      </el-tag>
      <el-tag type="success" size="mini">
        <i class="fa fa-grip-lines"></i> Total Rows {{ rows }} rows
      </el-tag>
      <el-tag type="success" size="mini">
        <i class="fa fa-adjust"></i> Total Read Rows {{ statistics.rows_read }} row
      </el-tag>
      <el-tag type="success" size="mini">
        <i class="fa fa-perbyte"></i> Bytes Read {{ statistics.bytes_read }} bytes
      </el-tag>
    </el-row>
    <el-row>
      <table-detail :columns="columns" :headers="headers" :loading="executeLoading"></table-detail>
    </el-row>
  <!-- Quick Query -->
  <quick-query :loading="quickQueryLoading" @close="handlerCloseQuickQuery" @getQuickSql="handlerGetQuickSql"></quick-query>
  </div>
</template>

<script>
import TableDetail from '@/components/Table'
import { runExecute } from '@/api/query'

import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import QuickQuery from './components/QuickQuery'

const CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')

export default {
  name: 'codeMirror',
  components: {
    TableDetail,
    QuickQuery
  },
  data() {
    return {
      editor: null,
      code: '',
      executeLoading: false,
      inputValue: '',
      headers: [],
      columns: [],
      rows: null,
      statistics: {},
      selectValue: {},
      selectServers: [],
      quickQueryLoading: false,
      loading: {
        cancel: false
      },
      disabled: {
        cancel: true,
        quickQuery: false
      }
    }
  },
  mounted() {
    this._initialize()
  },
  methods: {
    _initialize() {
      const mime = 'text/x-mariadb'
      this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
        mode: mime,
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true,
        extraKeys: {
          'Ctrl': 'autocompconste'
        }
      })
      this._initializeServer()
    },
    _initializeServer() {
      this.selectServers = JSON.parse(localStorage.getItem('DataSources'))
    },
    handlerExecute() {
      this.executeLoading = true
      this.disabled.cancel = false
      this.disabled.quickQuery = true
      const dataSource = this.selectServers.filter(item => item.name === this.selectValue)
      if (dataSource.length < 1) {
        this.$notify({
          title: 'Notification',
          type: 'error',
          message: 'Please select data source!'
        })
        this.executeLoading = false
        this.disabled.quickQuery = false
        this.disabled.cancel = true
      } else {
        this.inputValue = 'http://' + dataSource[0].host + ':' + dataSource[0].port
        runExecute(this.inputValue, this.editor.getValue()).then(response => {
          if (response.status === 200) {
            if (response.data) {
              this.headers = response.data.meta
              this.columns = response.data.data
              this.rows = response.data.rows
              this.statistics = response.data.statistics
            } else {
              this.$notify({
                title: 'Notification',
                type: 'success',
                message: 'Operation successful!'
              })
            }
            this.executeLoading = false
            this.disabled.quickQuery = false
            this.disabled.cancel = true
          }
        }).catch(response => {
          this.$notify.error({
            title: 'Error',
            message: response.data
          })
          this.executeLoading = false
          this.disabled.quickQuery = false
          this.disabled.cancel = true
        })
      }
    },
    handlerQuickQuery() {
      this.quickQueryLoading = true
    },
    handlerCloseQuickQuery() {
      this.quickQueryLoading = false
    },
    handlerGetQuickSql(value) {
      this.editor.setValue(value)
    },
    handlerCancel() {
      this.disabled.cancel = false
      this.disabled.quickQuery = false
      this.executeLoading = false
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }
</style>
