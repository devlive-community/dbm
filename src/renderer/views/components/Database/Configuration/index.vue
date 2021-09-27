<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="16">
        <el-form ref="form" :model="form" :label-width="form.labelWidth" center size="mini">
          <el-divider content-position="left">{{ this.$t('common.basic') }}</el-divider>
          <el-alert v-if="!form.validate"
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

const StringUtils = require('../../../../utils/StringUtils')
const NotifyUtils = require('../../../../utils/NotifyUtils')

export default {
  name: 'DatabaseConfiguration',
  components: {},
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
        validateStatus: false
      }
    }
  },
  methods: {
    handlerTableEngineConfiguration(event) {
      this.form.property = event
    },
    handlerValidate() {
      if (StringUtils.isNotEmpty(this.form.name)) {
        this.form.validateStatus = true
        // Validate database from server
        getDatabase(this.server, this.form.name).then(response => {
          if (response.status) {
            if (response.columns.length === 0) {
              this.form.validate = true
            } else {
              this.form.validate = false
            }
          } else {
            NotifyUtils.success(this.$t('common.error'), response.message)
            this.form.validate = false
          }
          this.form.validateStatus = false
        })
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
