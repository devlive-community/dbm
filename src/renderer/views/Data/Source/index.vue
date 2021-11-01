<template>
  <div class="app-container">
    <el-row>
      <el-tooltip class="item" effect="dark"
                  :content="this.stringFormat('{0} {1} {2}', [this.$t('common.add'), this.$t('common.new'), this.$t('common.datasource')])"
                  placement="bottom">
        <el-button type="primary" size="mini" @click="handlerDataSource(ADD)">
          <i class="fa fa-plus-circle"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" :content="this.$t('common.refresh')" placement="bottom">
        <el-button type="success" size="mini" @click="handlerRefresh">
          <i class="fa fa-retweet"></i>
        </el-button>
      </el-tooltip>
    </el-row>
    <el-table :data="tableDatas" style="width: 100%">
      <el-table-column prop="name" :label="this.$t('common.name')"></el-table-column>
      <el-table-column prop="host" :label="this.$t('common.host')"></el-table-column>
      <el-table-column prop="port" :label="this.$t('common.port')"></el-table-column>
      <el-table-column prop="status" :label="this.$t('common.status')">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
               <span v-if="scope.row.status">
                 {{ $t('alter.service_available') }}
               </span>
              <span v-else>
                  {{ $t('alter.service_not_available') }}
               </span>
            </div>
            <el-button type="text">
              <i :class="'fa fa-' + (scope.row.status ? 'play-circle' : 'stop-circle')"
                 :style="'color: ' + (scope.row.status ? '#67C23A' : '#F56C6C')"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="this.$t('common.action')" width="100">
        <template slot-scope="scope">
          <el-popover placement="top">
            <p> {{ $t('alter.are_you_delete') }} </p>
            <div style="text-align: right; margin: 0">
              <el-button type="primary" size="mini" @click="handlerDelete(scope.row)">{{
                  $t('common.delete')
                }}?
              </el-button>
            </div>
            <el-tooltip class="item" effect="dark" placement="bottom" slot="reference">
              <div slot="content">{{ $t('common.delete') }}</div>
              <el-button type="text">
                <i class="fa fa-trash"></i>
              </el-button>
            </el-tooltip>
          </el-popover>
          <el-tooltip class="item" effect="dark" placement="top" slot="reference">
            <div slot="content">{{ $t('common.edit') }}</div>
            <el-button type="text" @click="handlerDataSource(EDIT, scope.row)">
              <i class="fa fa-edit"></i>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <data-source
        :title="datasource.title"
        :loading="disabled.dataSource"
        :data="datasource.data"
        :type="datasource.type"
        :unique="datasource.unique"
        @close="disabled.dataSource = false"
        @refresh="_initialize"></data-source>
  </div>
</template>

<script>
import DataSource from '@/views/components/data/datasource/DataSource'
import { getDataSources } from '@/services/DataSource'
import { jobOfCheckHealth } from '@/job/JobDataSource'
import { ADD } from '@/utils/Support'

export default {
  components: {
    DataSource
  },
  data() {
    return {
      tableDatas: [],
      listLoading: true,
      disabled: {
        dataSource: false
      },
      datasource: {
        title: null,
        type: ADD,
        data: null,
        unique: null
      }
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.tableDatas = getDataSources(null).columns
    },
    handlerDelete(row) {
      const dataSources = JSON.parse(localStorage.getItem('DataSources')).filter(item => item.name !== row.name)
      localStorage.setItem('DataSources', JSON.stringify(dataSources))
      this._initialize()
    },
    handlerRefresh() {
      jobOfCheckHealth()
      this.$notify.success({
        title: this.$t('success'),
        message: this.stringFormat('{0} {1}', [this.$t('common.refresh'), this.$t('common.success')])
      })
      this._initialize()
    },
    handlerDataSource(type, value) {
      this.disabled.dataSource = true
      this.datasource.type = type
      this.datasource.data = value
      if (type === ADD) {
        this.datasource.title = this.stringFormat('{0} {1} {2}', [this.$t('common.add'), this.$t('common.new'), this.$t('common.datasource')])
      } else {
        this.datasource.unique = value.name
        this.datasource.title = this.stringFormat('{0} {1}', [this.$t('common.edit'), this.$t('common.datasource')])
      }
    }
  }
}
</script>
