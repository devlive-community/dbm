<template>
  <el-dialog title="Quick Query" :visible.sync="bodyLoading" :width="width" @close="closeDialog">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card" v-loading="cardLoading">
          <div slot="header" class="clearfix">
            <span><i class="fa fa-server"></i> {{ this.$t('common.server') }}</span>
          </div>
          <el-menu>
            <el-menu-item
              v-for="(server, index) in servers" 
              :key="index"
              :index="server.name"
              :disabled="!server.status"
              @click="handlerShowData(server, 'database')">
              <el-tooltip slot="title" v-if="!server.status" class="item" effect="dark" :content="server.message" placement="top">
                <span> {{server.name}} </span>
              </el-tooltip>
              <span v-else> {{server.name}} </span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" v-loading="cardLoading">
          <div slot="header" class="clearfix">
            <span><i class="fa fa-database"></i> {{ this.$t('common.database') }}</span>
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
        <el-card class="box-card" v-loading="cardLoading">
          <div slot="header" class="clearfix">
            <span><i class="fa fa-table"></i> {{ this.$t('common.table') }}</span>
          </div>
          <el-menu>
            <el-menu-item
              v-for="(table, index) in tables" 
              :key="index"
              :index="table.name"
              @click="handlerShowData(table.name, null)">
              <span slot="title"> <i :class="handlerGetIcon(table.engine)" aria-hidden="true"></i> {{table.name}} </span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-dropdown v-if="remoteTable !== null" size="mini" split-button type="primary" @command="hadnlerGenerSql">  {{ this.$t('common.quick') }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="DESCRIBE">DESCRIBE ...</el-dropdown-item>
          <el-dropdown-item command="CREATE_TABLE">SHOW CREATE TABLE ...</el-dropdown-item>
          <el-dropdown-item command="LIMIT">SELECT ... LIMIT 100</el-dropdown-item>
          <el-dropdown-item command="SELECT_COUNT">SELECT COUNT FROM ...</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-dialog>
</template>

<script>
import { getFaIcon } from '@/utils/Utils'
import { getDatabasesOrTables, getQuickSql } from '@/services/Query'

export default {
  name: 'QueryQuick',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  created() {
    this.servers = JSON.parse(localStorage.getItem('DataSources'))
  },
  data() {
    return {
      bodyLoading: false,
      cardLoading: false,
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
    async handlerShowData(source, type) {
      this.cardLoading = true
      if (type === 'database') {
        this.remoteServer = source.name
      }
      if (type) {
        const response = await getDatabasesOrTables(this.remoteServer, type, source)
        if (response.status) {
          switch (type) {
            case 'database':
              this.databases = response.columns
              break
            case 'table':
              this.remoteDatabase = source
              this.tables = response.columns
              break
          }
        } else {
          this.$notify.error({
            title: this.$t('common.error'),
            message: response.message
          })
        }
      } else {
        this.remoteTable = source
      }
      this.cardLoading = false
    },
    hadnlerGenerSql(quick) {
      this.quickSql = getQuickSql(quick, this.remoteDatabase, this.remoteTable)
      this.$emit('getQuickSql', this.quickSql)
      this.closeDialog()
    },
    handlerGetIcon(engine) {
      return getFaIcon(engine)
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.bodyLoading = this.loading
      }
    },
    width: {
      deep: true
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
