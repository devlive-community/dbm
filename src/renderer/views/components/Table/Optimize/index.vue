<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.optimize'), this.$t('common.table')])"
      :visible.sync="visible"
      :width="'60%'"
      :before-close="closeDialog">
    <el-form size="mini">
      <el-form-item>
        <el-alert type="warning" show-icon :closable="false">
          <div slot="title">
            <el-tag type="danger" size="mini">{{ $t('common.no_callback') }}</el-tag>
            <p>{{ $t('alter.truncate_table') }}</p>
          </div>
        </el-alert>
      </el-form-item>
      <el-form-item :label="$t('common.partition')">
        <el-select v-model="form.partition" v-loading="partitionsLoading" :disabled="partitionsLoading"
                   :placeholder="$t('common.partition')">
          <el-option v-for="partition in partitions" :label="form.type ? partition.name : partition.partition"
                     :value="form.type ? partition.name : partition.partition">
            <span>{{ form.type ? partition.name : partition.partition }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common.type')">
        <el-switch
            v-model="form.type"
            :active-text="this.stringFormat('{0} {1}', [$t('common.partition'), 'ID'])"
            :inactive-text="$t('common.partition')">
        </el-switch>
      </el-form-item>
      <el-form-item :label="$t('common.final')">
        <el-switch
            v-model="form.final"
            :active-text="$t('common.yes')"
            :inactive-text="$t('common.no')">
        </el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="submitLoading" :disabled="this.isEmpty(form.partition)" type="primary" size="mini"
                 @click="handlerTable">
        {{ this.$t('common.ok') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getPartitions, optimizeTable } from '../../../../services/Table'

const NotifyUtils = require('../../../../utils/NotifyUtils')

export default {
  name: 'TableOptimize',
  components: {},
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
    this.handlerLoadPartitions()
  },
  data() {
    return {
      form: {
        partition: null,
        type: false,
        final: false
      },
      partitions: [],
      partitionsLoading: false,
      submitLoading: false
    }
  },
  methods: {
    handlerTable() {
      this.submitLoading = true
      optimizeTable(this.configure.server, this.configure.database, this.configure.table, this.form.type, this.form.final, this.form.partition).then(response => {
        if (!response.status) {
          NotifyUtils.error(this.$t('common.error'), response.message)
        } else {
          NotifyUtils.success(this.$t('common.success'), response.message)
          this.closeDialog()
        }
        this.submitLoading = false
      })
    },
    handlerLoadPartitions() {
      this.partitionsLoading = true
      getPartitions(this.configure.server, this.configure.database, this.configure.table).then(response => {
        if (!response.status) {
          NotifyUtils.error(this.$t('common.error'), response.message)
        } else {
          this.partitions = response.columns
        }
        this.partitionsLoading = false
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  },
  watch: {}
}
</script>
