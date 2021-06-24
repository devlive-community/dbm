<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" size="mini" @click="disabled.dataSource = true">
        Add New
      </el-button>
    </el-row>
    <el-table
      :data="tableDatas"
      style="width: 100%">
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="host" label="Host"></el-table-column>
      <el-table-column prop="port" label="Port"></el-table-column>
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
            <el-button type="text" size="small" slot="reference">Delete</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <data-source :title="'Add New DataSource'" :loading="disabled.dataSource" @close="disabled.dataSource = false"></data-source>
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
