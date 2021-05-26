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
            <el-button style="float: right; padding: 3px 0" type="text"></el-button>
          </div>
          <div class="text item">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-card>
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
                <el-card>
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
                <el-card class="box-card">
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
      tableInfo: {}
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.common = this.$route.params
      const dataSource = getDataSource(this.common.server)
      this.inputValue = getServerURL(dataSource[0].host, dataSource[0].port, null)
      const sql = stringFormat('SELECT database, name, uuid, engine, is_temporary, data_paths, metadata_path, metadata_modification_time, dependencies_database, dependencies_table, create_table_query, engine_full, partition_key, sorting_key, primary_key, sampling_key, storage_policy, total_rows, total_bytes, lifetime_rows, lifetime_bytes FROM system.tables WHERE database = \'{0}\' AND name = \'{1}\'', [this.common.database, this.common.table])
      runExecute(this.inputValue, sql).then(response => {
        if (response.status === 200) {
          this.tableInfo = response.data.data[0]
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

<style scoped >
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
