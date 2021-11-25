<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.truncate'), this.$t('common.table')])"
      :visible.sync="visible"
      :width="'80%'"
      :before-close="closeDialog">
    <el-alert type="warning" show-icon :closable="false">
      <div slot="title">
        <el-tag type="danger" size="mini">{{ $t('common.no_callback') }}</el-tag>
        <p>{{ $t('alter.truncate_table') }}</p>
      </div>
    </el-alert>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="handlerTruncateTable">
        {{ this.$t('common.ok') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { truncateTable } from '../../../../services/Table'

const NotifyUtils = require('../../../../utils/NotifyUtils')

export default {
  name: 'TableTruncate',
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
  },
  data() {
    return {}
  },
  methods: {
    handlerTruncateTable() {
      truncateTable(this.configure.server, this.configure.database, this.configure.table).then(response => {
        if (!response.status) {
          NotifyUtils.error(this.$t('common.error'), response.message)
        } else {
          NotifyUtils.success(this.$t('common.success'), response.message)
          this.closeDialog()
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
