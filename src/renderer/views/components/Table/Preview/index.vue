<template>
  <el-dialog :title="this.$t('common.preview')" :visible.sync="element.loading" @close="closeDialog" :width="'85%'">
    <el-skeleton v-if="element.remoteLoading" :rows="6" animated />
    <div v-else>
      <el-empty v-if="element.columns.length <= 0 && !element.remoteLoading"></el-empty>
      <table-detail v-else :columns="element.columns" :headers="element.headers" :loading="element.columns.length > 0"></table-detail>
    </div>
  </el-dialog>
</template>
<script>
import TableDetail from '../../../../components/Table'

const { getTablePreview } = require('../../../../services/Table')

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    configuration: {
      type: Object,
      default: {}
    }
  },
  components: { TableDetail },
  data() {
    return {
      element: {
        loading: false,
        remoteLoading: false,
        columns: [],
        headers: []
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.element.loading = this.loading
        if (this.element.loading) {
          this.element.remoteLoading = true
          getTablePreview(this.configuration.server, this.configuration.database, this.configuration.table)
            .then(response => {
              if (response.status) {
                this.element.headers = response.headers
                this.element.columns = response.columns
              } else {
                this.$notify.error({
                  title: this.$t('common.error'),
                  message: response.message
                })
              }
              this.element.remoteLoading = false
            })
        }
      }
    }
  }
}
</script>
