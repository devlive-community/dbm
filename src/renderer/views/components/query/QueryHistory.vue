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

    <el-table v-loading.body="tableBodyLoading"
      style="width: 100%"
      :data="data.columns">
      <el-table-column>
        <template slot-scope="scope">
          <el-card :class="'box-card ' + (scope.row.status ? 'success' : 'error')">
            <div slot="header" class="clearfix">
              <i
                :class="'fa fa-' + (scope.row.status ? 'check-circle' : 'exclamation-circle')"
                :style="'color: ' + (scope.row.status ? '#67C23A' : '#F56C6C') + ';'">
              </i>
              <span>{{ scope.row.startTime }}</span>
            </div>
            {{ scope.row.query }}
            <p v-if="!scope.row.status"> {{ scope.row.message }}</p>
          </el-card>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
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
      this._initialize()
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
        this._initialize()
      }
    },
    width: {
      deep: true
    }
  }
}
</script>

<style scoped>
  /deep/ .el-card {
    color: #FFFFFF;
  }
  /deep/ .el-card__header {
    padding: 5px 15px;
    border-bottom: 0px solid #ebeef5;
  }
  /deep/ .el-card__body {
    padding: 5px 15px;
  }
  .success {
    background-color: #557844;
  }
  .error {
    background-color: #bd8c8c;
  }
</style>
