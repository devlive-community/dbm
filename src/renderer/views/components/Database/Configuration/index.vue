<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="16">
        <el-form ref="form" :model="form" :label-width="form.labelWidth" center size="mini">
          <el-divider content-position="left">{{ this.$t('common.basic') }}</el-divider>
          <el-alert v-if="!form.validateDatabase"
                    :title="this.stringFormat(this.$t('formatter.database_exists'), [form.name])"
                    :closable="false" type="error">
          </el-alert>
          <el-form-item :label="this.$t('common.engine')">
            <el-tag size="mini">{{ form.engine }}</el-tag>
          </el-form-item>
          <el-form-item :label="this.$t('common.name')">
            <el-input v-loading="form.validateStatus" v-model="form.name" @change="handlerValidate"/>
          </el-form-item>
          <el-divider content-position="left">{{ this.$t('common.property') }}</el-divider>
          <database-engine-lazy v-if="form.engine === this.$t('database.engine.lazy.name')"
                                @change="handlerDatabaseEngineConfiguration"></database-engine-lazy>
          <database-engine-mysql v-if="form.engine === this.$t('database.engine.mysql.name')"
                                 @change="handlerDatabaseEngineConfiguration"></database-engine-mysql>
          <database-engine-materialized-mysql v-if="form.engine === this.$t('database.engine.materialized.mysql.name')"
                                              @change="handlerDatabaseEngineConfiguration"></database-engine-materialized-mysql>
        </el-form>
      </el-col>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDatabase } from '../../../../services/DatabaseService'
import DatabaseEngineLazy from '../Engine/Lazy'
import DatabaseEngineMysql from '../Engine/MySQL'
import DatabaseEngineMaterializedMysql from '../Engine/Materialized/MySQL'

const StringUtils = require('../../../../utils/StringUtils')
const NotifyUtils = require('../../../../utils/NotifyUtils')

export default {
  name: 'DatabaseConfiguration',
  components: { DatabaseEngineMaterializedMysql, DatabaseEngineMysql, DatabaseEngineLazy },
  props: {
    engine: {
      type: String,
      default: null
    },
    server: {
      type: String,
      default: null
    }
  },
  created() {
    this.form.engine = this.engine
  },
  data() {
    return {
      form: {
        labelWidth: '120px',
        name: null,
        engine: null,
        property: null,
        validate: false,
        validateDatabase: false,
        validateStatus: false
      }
    }
  },
  methods: {
    handlerDatabaseEngineConfiguration(event) {
      this.form.property = event
      this.handlerValidate()
    },
    handlerValidate() {
      if (StringUtils.isNotEmpty(this.form.name)) {
        this.form.validateStatus = true
        // Validate database from server
        getDatabase(this.server, this.form.name).then(response => {
          if (response.status) {
            if (response.columns.length === 0) {
              if (this.form.property.validate) {
                this.form.validate = true
              } else {
                this.form.validate = false
              }
              this.form.validateDatabase = true
            } else {
              this.form.validate = false
              this.form.validateDatabase = false
            }
          } else {
            NotifyUtils.success(this.$t('common.error'), response.message)
            this.form.validate = false
            this.form.validateDatabase = true
          }
          this.form.validateStatus = false
        })
      } else {
        this.form.validate = false
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.$emit('change', this.form)
      }
    }
  }
}
</script>

<style>
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
