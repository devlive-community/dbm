<template>
  <el-dialog
    :title="stringFormat('{0}{1}', [this.$t('common.query'), this.$t('common.history')])" 
    :visible.sync="bodyLoading"
    :width="width"
    @close="closeDialog">
    <el-table v-loading.body="tableBodyLoading" v-if="data.columns" style="width: 100%" :data="data.columns.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
      <el-table-column>
        <template slot="header">
          <el-tooltip class="item" effect="dark" :content="stringFormat('{0}{1}{2}', [$t('common.clear'), $t('common.query'), $t('common.history')])" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handlerClearHistory()"></el-button>
          </el-tooltip>
          <el-pagination
            v-if="data.columns.length > 0"
            layout="total, sizes, prev, pager, next"
            :total="data.columns.length"
            :page-sizes="[10, 20, 30, 50]"
            @current-change="handlerChangePage"
            @size-change="handleSizeChange"
            background />
        </template>
        <template slot-scope="scope">
          <el-card :class="'box-card ' + (scope.row.status ? 'success' : 'error')">
            <div slot="header" class="clearfix">
              <el-button type="text" disabled>
                <i
                  :class="'fa fa-' + (scope.row.status ? 'check-circle' : 'exclamation-circle')"
                  :style="'color: ' + (scope.row.status ? '#67C23A' : '#F56C6C') + ';'">
                </i>
                <span>{{ scope.row.startTime }}</span>
              </el-button>
              <el-button type="text" style="float: right;" v-clipboard:copy="scope.row.query" v-clipboard:success="onCopy" v-clipboard:error="onError">
                <i class="fa fa-copy"></i>
              </el-button>
            </div>
            <codemirror v-model="scope.row.query"></codemirror>
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
import { stringFormat } from '@/utils/Utils'

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
      data: [],
      pageSize: 10,
      currentPage: 1
    }
  },
  methods: {
    _initialize() {
      this.data = getQueryHistory()
    },
    handlerClearHistory() {
      clearQueryHistory()
      this.$notify({
        title: this.$t('common.notification'),
        type: 'success',
        message: stringFormat('{0} {1} {2} {3}!', [this.$t('common.clear'), this.$t('common.query'), this.$t('common.history'), this.$t('common.success')])
      })
      this._initialize()
    },
    handlerChangePage(currentPage) {
      this.currentPage = currentPage
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
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
  /deep/ .CodeMirror {
    border: 1px solid #eee;
    height: 100px;
  }
  .success {
    background-color: #557844;
  }
  .error {
    background-color: #bd8c8c;
  }
</style>
