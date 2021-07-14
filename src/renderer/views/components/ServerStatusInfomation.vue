<template>
  <table-detail :columns="columns" :headers="headers" :loading="tableBodyLoading"></table-detail>
</template>

<script>
import TableDetail from '@/components/Table'
import { getInfo } from '@/services/Server'

export default {
  name: 'ServerStatusInfomation',
  components: {
    TableDetail
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    server: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this._initialize()
  },
  data() {
    return {
      tableBodyLoading: false,
      remoteServer: null,
      columns: [],
      headers: []
    }
  },
  methods: {
    async _initialize() {
      const response = await getInfo(this.server)
      if (response.status) {
        this.headers = response.headers
        this.columns = response.columns
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
    },
    closeDialog() {
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.tableBodyLoading = this.loading
      }
    },
    server: {
      deep: true,
      handler() {
        this.remoteServer = this.server
      }
    }
  }
}
</script>
