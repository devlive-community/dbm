<template>
  <el-dialog
    :title="stringFormat('{0} {1}', [this.$t('common.delete'), this.$t('common.database')])" 
    :visible.sync="bodyLoading"
    @close="closeDialog">
    <em>We don't recommend that you delete the database <el-tag type="info" size="mini">{{deleteValue}}</el-tag>? This operation produces the following?</em>
    <ol>
      <li><el-tag type="danger" size="mini">No rollback</el-tag> The metadata will be removed from the Clickhouse metadata</li>
      <li><el-tag type="danger" size="mini">No rollback</el-tag> All data files generated in this table will be removed from the relevant Clickhouse server file system</li>
      <li>If you want to confirm the deletion, enter the table name in the <el-input v-model="inputDeleteValue" size="mini"></el-input> and click the delete button below</li>
    </ol>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-button type="danger" size="mini" @click="handlerDelete" :loading="buttonLoading">{{ this.$t('common.delete') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { stringFormat } from '@/utils/Utils'
import { deleteDatabase } from '@/services/DataBase'

export default {
  name: 'DeleteDatabase',
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
      bodyLoading: false,
      remoteServer: null,
      deleteValue: null,
      inputDeleteValue: null,
      buttonLoading: false,
      form: {
        name: ''
      }
    }
  },
  methods: {
    async handlerDelete() {
      this.buttonLoading = true
      if (this.deleteValue !== this.inputDeleteValue) {
        this.$notify.error({
          title: 'Error',
          message: stringFormat('The table <{0}> to be deleted is inconsistent with the target <{1}>', [this.inputDeleteValue, this.deleteValue])
        })
        this.buttonLoading = false
        return
      }
      const response = await deleteDatabase(this.remoteServer, this.inputDeleteValue)
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
      this.buttonLoading = false
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
        this.deleteValue = this.database
      }
    }
  }
}
</script>
