<template>
  <el-row>
    <el-empty v-if="isEmpty(items)"/>
    <highcharts v-else :options="chartOptions" :highcharts="hcInstance"></highcharts>
  </el-row>
</template>

<script>
import Highcharts from 'highcharts'

export default {
  name: 'LineCharts',
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    title: {
      type: String,
      default: null
    }
  },
  created() {
    this._initialize()
  },
  data() {
    return {
      hcInstance: Highcharts,
      chartOptions: {
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: []
        },
        series: []
      }
    }
  },
  methods: {
    _initialize() {
      const options = this.hcInstance.getOptions()
      options.title.text = this.title
      this.chartOptions.xAxis.categories = this.items.map(v => v.categories)
      this.chartOptions.series = [{
        name: this.title,
        data: this.items.map(v => v.value)
      }]
    }
  },
  watch: {}
}
</script>
