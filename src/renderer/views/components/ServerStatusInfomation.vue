<template>
  <table-detail :columns="columns" :headers="headers" :loading="tableBodyLoading"></table-detail>
</template>

<script>
import TableDetail from '@/components/Table'
import { runExecute } from '@/api/query'
import { getDataSource, getServerURL } from '@/utils/Utils'

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
    _initialize() {
      const dataSource = getDataSource(this.server)
      const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
      const sql = 'SELECT * FROM system.build_options'
      runExecute(remoteServer, sql).then(response => {
        if (response.status === 200) {
          this.headers = response.data.meta
          this.columns = response.data.data
        }
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
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
