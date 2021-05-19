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
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="handlerExecute()">Execute</el-button>
    </el-row>
    <el-row>
      <textarea ref='mycode' class='codesql' v-model='code'></textarea>
    </el-row>
    <el-row>
      <el-tag>Elapsed Time {{ statistics.elapsed }} sec</el-tag>
      <el-tag type="success">Total Rows {{ statistics.rows_read }} row</el-tag>
      <el-tag type="success">Bytes Read {{ statistics.bytes_read }} bytes</el-tag>
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
  data() {
    return {
      editor: null,
      code: '',
      inputValue: '',
      headers: [],
      columns: [],
      statistics: {},
      selectValue: {},
      selectServers: []
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
        },
        hintOptions: {
          tables: {
            users: ['name', 'score', 'birthDate'],
            countries: ['name', 'population', 'size']
          }
        }
      })
      this._initializeServer()
    },
    _initializeServer() {
      this.selectServers = JSON.parse(localStorage.getItem('DataSources'))
    },
    handlerExecute() {
      const dataSource = this.selectServers.filter(item => item.name === this.selectValue)
      if (dataSource.length < 1) {
        this.$notify({
          title: 'Notification',
          type: 'error',
          message: 'Please select data source!'
        })
      } else {
        this.inputValue = 'http://' + dataSource[0].host + ':' + dataSource[0].port
        runExecute(this.inputValue, this.editor.getValue()).then(response => {
          if (response.status === 200) {
            this.headers = response.data.meta
            this.columns = response.data.data
            this.statistics = response.data.statistics
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }
</style>
