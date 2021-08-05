<template>
  <div class="dashboard-container">
    Welcome to DBM(Incubator)
    <el-tag type="danger">{{ 'Version for ' + VERSION }}</el-tag>
    <el-empty v-if="isEmpty(charts)"/>
    <el-row v-else :gutter="20">
      <el-col v-for="chart in charts" :span="12">
        <line-charts :title="chart.title" :items="chart.items" :key="chart.title"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LineCharts from '@/components/Charts/Line'
import { getDataSources } from '@/services/DataSource'
import { getQueryCount } from '@/services/Monitor'
import { stringFormat } from '@/utils/utils'

export default {
  name: 'dashboard',
  components: {
    LineCharts
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      charts: []
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      getDataSources(null).columns.forEach(v => {
        getQueryCount(v.name).then(response => {
          const chart = {
            title: stringFormat('{0} {1} {2}', [v.name, this.$t('common.query'), this.$t('common.count')]),
            items: response.columns
          }
          this.charts.push(chart)
        })
      })
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.em {
  font-weight: bold;
}

/deep/ .el-card__header {
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
}

/deep/ .el-card__body {
  padding: 5px 15px;
}
</style>
