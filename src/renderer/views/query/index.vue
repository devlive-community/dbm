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
      <el-tooltip class="item" effect="dark" content="Only 100 records are recorded and displayed!" placement="bottom">
        <el-button
          type="primary"
          size="mini" 
          @click="disabled.history = true">
          <i class="fa fa-history"></i>
        </el-button>
      </el-tooltip>
      <el-button
        type="success"
        icon="el-icon-more"
        size="mini"
        style="float: right;"
        :disabled="disabled.quickQuery" 
        @click="loading.quickQuery = true">Quick Query</el-button>
    </el-row>
    <el-row v-loading="executeLoading">
      <textarea ref='mycode' class='codesql' v-model='code'></textarea>
    </el-row>
    <el-row v-if="data.statistics" v-loading="executeLoading">
      <el-tag size="mini">
        <i class="fa fa-clock-o"></i> Elapsed Time {{ data.statistics.elapsed }} sec
      </el-tag>
      <el-tag type="success" size="mini">
        <i class="fa fa-grip-lines"></i> Total Rows {{ data.rows }} rows
      </el-tag>
      <el-tag type="success" size="mini">
        <i class="fa fa-adjust"></i> Total Read Rows {{ data.statistics.rows_read }} row
      </el-tag>
      <el-tag type="success" size="mini">
        <i class="fa fa-perbyte"></i> Bytes Read {{ data.statistics.bytes_read }} bytes
      </el-tag>
    </el-row>
    <el-row>
      <table-detail v-if="data.headers" :showIndex="true" :columns="data.columns" :headers="data.headers" :loading="executeLoading"></table-detail>
    </el-row>
    <query-quick
      :loading="loading.quickQuery"
      :width="'70%'"
      @close="loading.quickQuery = false"
      @getQuickSql="handlerGetQuickSql">
    </query-quick>
    <query-history
      :loading="disabled.history"
      :width="'80%'"
      @close="disabled.history = false">
    </query-history>
  </div>
</template>

<script>
import TableDetail from '@/components/Table'
import QueryQuick from '@/views/components/query/QueryQuick'
import QueryHistory from '@/views/components/query/QueryHistory'
import { getQuery } from '@/services/Query'

import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

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
    QueryQuick,
    QueryHistory
  },
  data() {
    return {
      editor: null,
      code: '',
      data: {},
      executeLoading: false,
      inputValue: '',
      selectValue: null,
      selectServers: [],
      loading: {
        cancel: false,
        quickQuery: false
      },
      disabled: {
        cancel: true,
        quickQuery: false,
        history: false
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
    async handlerExecute() {
      this.executeLoading = true
      this.disabled.cancel = false
      this.disabled.quickQuery = true
      const response = await getQuery(this.selectValue, this.editor.getValue())
      if (!response.status) {
        this.$notify.error({
          title: 'Error',
          message: response.message
        })
      } else {
        if (response.message) {
          this.$notify({
            title: 'Notification',
            type: 'success',
            message: 'Operation successful!'
          })
        } else {
          this.data = response
        }
      }
      this.executeLoading = false
      this.disabled.quickQuery = false
      this.disabled.cancel = true
    },
    handlerGetQuickSql(value) {
      this.editor.setValue(value)
    },
    handlerCancel() {
      this.disabled.cancel = true
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
