<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <data-tree :items="treeItems" :nodeKey="'name'" @change="handlerGetTreeData($event)"
                   @handlerClickTreeMenu="handlerClickTreeMenu($event)"/>
      </el-col>
      <el-col :span="18">
        <el-empty v-if="this.isEmpty(treeValue.title)"/>
        <el-card v-else class="box-card">
          <div slot="header" class="clearfix">
            <span><i :class="this.getFaIcon(treeValue.type)"></i> {{ treeValue.title }}</span>
            <el-tooltip v-if="treeValue.type === SERVER" class="item" effect="dark"
                        :content="this.stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.database')])"
                        placement="top">
              <el-button class="frp-5" type="primary" size="mini" icon="el-icon-plus"
                         @click="loading.addDatabase = true"/>
            </el-tooltip>
            <el-tooltip v-if="treeValue.type === SERVER" class="item" effect="dark"
                        :content="this.$t('common.information')" placement="top">
              <el-button class="frp-5" type="success" size="mini" icon="el-icon-info"
                         @click="loading.serverStatus = true"/>
            </el-tooltip>
            <el-switch v-if="treeValue.type === SERVER" class="frp-5" v-model="switchType"
                       :active-text="this.$t('common.database')"
                       :inactive-text="this.$t('common.server')"
                       active-value="DataBase" inactive-value="Server" @change="handlerSwitchType"/>
            <el-tooltip v-if="treeValue.type === DATABASE" class="item" effect="dark"
                        :content="this.stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.table')])"
                        placement="top">
              <el-button class="frp-5" type="primary" size="mini" icon="el-icon-plus"
                         @click="loading.createTable = true"/>
            </el-tooltip>
            <el-tooltip v-if="treeValue.type === DATABASE" class="item" effect="dark"
                        :content="this.stringFormat('{0} {1}', [this.$t('common.delete'), this.$t('common.database')])"
                        placement="top">
              <el-button class="frp-5" type="danger" size="mini" icon="el-icon-delete"
                         @click="loading.deleteDatabase = true"/>
            </el-tooltip>
            <el-tooltip v-if="treeValue.type === TABLE" class="item" effect="dark" placement="top">
              <div slot="content">{{ $t('common.ddl') }}</div>
              <el-button class="frp-5" type="text" size="small" :loading="buttonLoading" icon="el-icon-search"
                         @click="handlerShowDDL(treeValue.server, treeValue.database, treeValue.table)"></el-button>
            </el-tooltip>
            <el-tooltip v-if="treeValue.type === TABLE && treeValue.table !== 'system'" class="item" effect="dark"
                        placement="top"
                        :content="this.stringFormat('{0} {1}', [this.$t('common.delete'), this.$t('common.table')])">
              <el-button class="frp-5" type="text" size="small" icon="el-icon-delete"
                         @click="loading.deleteTable = true"/>
            </el-tooltip>
            <el-tooltip v-if="treeValue.type === TABLE" class="item" effect="dark" content="Table Detail"
                        placement="top">
              <el-button class="frp-5" type="text" size="small" icon="el-icon-more" @click="handlerToDetail()"/>
            </el-tooltip>
          </div>
          <div class="text item">
            <el-empty v-if="this.isEmpty(treeValue.server) || this.isEmpty(treeValue.type)"/>
            <monitor-disk v-else :items="items"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
    </el-row>
    <add-database v-if="loading.addDatabase" :visible.sync="loading.addDatabase" :server="treeValue.server"/>
    <server-status :loading="loading.serverStatus" :server="treeValue.server" @close="loading.serverStatus = false"/>
    <delete-database :loading="loading.deleteDatabase" :server="treeValue.server" :database="treeValue.database"
                     @close="loading.deleteDatabase = false"/>
    <table-ddl :loading="ddl.visible" :title="ddl.title" :ddl="ddl.context" @close="ddl.visible = false"/>
    <delete-table :loading="loading.deleteTable" :server="treeValue.server" :database="treeValue.database"
                  :table="treeValue.table" @close="loading.deleteTable = false"/>
    <table-preview :loading="loading.tablePreview" :configuration="treeValue" @close="loading.tablePreview = false"/>
    <table-column :loading="loading.tableColumn" :configuration="treeValue"
                  @close="loading.tableColumn = false"></table-column>
    <table-rename :loading="loading.tableRename" :configuration="treeValue"
                  @close="loading.tableRename = false"></table-rename>
    <create-table v-if="loading.createTable" :visible.sync="loading.createTable" :configure="treeValue"/>
    <add-column v-if="loading.addColumn" :visible.sync="loading.addColumn" :configure="treeValue"/>
    <delete-column v-if="loading.deleteColumn" :visible.sync="loading.deleteColumn" :configure="treeValue"/>
    <modify-column v-if="loading.modifyColumn" :visible.sync="loading.modifyColumn" :configure="treeValue"/>
    <rename-column v-if="loading.renameColumn" :visible.sync="loading.renameColumn" :configure="treeValue"/>
    <preview-column v-if="loading.previewColumn" :visible.sync="loading.previewColumn" :configure="treeValue"/>
  </div>
</template>

<script>
import DeleteTable from '../../components/Table/Delete'
import DataTree from '../../components/data/tree/DataTree'
import ServerStatus from '../../components/ServerStatus'
import DataSourceSelect from '../../components/data/datasource/DataSourceSelect'
import MonitorDisk from '../../components/monitor/disk'

import { getQuery } from '../../../services/Metadata'
import { getDiskUsedAndRatio } from '../../../services/Disk'
import CreateTable from '../../components/Table/Create'
import TablePreview from '../../components/Table/Preview'
import TableDdl from '../../components/Table/Ddl'
import TableColumn from '../../components/Column/Info'
import TableRename from '../../components/Table/Rename'
import AddDatabase from '../../components/Database/Add'
import DeleteDatabase from '../../components/Database/Delete'
import AddColumn from '../../components/Column/Add'
import DeleteColumn from '../../components/Column/Delete'
import ModifyColumn from '../../components/Column/Modify'
import RenameColumn from '../../components/Column/Rename'
import PreviewColumn from '../../components/Column/Preview'

const Support = require('../../../utils/Support')

export default {
  components: {
    PreviewColumn,
    RenameColumn,
    ModifyColumn,
    DeleteColumn,
    AddColumn,
    AddDatabase,
    TableRename,
    TableColumn,
    TablePreview,
    CreateTable,
    DeleteTable,
    ServerStatus,
    DeleteDatabase,
    DataSourceSelect,
    TableDdl,
    DataTree,
    MonitorDisk
  },
  data() {
    return {
      treeItems: [],
      treeValue: {},
      buttonLoading: false,
      ddl: {
        visible: false,
        title: '',
        context: null
      },
      loading: {
        tableBody: false,
        serverStatus: false,
        addDatabase: false,
        deleteTable: false,
        deleteDatabase: false,
        deleteColumn: false,
        createTable: false,
        tablePreview: false,
        tableColumn: false,
        tableRename: false,
        addColumn: false,
        modifyColumn: false,
        renameColumn: false,
        previewColumn: false
      },
      items: [],
      switchType: Support.SERVER
    }
  },
  mounted() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.treeItems = JSON.parse(localStorage.getItem('DataSources'))
    },
    async handlerGetTreeData(value, type) {
      this.treeValue = value
      let iType = value.type
      if (this.isNotEmpty(type)) {
        iType = type
      }
      const response = await getDiskUsedAndRatio(value.server, iType, value.database, value.table)
      if (response && response.status) {
        this.items = response.columns
      } else {
        this.items = []
      }
    },
    async handlerShowDDL(server, database, table) {
      this.buttonLoading = true
      const sql = this.stringFormat('SELECT ' +
          'create_table_query ' +
          'FROM system.tables ' +
          'WHERE database = \'{0}\' AND name = \'{1}\'', [database, table])
      const response = await getQuery(server, sql)
      if (response.status) {
        this.ddl.context = response.columns[0].create_table_query
        this.ddl.title = table + ' ' + this.$t('common.ddl')
        this.ddl.visible = true
        this.buttonLoading = false
      }
    },
    handlerToDetail() {
      const path = this.stringFormat('/data/detail/{0}/{1}/{2}', [this.treeValue.server, this.treeValue.database, this.treeValue.table])
      this.$router.push({
        path: path
      })
    },
    handlerSwitchType() {
      this.handlerGetTreeData(this.treeValue, this.switchType)
    },
    handlerClickTreeMenu(value) {
      if (value.command === Support.ADD && value.type === Support.SERVER) {
        this.loading.addDatabase = true
      }
      if (value.command === Support.INFO && value.type === Support.SERVER) {
        this.loading.serverStatus = true
      }
      if (value.command === Support.ADD && value.type === Support.DATABASE) {
        this.loading.createTable = true
      }
      if (value.command === Support.DELETE && value.type === Support.DATABASE) {
        this.loading.deleteDatabase = true
      }
      if (value.command === Support.DELETE && value.type === Support.TABLE) {
        this.loading.deleteTable = true
      }
      if (value.command === Support.DDL && value.type === Support.TABLE) {
        this.ddl.visible = true
        this.handlerShowDDL(this.treeValue.server, this.treeValue.database, this.treeValue.table)
      }
      if (value.command === Support.PREVIEW && value.type === Support.TABLE) {
        this.loading.tablePreview = true
      }
      if (value.command === Support.EDIT && value.type === Support.TABLE) {
        this.loading.tableRename = true
      }
      if (value.command === Support.ADD && value.type === Support.TABLE) {
        this.loading.addColumn = true
      }
      if (value.command === Support.INFO && value.type === Support.COLUMN) {
        this.loading.tableColumn = true
      }
      if (value.command === Support.DELETE && value.type === Support.COLUMN) {
        this.loading.deleteColumn = true
      }
      if (value.command === Support.EDIT && value.type === Support.COLUMN) {
        this.loading.modifyColumn = true
      }
      if (value.command === Support.RENAME && value.type === Support.COLUMN) {
        this.loading.renameColumn = true
      }
      if (value.command === Support.PREVIEW && value.type === Support.COLUMN) {
        this.loading.previewColumn = true
      }
    }
  }
}
</script>
