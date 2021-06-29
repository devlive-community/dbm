<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this._initialize()
  },
  methods: {
    getData() {
      console.log(1)
    },
    _initialize() {
      return setInterval(() => {
        this.getData()
      }, 5000)
    }
  }
}
</script>
<style lang="scss">
  @import './styles/index.scss';
</style>
