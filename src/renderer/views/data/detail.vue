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
import { runExecute } from '@/api/query'
import { stringFormat, getDataSource, getServerURL } from '@/utils/utils'

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
    _initialize() {
      this.loading = true
      this.common = this.$route.params
      const dataSource = getDataSource(this.common.server)
      this.inputValue = getServerURL(dataSource[0].host, dataSource[0].port, null)
      const sql = stringFormat('SELECT database, name, uuid, engine, is_temporary, data_paths, metadata_path, metadata_modification_time, dependencies_database, dependencies_table, create_table_query, engine_full, partition_key, sorting_key, primary_key, sampling_key, storage_policy, total_rows, total_bytes, lifetime_rows, lifetime_bytes FROM system.tables WHERE database = \'{0}\' AND name = \'{1}\'', [this.common.database, this.common.table])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.tableInfo = response.data.data[0]
          this.loading = false
        }
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
      })
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
    handlerDataForColumns() {
      const columnsSql = stringFormat('SELECT name, type, position, default_kind, default_expression, data_compressed_bytes, data_uncompressed_bytes, marks_bytes, comment, is_in_partition_key, is_in_sorting_key, is_in_primary_key, is_in_sampling_key, compression_codec FROM system.columns WHERE database = \'{0}\' AND table = \'{1}\'', [this.common.database, this.common.table])
      runExecute(this.inputValue, columnsSql).then(response => {
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
    handlerDataForPreview() {
      const columnsSql = stringFormat('SELECT * FROM {0}.{1} LIMIT 10', [this.common.database, this.common.table])
      runExecute(this.inputValue, columnsSql).then(response => {
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
    }
  }
}
</script>
