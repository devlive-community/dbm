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
          <el-autocomplete v-model="form.track"
                           popper-class="my-autocomplete"
                           :disabled="isEmpty(selectServerValue)"
                           :fetch-suggestions="handlerGetTrackTop"
                           :placeholder="stringFormat('{0} {1}', [this.$t('common.track'), this.$t('common.id')])">
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">{{ item.queryStartTime }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="isEmpty(selectServerValue) || isEmpty(form.track)"
                     @click="handlerQuery()">
            {{ this.$t('common.query') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-empty v-if="isEmpty(trackInfo)"/>
      <div v-else>
        <el-tooltip :content="stringFormat('{0} {1}', [this.$t('common.query'), this.$t('common.thread')])">
          <el-button round size="mini" type="primary" @click="handlerGetThread()">
            <i class="fa fa-stream"></i>
          </el-button>
        </el-tooltip>
        <el-timeline>
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
      </div>
    </el-row>
    <el-dialog :title="form.track" :visible.sync="trackThread.show">
      <el-empty v-if="isEmpty(trackThread.columns)"/>
      <table-detail v-else :columns="trackThread.columns" :headers="trackThread.headers"></table-detail>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="trackThread.show = false">{{ this.$t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import { getDataSources } from '@/services/DataSource'
import { getTrackInfo, getTrackThread, getTrackTop } from '@/services/Track'
import TableDetail from '@/components/Table'

export default {
  components: {
    TableDetail,
    DataSourceSelect
  },
  data() {
    return {
      selectServerValue: null,
      form: {
        track: ''
      },
      trackInfo: null,
      trackThread: {
        show: false,
        headers: [],
        columns: []
      }
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
    },
    handlerGetThread() {
      this.trackThread.show = true
      getTrackThread(this.selectServerValue, this.form.track).then(response => {
        this.trackThread.headers = response.headers
        this.trackThread.columns = response.columns
      })
    },
    handlerGetTrackTop(query, callback) {
      getTrackTop(this.selectServerValue, 100).then(response => {
        if (response.status) {
          callback(response.columns)
        }
      })
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

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .addr {
      font-size: 12px;
      margin-top: -5px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
