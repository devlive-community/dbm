<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.column'), this.$t('common.preview')])"
      :visible.sync="visible"
      :width="'60%'"
      :before-close="closeDialog">
    <el-skeleton v-if="dataLoad" :rows="6" animated/>
    <div v-else>
      <el-empty v-if="element.columns.length <= 0"></el-empty>
      <table-detail v-else :columns="element.columns" :headers="element.headers"
                    :loading="element.columns.length > 0"></table-detail>
    </div>
  </el-dialog>
</template>
<script>
import { previewColumn } from '../../../../services/ColumnService'
import TableDetail from '../../../../components/Table'

export default {
  name: 'PreviewColumn',
  components: { TableDetail },
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
    this._initialize()
  },
  data() {
    return {
      dataLoad: false,
      element: {
        headers: [],
        columns: []
      }
    }
  },
  methods: {
    _initialize() {
      this.dataLoad = true
      previewColumn(this.configure).then(response => {
        if (response.status) {
          this.element.headers = response.headers
          this.element.columns = response.columns
        } else {
          this.$notify.error({
            title: this.$t('common.error'),
            message: response.message
          })
        }
        this.dataLoad = false
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  },
  watch: {}
}
</script>
