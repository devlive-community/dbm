<template>
  <div class="dashboard-container">
    Welcome to DBM(Incubator)
    <el-tag type="danger">{{'Version for ' + VERSION}}</el-tag>
    <br>
    <h3>Release Timeline</h3>
    <el-timeline>
      <el-timeline-item timestamp="2021-07-06" placement="top" :color="'#F56C6C'" :size="'large'">
        <el-card>
          <div slot="header">
            <span class="em">1.2.0-SNAPSHOT <el-tag type="danger" size="mini">latest</el-tag></span>
          </div>
          <div style="margin-top: 2px;">
            <code>DBM Version for 1.2.0-SNAPSHOT is released!</code>
            <el-divider content-position="left">Feature</el-divider>
            <p>Add version for dashboard</p>
            <p>Replace the SVG icon with fa icon</p>
            <p>Refactoring menu style</p>
            <p>Optimize part UI and logic(query, datasource)</p>
            <p>Add data source timing detection task</p>
            <p>Add app info page</p>
            <p>Split the service tree into new components</p>
            <p>Shield invalid data in quick query</p>
            <p>Support internationalization</p>
            <p>Drop limit supported by data source construction</p>
            <p>Refactoring query history UI</p>
            <p>Support network timeout setting</p>
            <p>Add server occupancy process monitoring</p>
            <p>Add process chart</p>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2021-06-18" placement="top" :color="'#0bbd87'">
        <el-card>
          <div slot="header">
            <span class="em">1.1.0-SNAPSHOT</span>
          </div>
          <div style="margin-top: 2px;">
            <code>DBM Version for 1.1.0-SNAPSHOT is released!</code>
            <el-divider content-position="left">Feature</el-divider>
            <p>Support add datasource to query page</p>
            <p>Support clear query history</p>
            <p>Support show selection and index for table components</p>
            <p>Add query history</p>
            <p>Support SHOW_CREATE_TABLE and SELECT_COUNT for quick sql</p>
            <p>Replace software logo</p>
            <p>Support icon for table</p>
            <p>Disable system library UI delete table operation</p>
            <p>Support delete empty table database</p>
            <p>Add server info view</p>
            <p>Support cancel query</p>
            <el-divider content-position="left">Fix</el-divider>
            <p>Fix Metadata database selection error</p>
          </div>
        </el-card>
      </el-timeline-item>
      <el-timeline-item timestamp="2021-06-03" placement="top" :color="'#0bbd87'">
        <el-card>
          <div slot="header">
            <span class="em">1.0.0-SNAPSHOT</span>
          </div>
          <div style="margin-top: 2px;">
            <code>DBM Version for 1.0.0-SNAPSHOT is released!</code>
            <el-divider content-position="left">Feature</el-divider>
            <p>Support multiple data sources</p>
            <p>Support multiple data sources query</p>
            <p>Support table metadate</p>
            <p>Support delete table</p>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
