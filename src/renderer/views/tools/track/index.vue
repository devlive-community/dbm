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
        </el-form-item>
        <el-form-item :label="this.$t('common.track')">
          <el-input v-model="form.track"
                    :disabled="isEmpty(selectServerValue)"
                    :placeholder="stringFormat('{0} {1}', [this.$t('common.track'), this.$t('common.id')])"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="isEmpty(selectServerValue) || isEmpty(form.track)" @click="handlerQuery()">
            {{ this.$t('common.query') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-empty v-if="isEmpty(trackInfo)"/>
      <el-timeline v-else>
        <el-timeline-item
            v-for="(track, index) in trackInfo"
            :key="index"
            :color="getTrackColor(track.type)">
          <el-card>
            <div slot="header">
              <span :style="'color: ' + getTrackColor(track.type) + ';'">{{ track.type }}</span>
              <span class="em">({{ track.queryStartTime }})</span>
            </div>
            <div style="margin-top: 2px;">
              <p v-for="(v, i) in Object.entries(track)" v-if="v[0] !== 'ddl'" :key="i" :value="v[1]" class="item">
                <em>{{ v[0] }}</em> : {{ v[1] }}
              </p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-row>
  </div>
</template>

<script>
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import { getDataSources } from '@/services/DataSource'
import { getTrackInfo } from '@/services/Track'

export default {
  components: {
    DataSourceSelect
  },
  data() {
    return {
      selectServerValue: null,
      form: {
        track: null
      },
      trackInfo: null
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.selectServers = getDataSources(null).columns
    },
    handlerServer(value) {
      this.selectServerValue = value
    },
    async handlerQuery() {
      const response = await getTrackInfo(this.selectServerValue, this.form.track)
      if (response.status) {
        this.trackInfo = response.columns
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
