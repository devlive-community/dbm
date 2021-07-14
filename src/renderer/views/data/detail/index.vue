<template>
  <div class="app-container">
    <el-row>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="fa fa-server"></i> {{ common.server }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="fa fa-database"></i> {{ common.database }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <i class="fa fa-table"></i> {{ common.table }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row :gutter="12">
      <!-- Basic information -->
      <el-col>
        <el-card shadow="never">
          <div slot="header">
            <span>
              <i class="fa fa-table"></i> {{ common.table }}
              <i class="fa fa-calendar"></i> {{ tableInfo.metadata_modification_time }}
            </span>
            <el-tooltip class="item" effect="dark" content="Refresh" placement="top">
              <el-button style="float: right; padding: 3px 0"
                type="text"
                icon="el-icon-refresh"
                @click="handlerRefresh()">
              </el-button>
            </el-tooltip>
          </div>
          <div class="text item">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card class="box-card" v-loading="loading">
                  <div slot="header" class="clearfix">
                    <span>Basic Info</span>
                  </div>
                  <div>
                    Name: {{ tableInfo.name }}
                    <p>Database: {{ tableInfo.database }}</p>
                    <p>
                      Temporary: 
                      <el-switch 
                        :value="tableInfo.is_temporary"
                        active-text="Yes"
                        inactive-text="No">
                        </el-switch></p>
                    <p>Engine: {{ tableInfo.engine }}</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="box-card" v-loading="loading">
                  <div slot="header" class="clearfix">
                    <span>Partition Info</span>
                  </div>
                  <div>
                    Partition Key: {{ tableInfo.partition_key }}
                    <p>Sorting Key: {{ tableInfo.sorting_key }}</p>
                    <p>Primary Key: {{ tableInfo.primary_key }} </p>
                    <p>Sampling Key: {{ tableInfo.sampling_key }}</p>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card class="box-card" v-loading="loading">
                  <div slot="header" class="clearfix">
                    <span>Data Size</span>
                  </div>
                    Total Rows {{ tableInfo.total_rows }}
                    <p>Total Bytes {{ tableInfo.total_bytes }}</p>
                    <p>Lifetime Rows {{ tableInfo.lifetime_rows }}</p>
                    <p>Lifetime Bytes {{ tableInfo.lifetime_bytes }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-tabs v-model="activeTab" @tab-click="handlerTabClick()">
      <el-tab-pane label="Columns" name="Columns">
        <el-table v-loading.body="loading"
          style="width: 100%"
          border
          :data="columns">
          <template v-for="(item,index) in headers">
            <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-loading="tableLoading" label="Preview" name="Preview">
        <el-table v-loading="tableLoading"
          style="width: 100%"
          border
          :data="columns">
          <template v-for="(item,index) in headers">
            <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getTableInfo, getTableColumns, getTablePreview } from '@/services/Table'

export default {
  data() {
    return {
      common: {
        server: '',
        database: '',
        table: ''
      },
      tableInfo: {},
      headers: [],
      columns: [],
      loading: false,
      tableLoading: false,
      activeTab: 'Columns'
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    async _initialize() {
      this.loading = true
      this.common = this.$route.params
      const response = await getTableInfo(this.common.server, this.common.database, this.common.table)
      if (response.status) {
        this.tableInfo = response.columns[0]
        this.loading = false
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
      this.handlerTabClick()
    },
    handlerRefresh() {
      this._initialize()
    },
    handlerTabClick() {
      this.tableLoading = true
      if (this.activeTab === 'Columns') {
        this.handlerDataForColumns()
      } else if (this.activeTab === 'Preview') {
        this.handlerDataForPreview()
      }
      this.tableLoading = false
    },
    async handlerDataForColumns() {
      const response = await getTableColumns(this.common.server, this.common.database, this.common.table)
      if (response.status) {
        this.headers = response.headers
        this.columns = response.columns
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
    },
    async handlerDataForPreview() {
      const response = await getTablePreview(this.common.server, this.common.database, this.common.table)
      if (response.status) {
        this.headers = response.headers
        this.columns = response.columns
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
    }
  }
}
</script>
