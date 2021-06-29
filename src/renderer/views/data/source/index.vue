<template>
  <div class="app-container">
    <el-row>
      <el-tooltip class="item" effect="dark" content="Add New DataSource" placement="bottom">
        <el-button type="primary" size="mini" @click="disabled.dataSource = true">
          <i class="fa fa-plus-circle"></i>
        </el-button>
      </el-tooltip>
    </el-row>
    <el-table :data="tableDatas" style="width: 100%">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="host" label="Host"></el-table-column>
      <el-table-column prop="port" label="Port"></el-table-column>
      <el-table-column prop="status" label="Connection Status">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top"
            :content="scope.row.status ? 'The current service is available for query or other operations!' : 'The current service is not available. Please check the configuration or remove it!'" >
            <el-button type="text">
              <i :class="'fa fa-' + (scope.row.status ? 'play-circle' : 'stop-circle')"
                :style="'color: ' + (scope.row.status ? '#67C23A' : '#F56C6C')"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="Action"
        width="100">
        <template slot-scope="scope">
          <el-popover placement="top">
            <p>Are you sure you want to delete {{scope.row.name}} data source？</p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini"  @click="handlerDelete(scope.row)">OK?</el-button>
            </div>
            <el-tooltip class="item" effect="dark" content="Delete DataSource?" placement="bottom" slot="reference">
              <el-button type="text">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <data-source :title="'Add New DataSource'" :loading="disabled.dataSource"
      @close="disabled.dataSource = false"
      @refresh="_initialize"></data-source>
  </div>
</template>

<script>
import DataSource from '@/views/components/data/datasource/DataSource'
import { getDataSources } from '@/services/DataSource'

export default {
  components: {
    DataSource
  },
  data() {
    return {
      tableDatas: [],
      listLoading: true,
      disabled: {
        dataSource: false
      }
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.tableDatas = getDataSources(null).columns
    },
    handlerDelete(row) {
      const dataSources = JSON.parse(localStorage.getItem('DataSources')).filter(item => item.name !== row.name)
      localStorage.setItem('DataSources', JSON.stringify(dataSources))
      this._initialize()
    }
  }
}
</script>
