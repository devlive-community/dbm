<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.delete'), this.$t('common.column')])"
      :visible.sync="bodyLoading"
      :width="'80%'"
      @close="closeDialog">
    <em>We don't recommend that you delete the column
      <el-tag size="mini" type="info">{{ configure.column }}</el-tag>
      ? This operation produces the following?</em>
    <ol>
      <li>
        <el-tag size="mini" type="danger">No rollback</el-tag>
        The metadata will be removed from the Clickhouse metadata
      </li>
      <li>
        <el-tag size="mini" type="danger">No rollback</el-tag>
        All data files generated in this column will be removed from the relevant Clickhouse server file system
      </li>
      <li>If you want to confirm the deletion, enter the table name in the
        <el-input v-model="inputDeleteValue" size="mini"></el-input>
        and click the delete button below
      </li>
    </ol>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="bodyLoading = false">{{ this.$t('common.cancel') }}</el-button>
      <el-button size="mini" type="danger" @click="handlerDelete">{{ this.$t('common.delete') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deleteColumn } from '../../../../services/ColumnService'

export default {
  name: 'DeleteColumn',
  props: {
    loading: {
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
    return {
      bodyLoading: false,
      inputDeleteValue: null
    }
  },
  methods: {
    handlerDelete() {
      if (this.configure.column !== this.inputDeleteValue) {
        this.$notify.error({
          title: 'Error',
          message: this.stringFormat('The column <{0}> to be deleted is inconsistent with the target <{1}>', [this.inputDeleteValue, this.configure.column])
        })
        return
      }
      deleteColumn(this.configure).then(response => {
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
        }
      })
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.bodyLoading = this.loading
      }
    }
  }
}
</script>
