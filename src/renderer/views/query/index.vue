<template>
  <div class="app-container">
    <el-row>
      <data-source-select
          v-if="getLengthGtZore(selectServers)"
          :items="selectServers"
          @getValue="handlerDataSource"
          :placeholder="'ClickHouse Server'">
      </data-source-select>
      <el-button v-if="getLengthGtZore(selectServers)"
                 type="primary"
                 icon="el-icon-edit"
                 size="mini"
                 :disabled="!selectValue"
                 :loading="executeLoading"
                 @click="handlerExecute()">
        {{ this.$t('common.execute') }}
      </el-button>
      <el-button v-if="getLengthGtZore(selectServers)"
                 type="primary"
                 icon="el-icon-edit"
                 size="mini"
                 :disabled="!selectValue"
                 :loading="executeLoading"
                 @click="handlerSelectExecute()">
        {{ this.$t('common.select') + this.$t('common.execute') }}
      </el-button>
      <el-tooltip class="item" effect="dark" :content="this.$t('common.format')" placement="bottom">
        <el-button plain type="primary" size="mini" @click="handlerFormat()">
          <i class="fa fa-code"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Actual execution process will not be cancelled!"
                  placement="bottom">
        <el-button
            type="danger"
            size="mini"
            :disabled="disabled.cancel"
            @click="handlerCancel()"> {{ this.$t('common.cancel') }}
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
      <el-tooltip class="item" effect="dark"
                  :content="stringFormat('{0}{1}', [this.$t('common.add'), this.$t('common.editor')])"
                  placement="bottom">
        <el-button size="mini" @click="handlerAddEditor()">
          <i class="fa fa-plus"/>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Add New DataSource" placement="bottom">
        <el-button type="primary" size="mini" style="float: right;" :disabled="disabled.quickQuery"
                   @click="disabled.newDataSource = true">
          <i class="fa fa-plus-circle"></i>
        </el-button>
      </el-tooltip>
      <el-button
          v-if="getLengthGtZore(selectServers)"
          type="success"
          icon="el-icon-more"
          size="mini"
          style="float: right;"
          :disabled="disabled.quickQuery"
          @click="loading.quickQuery = true">
        {{ this.$t('common.quick_query') }}
      </el-button>
    </el-row>
    <el-row v-loading="executeLoading">
      <el-tabs v-model="editor.tabsValue" type="card" closable @tab-remove="handlerRemoveEditor"
               @tab-click="handlerEditorSelection">
        <el-tab-pane
            v-for="(item, index) in editor.tabs"
            :key="index"
            :label="item.label"
            :name="item.name">
          <codemirror :ref="'editor' + index" v-model="item.value" class='codesql' placeholder="zzz"/>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <el-row>
      <el-tabs v-model="result.tabsValue" type="card" closable @tab-remove="handlerRemoveTab">
        <el-tab-pane
            v-for="(item, index) in result.tabs"
            :key="index"
            :label="item.lable"
            :name="item.name"
        >
          <div v-if="data[index].statistics" v-loading="executeLoading">
            <el-tag size="mini">
              <i class="fa fa-clock-o"></i> Elapsed Time {{ data[index].statistics.elapsed }} sec
            </el-tag>
            <el-tag type="success" size="mini">
              <i class="fa fa-grip-lines"></i> Total Rows {{ data[index].rows }} rows
            </el-tag>
            <el-tag type="success" size="mini">
              <i class="fa fa-adjust"></i> Total Read Rows {{ data[index].statistics.rows_read }} row
            </el-tag>
            <el-tag type="success" size="mini">
              <i class="fa fa-perbyte"></i> Bytes Read {{ data[index].statistics.bytes_read }} bytes
            </el-tag>
          </div>
          <table-detail :key="index" v-if="data[index].headers" :showIndex="true" :columns="data[index].columns"
                        :headers="data[index].headers" :loading="executeLoading"/>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <query-quick :loading="loading.quickQuery" :width="'70%'" @close="loading.quickQuery = false"
                 @getQuickSql="handlerGetQuickSql"></query-quick>
    <query-history :loading="disabled.history" :width="'80%'" @close="disabled.history = false"></query-history>
    <data-source :title="'Add New DataSource'"
                 :loading="disabled.newDataSource"
                 @close="disabled.newDataSource = false"
                 @refresh="_initializeServer"></data-source>
  </div>
</template>

<script>
import TableDetail from '@/components/Table'
import QueryQuick from '@/views/components/query/QueryQuick'
import QueryHistory from '@/views/components/query/QueryHistory'
import DataSource from '@/views/components/data/datasource/DataSource'
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import { getQuery } from '@/services/Query'
import { getDataSources } from '@/services/DataSource'
import { stringFormat, getLength } from '@/utils/Utils'
import { deleteByIndex } from '@/utils/ArrayUtils'
import { isEmpty } from '@/utils/StringUtils'

export default {
  name: 'Query',
  components: {
    TableDetail,
    QueryQuick,
    QueryHistory,
    DataSource,
    DataSourceSelect
  },
  data() {
    return {
      editor: {
        tabs: [],
        tabsValue: null,
        tabsIndex: 0,
        selectIndex: null,
        removeIndex: 0
      },
      data: [],
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
        history: false,
        newDataSource: false
      },
      result: {
        tabs: [],
        tabsValue: null,
        tabsIndex: 0,
        removeIndex: 0
      }
    }
  },
  mounted() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.handlerAddEditor()
      this._initializeServer()
    },
    _initializeServer() {
      this.selectServers = getDataSources(null).columns
    },
    async handlerExecute(sql) {
      this.executeLoading = true
      this.disabled.cancel = false
      this.disabled.quickQuery = true
      if (getLength(sql) <= 0) {
        const selectEditor = this.getSelectEditor()
        sql = selectEditor.value
      }
      const response = await getQuery(this.selectValue, sql)
      if (!response.status) {
        this.$notify.error({
          title: this.$t('common.success'),
          message: response.message
        })
      } else {
        if (response.message) {
          this.$notify({
            title: this.$t('common.notification'),
            type: 'success',
            message: 'Operation successful!'
          })
        } else {
          this.data.push(response)
          this.handlerAddTab()
        }
      }
      this.executeLoading = false
      this.disabled.quickQuery = false
      this.disabled.cancel = true
    },
    handlerGetQuickSql(value) {
      this.getSelectEditor().value = value
    },
    handlerCancel() {
      this.disabled.cancel = true
      this.disabled.quickQuery = false
      this.executeLoading = false
    },
    handlerDataSource(value) {
      this.selectValue = value
    },
    handlerFormat() {
      const selectEditor = this.getSelectEditor()
      selectEditor.value = this.sqlFormatter(selectEditor.value)
    },
    handlerAddTab() {
      ++this.result.tabsIndex
      const newTabName = stringFormat('{0} {1}', [this.$t('common.result'), this.result.tabsIndex])
      this.result.tabs.push({
        name: newTabName,
        lable: newTabName
      })
      this.result.tabsValue = newTabName
    },
    handlerRemoveTab(targetName) {
      const tabs = this.result.tabs
      let activeName = this.result.tabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.removeIndex = index
            }
          }
        })
      }
      --this.result.tabsIndex
      this.result.tabsValue = activeName
      this.result.tabs = tabs.filter(tab => tab.name !== targetName)
      // Remove query result cache
      this.data = deleteByIndex(this.data, this.removeIndex)
    },
    handlerSelectExecute() {
      let index
      if (isEmpty(this.editor.selectIndex)) {
        index = this.editor.tabsIndex
      } else {
        index = this.editor.selectIndex
      }
      const editor = this.$refs[`editor${parseInt(index) - 1}`][0]
      this.handlerExecute(editor.codemirror.getSelection())
    },
    handlerAddEditor() {
      ++this.editor.tabsIndex
      const newTabName = stringFormat('{0} {1}', [this.$t('common.editor'), this.editor.tabsIndex])
      this.editor.tabs.push({
        name: newTabName,
        label: newTabName,
        value: ''
      })
      this.editor.tabsValue = newTabName
    },
    handlerRemoveEditor(targetName) {
      const tabs = this.editor.tabs
      let activeName = this.editor.tabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
              this.editor.removeIndex = index
            }
          }
        })
      }
      --this.editor.tabsIndex
      this.editor.tabsValue = activeName
      this.editor.tabs = tabs.filter(tab => tab.name !== targetName)
    },
    getSelectEditor() {
      return this.editor.tabs.filter(v => v.name === this.editor.tabsValue)[0]
    },
    handlerEditorSelection(value) {
      this.editor.selectIndex = parseInt(value.index) + 1
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-top: 10px;
}
</style>
