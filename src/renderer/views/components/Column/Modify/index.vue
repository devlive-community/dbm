<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.edit'), this.$t('common.column')])"
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
          <el-tag size="mini">{{ tableColumnForm.database }}</el-tag>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.table'), this.$t('common.name')])">
          <el-tag size="mini">{{ tableColumnForm.table }}</el-tag>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.column'), this.$t('common.name')])">
          <el-tag size="mini">{{ tableColumnForm.name }}</el-tag>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.column'), this.$t('common.type')])">
          <el-select :disabled="tableSupportAlter" v-model="tableColumnForm.type"
                     :placeholder="stringFormat('{0}{1}', [$t('common.column'), $t('common.type')])"
                     @change="handlerValidate">
            <el-option v-for="item in ColumnTypeUtils.TYPES" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="this.$t('tooltip.is_empty')">
          <el-switch :disabled="tableSupportAlter" v-model="tableColumnForm.empty" :active-text="$t('common.yes')"
                     :inactive-text="$t('common.no')" @change="handlerValidate"/>
        </el-form-item>
        <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.column'), this.$t('common.comment')])">
          <el-input :disabled="tableSupportAlter" type="textarea" v-model="tableColumnForm.comment"
                    @change="handlerValidate"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button :disabled="tableSupportAlter || !changeValidate" type="primary" size="mini" @click="handlerModify">
        {{ this.$t('common.edit') }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getTableColumnInfo, getTableInfo } from '../../../../services/Table'
import { modifyColumn } from '../../../../services/ColumnService'

const TableEngineUtils = require('../../../../utils/TableEngineUtils')
const StringUtils = require('../../../../utils/StringUtils')

export default {
  name: 'ModifyColumn',
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
        name: null,
        type: null,
        empty: false,
        comment: null
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
      if (this.tableColumnForm.comment !== this.tableColumnInfo.comment) {
        this.changeValidate = true
      } else if (StringUtils.format('"{0}"', [this.tableColumnForm.empty]) !==
          StringUtils.format('"{0}"', [this.tableColumnInfo.empty])) {
        this.changeValidate = true
      } else if (this.tableColumnForm.name !== this.tableColumnInfo.name) {
        this.changeValidate = true
      } else if (this.tableColumnForm.type !== this.tableColumnInfo.type) {
        this.changeValidate = true
      } else if (this.tableColumnForm.comment !== this.tableColumnInfo.comment) {
        this.changeValidate = true
      } else {
        this.changeValidate = false
      }
    },
    handlerModify() {
      modifyColumn(this.configure, this.tableColumnForm).then(response => {
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
