<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="form" size="mini">
        <el-form-item :label="this.$t('common.server')">
          <data-source-select
              v-if="getLengthGtZore(selectServers)"
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
    <el-row v-if="getLengthGtZore(tableDatas)" :gutter="20">
      <div v-for="info in tableDatas" :key="info.metric">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              {{ info.metric }}
            </div>
            <div style="font-size: 20px; text-align: center;">
              {{ info.value }}
            </div>
          </el-card>
        </el-col>
      </div>
    </el-row>
  </div>
</template>

<script>
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import { getDataSources } from '@/services/DataSource'
import { getMonitor } from '@/services/Monitor'
import { CONNECTIONS } from '@/utils/Support'

export default {
  components: {
    DataSourceSelect
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
      disabled: true
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
      this.selectServerValue = value
      const response = await getMonitor(this.selectServerValue, CONNECTIONS)
      if (!response.status) {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      } else {
        this.tableDatas = response.columns
      }
      this.disabled = false
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
