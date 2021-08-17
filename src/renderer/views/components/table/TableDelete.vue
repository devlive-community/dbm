<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.delete'), this.$t('common.table')])"
      :visible.sync="bodyLoading"
      @close="closeDialog">
    <em>We don't recommend that you delete the data table
      <el-tag type="info" size="mini">{{ deleteTable }}</el-tag>
      ? This operation produces the following?</em>
    <ol>
      <li>
        <el-tag type="danger" size="mini">No rollback</el-tag>
        The metadata will be removed from the Clickhouse metadata
      </li>
      <li>
        <el-tag type="danger" size="mini">No rollback</el-tag>
        All data files generated in this table will be removed from the relevant Clickhouse server file system
      </li>
      <li>If you want to confirm the deletion, enter the table name in the
        <el-input v-model="inputDeleteTable" size="mini"></el-input>
        and click the delete button below
      </li>
    </ol>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-button type="danger" size="mini" @click="handlerDeleteTable" :loading="buttonLoading">
        {{ this.$t('common.delete') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deleteTable } from '@/services/Table'

export default {
  name: 'DeleteTable',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    server: {
      type: String,
      default: ''
    },
    table: {
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
      deleteTable: null,
      inputDeleteTable: null,
      remoteDatabase: null,
      buttonLoading: false
    }
  },
  methods: {
    async handlerDeleteTable() {
      this.buttonLoading = true
      if (this.remoteServer === null) {
        this.$notify.error({
          title: 'Error',
          message: 'Remote Server must null!'
        })
        this.buttonLoading = false
        return
      }
      if (this.deleteTable !== this.inputDeleteTable) {
        this.$notify.error({
          title: 'Error',
          message: this.stringFormat('The table <{0}> to be deleted is inconsistent with the target table <{1}>', [this.inputDeleteTable, this.deleteTable])
        })
        this.buttonLoading = false
        return
      }
      const response = await deleteTable(this.remoteServer, this.remoteDatabase, this.inputDeleteTable)
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
      }
      this.buttonLoading = false
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
    table: {
      deep: true,
      handler() {
        this.deleteTable = this.table
      }
    },
    database: {
      deep: true,
      handler() {
        this.remoteDatabase = this.database
      }
    }
  }
}
</script>
