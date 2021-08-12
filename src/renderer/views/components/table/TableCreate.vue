<template>
  <el-dialog
      v-if="body.loading"
      :title="stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.table')])"
      :visible.sync="body.loading" @close="closeDialog" :width="'85%'">
    <el-steps :active="body.step" process-status="process" finish-status="success" simple>
      <el-step :title="stringFormat('{0} {1}', [this.$t('common.table'), this.$t('common.type')])"/>
      <el-step :title="stringFormat('{0} {1}', [this.$t('common.table'), this.$t('common.configuration')])"/>
      <el-step :title="stringFormat('{0} {1}', [this.$t('common.table'), this.$t('common.preview')])"/>
    </el-steps>
    <el-row v-if="body.step === 1" v-for="engineType in TableEngine.ENGINES" :gutter="20">
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
            <div slot="content">{{ engineType.description }}</div>
            <el-button size="mini" type="text" style="margin-left: -25px;">
              <i class="fa fa-question-circle"></i>
            </el-button>
          </el-tooltip>
        </el-col>
      </div>
    </el-row>
    <el-row v-if="body.step === 2" :gutter="20">
      <table-configuration :type="form.type" @change="handlerGetConfiguration($event)"/>
    </el-row>
    <el-row v-if="body.step === 3" :gutter="20">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content"></div>
        </el-col>
        <el-col :span="16">
          <el-form size="mini">
            <el-form-item :label-width="form.table.labelWidth">
              <template slot="label">
                {{ stringFormat('{0}{1}', [this.$t('common.table'), this.$t('common.name')]) }}
              </template>
              <el-tag size="mini">{{ form.table.name }}</el-tag>
            </el-form-item>
            <el-form-item :label-width="form.table.labelWidth">
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
      <el-button @click="closeDialog" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-button v-if="body.previous" plain type="primary" size="mini" @click="handlerPrevious"> {{
          this.$t('common.previous')
        }}
      </el-button>
      <el-button v-if="body.next" plain type="primary" size="mini" @click="handlerNext"> {{
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
import TableConfiguration from './TableConfiguration'
import { buildDdl } from '@/utils/ConvertUtils'
import { createTable } from '@/services/Table'

export default {
  name: 'CreateTable',
  components: {
    TableConfiguration
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    server: {
      type: String,
      default: ''
    },
    database: {
      type: String,
      default: ''
    }
  },
  created() {
  },
  data() {
    return {
      body: {
        loading: false,
        step: 1,
        next: true,
        previous: false,
        complete: false,
        ddl: '',
        create: false
      },
      form: {
        type: 'Log',
        database: null,
        table: null
      },
      remoteServer: null
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
    },
    handlerPrevious() {
      this.body.step--
      if (this.body.step < 3) {
        this.body.next = true
        this.body.complete = false
      }
      if (this.body.step === 1) {
        this.body.previous = false
      }
    },
    handlerGetConfiguration(event) {
      this.form.table = event
    },
    handlerComplete() {
      this.body.create = true
      createTable(this.remoteServer, this.body.ddl).then(response => {
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
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.body.loading = this.loading
      }
    },
    server: {
      deep: true,
      handler() {
        this.remoteServer = this.server
      }
    },
    database: {
      deep: true,
      handler() {
        this.form.database = this.database
      }
    }
  }
}
</script>
