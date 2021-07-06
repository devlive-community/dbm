<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { jobOfCheckHealth } from '@/job/JobDataSource'

export default {
  name: 'App',
  created() {
    this._initialize()
  },
  methods: {
    getData() {
      jobOfCheckHealth()
    },
    _initialize() {
      return setInterval(() => {
        this.getData()
      }, 1000 * 60)
    }
  }
}
</script>
<style lang="scss">
  @import './styles/index.scss';
</style>
