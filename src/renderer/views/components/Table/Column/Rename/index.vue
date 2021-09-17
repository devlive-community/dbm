<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.rename'), this.$t('common.column')])"
      :visible.sync="visible"
      :width="'60%'"
      :before-close="closeDialog">
    <el-alert v-if="tableSupportAlter" :title="this.stringFormat(this.$t('formatter.column'), [tableInfo.engine])"
              type="error"
              :closable="false"/>
    <el-skeleton v-if="tableCheck" :rows="6" animated/>
    <div v-else>
      <el-form :model="tableColumnForm" label-width="130px" size="mini">
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.database'), this.$t('common.name')])">
          <el-tag size="mini">{{ tableColumnInfo.database }}</el-tag>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.table'), this.$t('common.name')])">
          <el-tag size="mini">{{ tableColumnInfo.table }}</el-tag>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.column'), this.$t('common.name')])">
          <el-tag size="mini">{{ tableColumnInfo.name }}</el-tag>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.column'), this.$t('common.name')])">
          <el-input :disabled="tableSupportAlter" v-model="tableColumnForm.name" @change="handlerValidate"/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="tableSupportAlter || !changeValidate" type="primary" size="mini" @click="handlerModify">
        {{ this.$t('common.rename') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getTableColumnInfo, getTableInfo } from '../../../../../services/Table'
import { renameColumn } from '../../../../../services/ColumnService'

const TableEngineUtils = require('../../../../../utils/TableEngineUtils')
// const StringUtils = require('../../../../../utils/StringUtils')

export default {
  name: 'RenameColumn',
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
      tableCheck: false,
      tableSupportAlter: false,
      changeValidate: false,
      tableInfo: {},
      tableColumnInfo: {},
      tableColumnForm: {
        name: null
      }
    }
  },
  methods: {
    _initialize() {
      this.tableCheck = true
      getTableInfo(this.configure.server, this.configure.database, this.configure.table).then(response => {
        if (response.status) {
          this.tableInfo = response.columns[0]
          this.tableSupportAlter = !TableEngineUtils.checkSupportAlter(this.tableInfo.engine)
        }
      })
      getTableColumnInfo(this.configure.server, this.configure.database, this.configure.table, this.configure.column).then(response => {
        if (response.status) {
          this.tableColumnInfo = response.columns[0]
          this.tableColumnForm = JSON.parse(JSON.stringify(this.tableColumnInfo))
          this.handlerValidate()
        }
      })
      this.tableCheck = false
    },
    handlerValidate() {
      if (this.tableColumnForm.name !== this.tableColumnInfo.name) {
        this.changeValidate = true
      } else {
        this.changeValidate = false
      }
    },
    handlerModify() {
      renameColumn(this.configure, this.tableColumnForm.name).then(response => {
        if (response.status) {
          this.$notify.success({
            title: this.$t('common.success'),
            message: response.message
          })
          this.closeDialog()
        } else {
          this.$notify.error({
            title: this.$t('common.error'),
            message: response.message
          })
        }
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  },
  watch: {}
}
</script>
