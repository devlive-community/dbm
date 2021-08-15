<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-divider content-position="left">{{ this.$t('common.source') }}</el-divider>
        <div class="grid-content">
          <el-form :inline="true" :model="form" size="mini">
            <el-form-item :label="this.$t('common.connection')" :label-width="this.commonLabelWidth120">
              <data-source-select v-if="this.getLengthGtZore(server)" :items="server"
                                  @getValue="handlerServer($event, true)"
                                  :placeholder="this.stringFormat('{0}{1}', [this.$t('common.clickhouse'), this.$t('common.server')])">
              </data-source-select>
            </el-form-item>
            <el-form-item :label="this.$t('common.database')" :label-width="this.commonLabelWidth120">
              <el-select v-model="source.database.value" :disabled="!source.server"
                         @change="handlerGetData(source.server, true, false)"
                         :placeholder="this.stringFormat('{0}{1}', [this.$t('common.clickhouse'), this.$t('common.database')])">
                <el-option v-for="item in source.database.data" :key="item.name" :label="item.name" :value="item.name"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="this.$t('common.table')" :label-width="this.commonLabelWidth120">
              <el-select v-model="source.table.value" :disabled="!source.database.value"
                         @change="handlerGetData(source.server, true, true)"
                         :placeholder="this.stringFormat('{0}{1}', [this.$t('common.clickhouse'), this.$t('common.table')])">
                <el-option v-for="item in source.table.data" :key="item.name" :label="item.name" :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <el-divider content-position="left">{{ this.$t('common.target') }}</el-divider>
        <div class="grid-content">
          <el-form :inline="true" :model="form" size="mini">
            <el-form-item :label="this.$t('common.connection')" :label-width="this.commonLabelWidth120">
              <data-source-select v-if="this.getLengthGtZore(server)" :items="server"
                                  @getValue="handlerServer($event, false)"
                                  :placeholder="this.stringFormat('{0}{1}', [this.$t('common.clickhouse'), this.$t('common.server')])">
              </data-source-select>
            </el-form-item>
            <el-form-item :label="this.$t('common.database')" :label-width="this.commonLabelWidth120">
              <el-select v-model="target.database.value" :disabled="!target.server"
                         @change="handlerGetData(target.server, false, false)"
                         :placeholder="this.stringFormat('{0}{1}', [this.$t('common.clickhouse'), this.$t('common.database')])">
                <el-option v-for="item in target.database.data" :key="item.name" :label="item.name" :value="item.name"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="this.$t('common.table')" :label-width="this.commonLabelWidth120">
              <el-select v-model="target.table.value" :disabled="!target.database.value"
                         @change="handlerGetData(target.server, true, true)"
                         :placeholder="this.stringFormat('{0}{1}', [this.$t('common.clickhouse'), this.$t('common.table')])">
                <el-option v-for="item in target.table.data" :key="item.name" :label="item.name" :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-divider content-position="left">{{ this.$t('common.preview') }}</el-divider>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          <migrate-preview v-if="source.server" :source="source" :target="target"></migrate-preview>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
    <el-button type="primary" class="right" size="mini" :loading="loading" :disabled="disabled"
               @click="handlerMigrate">
      {{ this.$t('common.execute') }}
    </el-button>
  </div>
</template>

<script>
import DataSourceSelect from '@/views/components/data/datasource/DataSourceSelect'
import { getDataSources } from '@/services/DataSource'
import { getDatabasesOrTables } from '../../../services/Query'
import MigratePreview from '../../components/tools/migrate/preview'
import { migrate } from '../../../services/Migrate'

export default {
  components: {
    MigratePreview,
    DataSourceSelect
  },
  data() {
    return {
      server: null,
      source: {
        server: null,
        database: {
          data: null,
          value: null
        },
        table: {
          data: null,
          value: null
        }
      },
      target: {
        server: null,
        database: {
          data: null,
          value: null
        },
        table: {
          data: null,
          value: null
        }
      },
      form: {},
      loading: false,
      disabled: true
    }
  },
  created() {
    this._initialize()
  },
  methods: {
    _initialize() {
      this.server = getDataSources(null).columns
    },
    handlerServer(value, type) {
      if (type) {
        this.source.server = value
      } else {
        this.target.server = value
      }
      this.handlerGetData(value, type, true)
    },
    handlerGetData(server, type, database) {
      this.handlerDisabled()
      let isType = 'database'
      if (!database) {
        isType = 'table'
      }
      let isDatabase = this.source.database.value
      if (!type) {
        isDatabase = this.target.database.value
      }
      getDatabasesOrTables(server, isType, isDatabase).then(response => {
        if (response.status) {
          if (database) {
            if (type) {
              this.source.database.data = response.columns
            } else {
              this.target.database.data = response.columns
            }
          } else {
            if (type) {
              this.source.table.data = response.columns
            } else {
              this.target.table.data = response.columns
            }
          }
        }
      })
    },
    handlerMigrate() {
      this.loading = true
      migrate(this.source, this.target).then(response => {
        if (response.status) {
          this.$notify.success({
            title: this.$t('common.success'),
            message: response.message
          })
        }
        this.loading = false
      })
    },
    handlerDisabled() {
      if (this.isNotEmpty(this.source.server) && this.isNotEmpty(this.source.database.value) &&
          this.isNotEmpty(this.source.table.value) && this.isNotEmpty(this.target.server) &&
          this.isNotEmpty(this.target.database.value)) {
        this.disabled = false
      }
    }
  }
}
</script>
