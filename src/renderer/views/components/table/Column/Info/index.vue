<template>
  <el-dialog :title="this.$t('common.column')" :visible.sync="element.loading" @close="closeDialog">
    <el-skeleton v-if="element.remoteLoading" :rows="6" animated/>
    <div v-else>
      <el-empty v-if="element.columns.length <= 0 && !element.remoteLoading"></el-empty>
      <el-descriptions v-else :column="1">
        <el-descriptions-item v-for="key in Object.keys(element.columns[0])" :label="key">{{
            element.columns[0][key]
          }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
<script>
import { getTableColumnInfo } from '../../../../../services/Table'

export default {
  name: 'TableColumn',
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
  data() {
    return {
      element: {
        loading: false,
        remoteLoading: false,
        columns: []
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
          getTableColumnInfo(this.configuration.server, this.configuration.database, this.configuration.table, this.configuration.column)
            .then(response => {
              if (response.status) {
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
