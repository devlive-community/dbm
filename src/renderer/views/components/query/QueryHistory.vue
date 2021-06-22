<template>
  <el-dialog
    title="Query History" 
    :visible.sync="bodyLoading"
    :width="width"
    @close="closeDialog">
    <el-row style="margin-top: -10px;">
      <el-tooltip class="item" effect="dark" content="Clear Query History" placement="top">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handlerClearHistory()"></el-button>
      </el-tooltip>
    </el-row>
    <table-detail :columns="data.columns" :headers="data.headers" :loading="tableBodyLoading"></table-detail>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TableDetail from '@/components/Table'
import { getQueryHistory, clearQueryHistory } from '@/services/Query'

export default {
  name: 'QueryHistory',
  components: {
    TableDetail
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  created() {
    this._initialize()
  },
  data() {
    return {
      bodyLoading: false,
      tableBodyLoading: false,
      data: []
    }
  },
  methods: {
    _initialize() {
      this.data = getQueryHistory()
    },
    handlerClearHistory() {
      clearQueryHistory()
      this.$notify({
        title: 'Notification',
        type: 'success',
        message: 'Clear Query History successful!'
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
        this.bodyLoading = this.loading
      }
    },
    width: {
      deep: true
    }
  }
}
</script>
