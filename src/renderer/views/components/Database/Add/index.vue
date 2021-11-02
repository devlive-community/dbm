<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.database')])"
      :visible.sync="visible"
      :width="'80%'"
      :before-close="closeDialog">
    <el-steps :active="step" process-status="process" finish-status="success" simple>
      <el-step :title="this.stringFormat('{0} {1}', [this.$t('common.database'), this.$t('common.engine')])"/>
      <el-step :title="this.stringFormat('{0} {1}', [this.$t('common.database'), this.$t('common.configuration')])"/>
    </el-steps>
    <el-row v-if="step === 1" v-for="engineType in this.engines" :gutter="20">
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
        <el-col v-for="engine in engineType.engines" :span="7" align="middle">
          <el-radio v-model="type" :label="engine.name" border style="margin-top: 15px;">{{ engine.name }}
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
    <el-row v-if="step === 2" :gutter="20">
      <database-configuration :engine="type" :server="server" @change="handlerGetValue"></database-configuration>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="previous" plain type="primary" size="mini" @click="handlerPrevious"> {{
          this.$t('common.previous')
        }}
      </el-button>
      <el-button v-if="next" plain type="primary" size="mini" @click="handlerNext"> {{
          this.$t('common.next')
        }}
      </el-button>
      <el-button v-if="complete" :disabled="this.configuration && !this.configuration.validate" type="primary"
                 size="mini" :loading="create" @click="handlerAddDatabase"> {{
          this.$t('common.save')
        }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import DatabaseConfiguration from '../Configuration'
import { addDataBase } from '../../../../services/DatabaseService'

const DatabaseEngineUtils = require('../../../../utils/DatabaseEngineUtils')

export default {
  name: 'AddDatabase',
  components: { DatabaseConfiguration },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    server: {
      type: String,
      default: ''
    }
  },
  created() {
    this.engines = DatabaseEngineUtils.ENGINES
  },
  data() {
    return {
      step: 1,
      next: true,
      previous: false,
      complete: false,
      create: false,
      engines: [],
      type: 'Default',
      configuration: {}
    }
  },
  methods: {
    handlerNext() {
      this.step++
      this.previous = true
      if (this.step === 2) {
        this.next = false
        this.complete = true
      }
    },
    handlerPrevious() {
      this.step--
      if (this.step < 2) {
        this.next = true
        this.complete = false
      }
      if (this.step === 1) {
        this.previous = false
      }
    },
    handlerGetValue(value) {
      this.configuration = value
    },
    handlerAddDatabase() {
      addDataBase(this.server, this.configuration).then(response => {
        if (response.status) {
          this.$notify.success({
            title: this.$t('common.success'),
            message: this.stringFormat('Create Database <{0}> On Server <{1}> successful!', [this.configuration.name, this.server])
          })
          this.closeDialog()
        } else {
          this.$notify.error({
            title: this.$t('common.error'),
            message: response.message
          })
        }
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  },
  watch: {}
}
</script>
