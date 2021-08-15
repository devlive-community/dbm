<template>
  <el-dialog :title="element.title" :visible.sync="elementLoading.body" :width="width" @close="closeDialog">
    <el-form :model="form" size="mini">
      <el-card class="box-card" shadow="never" style="margin-top: -10px;">
        <div slot="header" class="clearfix" style="padding: -1px;">
          <span>{{ this.$t('common.setting_connection') }}</span>
        </div>
        <el-form-item :label="this.$t('common.alias_name')" :label-width="formLabelWidth">
          <el-tooltip placement="top">
            <div slot="content">
              <span v-html="this.$t('view.component.data.source.tooltip.alias_name')"></span>
            </div>
            <el-input
                :placeholder="this.$t('view.component.data.source.placeholder.alias_name')"
                v-model="form.name">
              <i slot="prefix" class="fa fa-tag"></i>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="this.$t('common.protocol')" :label-width="formLabelWidth">
          <el-radio v-model="form.protocol" label="http">HTTP</el-radio>
          <el-radio v-model="form.protocol" label="https" disabled>HTTPS</el-radio>
        </el-form-item>
        <el-form-item :label="this.$t('common.host')" :label-width="formLabelWidth">
          <el-tooltip placement="top">
            <div slot="content">
              <span v-html="this.$t('view.component.data.source.tooltip.host')"></span>
            </div>
            <el-input
                :placeholder="this.$t('view.component.data.source.placeholder.host')"
                v-model="form.host">
              <i slot="prefix" class="fa fa-server"></i>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="this.$t('common.port')" :label-width="formLabelWidth">
          <el-tooltip placement="top">
            <div slot="content">
              <span v-html="this.$t('view.component.data.source.tooltip.port')"></span>
            </div>
            <el-input
                :placeholder="this.$t('view.component.data.source.placeholder.port')"
                v-model="form.port">
              <i slot="prefix" class="fa fa-recycle"></i>
            </el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item :label="this.$t('common.username')" :label-width="formLabelWidth">
          <el-input
              :placeholder="this.$t('view.component.data.source.placeholder.username')"
              v-model="form.username">
            <i slot="prefix" class="fa fa-recycle"></i>
          </el-input>
        </el-form-item>
        <el-form-item :label="this.$t('common.password')" :label-width="formLabelWidth">
          <el-input
              :placeholder="this.$t('view.component.data.source.placeholder.password')"
              v-model="form.password">
            <i slot="prefix" class="fa fa-recycle"></i>
          </el-input>
        </el-form-item>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix" style="padding: -1px;">
          <span>{{ this.$t('common.advanced_connection') }}</span>
          <span><el-tag size="mini">{{ this.$t('common.beta') }}</el-tag></span>
        </div>
        <el-form-item>
          <el-switch v-model="form.delivery"></el-switch>
          <span v-html="this.$t('view.component.data.source.title.warning_drop')"></span>
        </el-form-item>
      </el-card>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" :loading="elementLoading.test" type="success" @click="handlerTest()">
        {{ this.$t('common.test_connection') }}
      </el-button>
      <el-button size="mini" @click="elementLoading.body = false">{{ this.$t('common.cancel') }}</el-button>
      <el-button type="primary" size="mini" @click="handlerProcessor()">{{ this.$t('common.ok') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveDataSource, updateDataSource, getConnection } from '@/services/DataSource'
import { ADD } from '@/utils/Support'
import { isNotEmpty } from '@/utils/StringUtils'

export default {
  name: 'DataSource',
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    data: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: ADD
    },
    unique: {
      type: String,
      default: null
    }
  },
  created() {
  },
  data() {
    return {
      form: {
        name: '',
        host: '',
        port: '',
        username: '',
        password: '',
        delivery: false,
        protocol: 'http'
      },
      formLabelWidth: '100px',
      element: {
        title: null,
        type: null,
        unique: null
      },
      elementLoading: {
        body: false,
        test: false
      }
    }
  },
  methods: {
    async handlerProcessor() {
      let response = null
      if (this.element.type === ADD || !this.element.type) {
        response = await saveDataSource(this.form)
      } else {
        response = await updateDataSource(this.element.unique, this.form)
      }
      if (!response.status) {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      } else {
        this.$notify.success({
          title: this.$t('common.success'),
          message: response.message
        })
        this.closeDialog()
        this.$emit('refresh')
      }
    },
    async handlerTest() {
      this.elementLoading.test = true
      const response = await getConnection(this.form.host, this.form.port, this.form.username, this.form.password)
      if (!response.status) {
        this.$notify.error({
          title: this.$t('common.error'),
          message: this.$t('common.error')
        })
      } else {
        this.$notify.success({
          title: this.$t('common.success'),
          message: this.$t('common.success')
        })
      }
      this.elementLoading.test = false
    },
    closeDialog() {
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.elementLoading.body = this.loading
      }
    },
    width: {
      deep: true
    },
    title: {
      deep: true,
      handler() {
        this.element.title = this.title
      }
    },
    data: {
      deep: true,
      handler() {
        if (isNotEmpty(this.data)) {
          this.form = this.data
        }
      }
    },
    type: {
      deep: true,
      handler() {
        this.element.type = this.type
      }
    },
    unique: {
      deep: true,
      handler() {
        this.element.unique = this.unique
      }
    }
  }
}
</script>

<style scoped>
/deep/ .el-card__header {
  padding: 5px 15px;
}
</style>
