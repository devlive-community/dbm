<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" size="mini">
        <el-form-item :label="this.$t('common.server')">
          <data-source-select v-if="this.getLengthGtZone(selectServers)" :items="selectServers"
                              @getValue="handlerServer" :placeholder="'ClickHouse Server'">
          </data-source-select>
        </el-form-item>
        <el-form-item :label="this.$t('common.threshold')" style="float: right;">
          <el-input-number v-model="threshold" :min="500" :step="500" @change="handlerServer(null)"></el-input-number>
        </el-form-item>
      </el-form>
    </el-row>
    <el-skeleton :rows="6" v-if="loading" animated/>
    <div v-else>
      <el-empty v-if="this.isEmpty(this.tableData)"></el-empty>
      <table-detail v-else :columns="tableData.columns" :headers="tableData.headers"></table-detail>
    </div>
  </div>
</template>

<script>
import DataSourceSelect from '../../../views/components/data/datasource/DataSourceSelect'
import TableDdl from '../../components/Table/Ddl'
import { getDataSources } from '../../../services/DataSource'
import { getSlowQuery } from '../../../services/Monitor'
import TableDetail from '../../../components/Table'

const NotifyUtils = require('../../../utils/NotifyUtils')
const StringUtils = require('../../../utils/StringUtils')

export default {
  components: {
    TableDetail,
    DataSourceSelect,
    TableDdl
  },
  data() {
    return {
      selectServers: [],
      selectServer: null,
      tableData: [],
      loading: false,
      threshold: 500
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.selectServers = getDataSources(null).columns
    },
    async handlerServer(value) {
      if (StringUtils.isNotEmpty(value)) {
        this.selectServer = value
      }
      this.loading = true
      getSlowQuery(this.selectServer, this.threshold).then(response => {
        if (response.status) {
          this.tableData = response
        } else {
          NotifyUtils.error(this.$t('common.error'), response.message)
        }
        this.loading = false
      })
    }
  },
  watch: {
    chartOptions: {}
  }
}
</script>
