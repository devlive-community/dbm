<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.clean'), this.$t('common.table')])"
      :visible.sync="visible"
      :width="'80%'"
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
        <el-select v-model="partition" v-loading="partitionsLoading" :disabled="partitionsLoading"
                   :placeholder="$t('common.partition')">
          <el-option v-for="partition in partitions" :label="partition.partition"
                     :value="partition.partition">
            <span style="float: left">{{ partition.partition }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ partition.name }}</span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="partitions.length <= 0" type="primary" size="mini" @click="handlerTable">
        {{ this.$t('common.ok') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { cleanTableByPartition, getPartitions } from '../../../../services/Table'

const NotifyUtils = require('../../../../utils/NotifyUtils')

export default {
  name: 'TableClean',
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
      partition: null,
      partitions: [],
      partitionsLoading: false
    }
  },
  methods: {
    handlerTable() {
      cleanTableByPartition(this.configure.server, this.configure.database, this.configure.table, this.partition).then(response => {
        if (!response.status) {
          NotifyUtils.error(this.$t('common.error'), response.message)
        } else {
          NotifyUtils.success(this.$t('common.success'), response.message)
        }
        this.handlerLoadPartitions()
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
