<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.table')])"
      :visible.sync="visible"
      :before-close="closeDialog"
      :width="'85%'">
    <el-steps :active="body.step" process-status="process" finish-status="success" simple>
      <el-step :title="this.stringFormat('{0} {1}', [this.$t('common.table'), this.$t('common.type')])"/>
      <el-step :title="this.$t('common.configuration')"/>
      <el-step :title="this.stringFormat('{0} {1}', [this.$t('common.table'), this.$t('common.preview')])"/>
    </el-steps>
    <el-row v-if="body.step === 1" v-for="engineType in this.TableEngine.ENGINES" :gutter="20">
      <div>
        <el-divider content-position="left">
          {{ engineType.name }}
          <el-tooltip placement="top">
            <div slot="content">{{ engineType.description }}</div>
            <el-button size="mini" circle type="text">
              <i class="fa fa-question-circle"></i>
            </el-button>
          </el-tooltip>
        </el-divider>
        <el-col v-for="engine in engineType.engines" :span="6" align="middle">
          <el-radio v-model="form.type" :label="engine.name" border style="margin-top: 15px;">{{ engine.name }}
          </el-radio>
          <el-tooltip placement="top">
            <div slot="content">{{ engine.description }}</div>
            <el-button size="mini" type="text" style="margin-left: -25px;">
              <i class="fa fa-question-circle"></i>
            </el-button>
          </el-tooltip>
        </el-col>
      </div>
    </el-row>
    <el-row v-if="body.step === 2" :gutter="20">
      <table-configuration :engine="form.type" @change="handlerGetConfiguration($event)"/>
    </el-row>
    <el-row v-if="body.step === 3" :gutter="20">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="16">
          <el-form size="mini">
            <el-form-item :label-width="form.configuration.labelWidth">
              <template slot="label">
                {{ stringFormat('{0}{1}', [this.$t('common.table'), this.$t('common.name')]) }}
              </template>
              <el-tag size="mini">{{ form.configuration.name }}</el-tag>
            </el-form-item>
            <el-form-item :label-width="form.configuration.labelWidth"
                          :label="this.stringFormat('{0}{1}', [this.$t('common.table'), this.$t('common.engine')])">
              <el-tag size="mini">{{ form.configuration.engine }}</el-tag>
            </el-form-item>
            <el-form-item :label-width="form.configuration.labelWidth">
              <template slot="label">
                {{ stringFormat('{0}{1}', [this.$t('common.table'), this.$t('common.ddl')]) }}
              </template>
              <codemirror v-model="body.ddl"/>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
      </el-row>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="body.previous" plain type="primary" size="mini" @click="handlerPrevious"> {{
          this.$t('common.previous')
        }}
      </el-button>
      <el-button v-if="body.next" :disabled="body.disabled" plain type="primary" size="mini" @click="handlerNext"> {{
          this.$t('common.next')
        }}
      </el-button>
      <el-button v-if="body.complete" type="primary" size="mini" :loading="body.create" @click="handlerComplete"> {{
          this.$t('common.save')
        }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import TableConfiguration from '../Configuration'
import { createTable } from '../../../../services/Table'
import { buildDdl } from '../../../../utils/ConvertUtils'

export default {
  name: 'CreateTable',
  components: {
    TableConfiguration
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    configure: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.form.configure = this.configure
  },
  data() {
    return {
      body: {
        loading: false,
        step: 1,
        next: true,
        previous: false,
        complete: false,
        disabled: false,
        ddl: '',
        create: false
      },
      form: {
        type: 'Log',
        configure: {},
        configuration: {}
      }
    }
  },
  methods: {
    handlerNext() {
      this.body.step++
      this.body.previous = true
      if (this.body.step === 3) {
        this.body.next = false
        this.body.complete = true
        this.body.ddl = buildDdl(this.form)
      }
      if (this.form.configuration && !this.form.configuration.validate) {
        this.body.disabled = true
      } else {
        this.body.disabled = false
      }
    },
    handlerPrevious() {
      this.body.step--
      if (this.body.step < 3) {
        this.body.next = true
        this.body.complete = false
      }
      if (this.body.step === 1) {
        this.body.previous = false
        this.body.disabled = false
      }
    },
    handlerGetConfiguration(event) {
      this.form.configuration = event
      if (this.form.configuration && !this.form.configuration.validate) {
        this.body.disabled = true
      } else {
        this.body.disabled = false
      }
    },
    handlerComplete() {
      this.body.create = true
      createTable(this.configure.server, this.body.ddl).then(response => {
        if (response.status) {
          this.$notify.success({
            title: this.$t('common.success'),
            message: response.message
          })
          this.closeDialog()
        } else {
          this.$notify.error({
            title: this.$t('common.error'),
            message: response.message
          })
        }
        this.body.create = false
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  },
  watch: {}
}
</script>
