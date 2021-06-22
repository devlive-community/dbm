<template>
  <el-dialog
    title="Query History" 
    :visible.sync="bodyLoading"
    @close="closeDialog">
    <table-detail :columns="data.columns" :headers="data.headers" :loading="tableBodyLoading"></table-detail>
  </el-dialog>
</template>

<script>
import TableDetail from '@/components/Table'
import { getQueryHistory } from '@/services/Query'

export default {
  name: 'QueryHistory',
  components: {
    TableDetail
  },
  props: {
    loading: {
      type: Boolean,
      default: false
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
