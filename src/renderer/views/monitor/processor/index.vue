<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="form" size="mini">
        <el-form-item :label="this.$t('common.server')">
          <data-source-select
              v-if="this.getLengthGtZone(selectServers)"
              :items="selectServers"
              @getValue="handlerServer"
              :placeholder="'ClickHouse Server'">
          </data-source-select>
          <span v-if="form.auto">
            <i class="fa fa-spin fa-spinner"></i>
            {{ this.$t('common.refresh') + this.$t('common.time') }} <el-tag size="mini"> {{
              this.refreshTime
            }}</el-tag>
          </span>
        </el-form-item>
        <el-form-item :label="this.$t('common.auto')" style="float: right;">
          <el-switch v-model="form.auto" :disabled="disabled" @change="handlerAuto"></el-switch>
        </el-form-item>
        <el-form-item :label="this.$t('common.threshold')" style="float: right;">
          <el-input-number v-model="form.threshold" :disabled="form.auto" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
    </el-row>
    <highcharts :options="chartOptions"></highcharts>
    <el-table v-if="this.getLengthGtZone(tableDatas)" :data="tableDatas" style="width: 100%">
      <el-table-column prop="time" :label="this.$t('common.time')"></el-table-column>
      <el-table-column prop="rows" :label="this.$t('common.rows')"></el-table-column>
      <el-table-column prop="elapsed" :label="this.$t('common.elapsed')"></el-table-column>
      <el-table-column prop="bytes" :label="this.$t('common.bytes')"></el-table-column>
      <el-table-column prop="memoryUsage" :label="this.$t('common.memoryUsage')"></el-table-column>
      <el-table-column prop="bytesRead" :label="this.$t('common.bytesRead')"></el-table-column>
      <el-table-column prop="bytesWritten" :label="this.$t('common.bytesWritten')"></el-table-column>
      <el-table-column prop="hash" :label="this.$t('common.hash')"></el-table-column>
      <el-table-column prop="host" :label="this.$t('common.host')"></el-table-column>
      <el-table-column fixed="right" :label="this.$t('common.action')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">{{ $t('common.ddl') }}</div>
            <el-button type="text" size="small" icon="el-icon-search" @click="handlerShowDDL(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">{{ $t('common.kill') }}</div>
            <el-button type="text" size="small" @click="handlerKill(scope.row)">
              <i class="fa fa-stop danger"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <table-ddl :loading="ddl.visible" :title="ddl.title" :ddl="ddl.context" @close="ddl.visible = false"></table-ddl>
    <query-kill :loading="kill.visible" :title="kill.title" :id="kill.id" :server="selectServerValue"
                @close="kill.visible = false"></query-kill>
  </div>
</template>

<script>
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import TableDdl from '../../components/Table/Ddl'
import QueryKill from '@/views/components/Query/QueryKill'
import { getDataSources } from '@/services/DataSource'
import { getMonitor } from '@/services/Monitor'
import { buildArray } from '@/utils/ArrayUtils'
import { PROCESSES } from '@/utils/Support'

export default {
  components: {
    DataSourceSelect,
    TableDdl,
    QueryKill
  },
  data() {
    return {
      tableDatas: [],
      selectServerValue: null,
      timer: 0,
      refreshTime: 0,
      form: {
        threshold: 2,
        auto: false
      },
      disabled: true,
      dataCount: [],
      chartOptions: {
        title: {
          text: this.$t('common.processor') + this.$t('common.count')
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: false
          }
        },
        series: []
      },
      seriesMap: null,
      ddl: {
        visible: false,
        title: '',
        context: null
      },
      kill: {
        visible: false,
        title: null,
        id: null
      }
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.seriesMap = new Map()
      this.selectServers = getDataSources(null).columns
    },
    async handlerServer(value) {
      this.selectServerValue = value
      const response = await getMonitor(this.selectServerValue, PROCESSES)
      if (!response.status) {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      } else {
        this.tableDatas = response.columns
      }
      this.disabled = false
      const serie = {
        name: this.stringFormat('{0}-({1})', [this.selectServerValue, this.$t('common.count')]),
        data: buildArray(this.dataCount, 20, true, this.tableDatas.length)
      }
      if (this.seriesMap.has(this.selectServerValue)) {
        this.seriesMap.delete(this.selectServerValue)
      }
      this.seriesMap.set(this.selectServerValue, serie)
      this.chartOptions.series = Array.from(this.seriesMap.values())
    },
    handlerAuto() {
      if (this.form.auto) {
        this.timer = setInterval(() => {
          this.handlerServer(this.selectServerValue)
          this.refreshTime = (new Date()).valueOf()
        }, this.form.threshold * 1000)
      } else {
        clearInterval(this.timer)
      }
    },
    handlerShowDDL(row) {
      this.ddl.visible = true
      this.ddl.title = row.id
      this.ddl.context = row.query
    },
    handlerKill(row) {
      this.kill.title = this.$t('common.kill') + ' ' + row.id
      this.kill.visible = true
      this.kill.id = row.id
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  watch: {
    chartOptions: {}
  }
}
</script>
