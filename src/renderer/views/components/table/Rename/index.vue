<template>
  <el-dialog :title="this.stringFormat('{0}{1}', [this.$t('common.rename'), this.$t('common.table')])"
             :visible.sync="element.loading" @close="closeDialog">
    <el-empty v-if="this.isEmpty(configuration.table) && !element.remoteLoading"></el-empty>
    <el-form v-else label-width="150px" size="mini">
      <el-form-item
          :label="this.stringFormat('{0}{1}{2}', [this.$t('common.table'), this.$t('common.source'), this.$t('common.name')])">
        <el-input :disabled="true" v-model="configuration.table"></el-input>
      </el-form-item>
      <el-form-item
          :label="this.stringFormat('{0}{1}{2}', [this.$t('common.table'), this.$t('common.source'), this.$t('common.name')])">
        <el-input v-model="element.value"></el-input>
      </el-form-item>
      <el-form-item
          :label="this.stringFormat('{0}{1}{2}', [this.$t('common.table'), this.$t('common.source'), this.$t('common.name')])">
        <codemirror :disabled="true" v-model="element.code"></codemirror>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" style="visibility:hidden"></el-button>
      <el-button type="primary" style="float: right;" size="mini"
                 @click="handlerRenameTable">{{ this.$t('common.rename') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>

import { renameTable } from '../../../../services/Table'

export default {
  name: 'TableRename',
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
  computed: {
    getValue() {
      return this.element.value
    }
  },
  data() {
    return {
      element: {
        loading: false,
        value: '',
        code: ''
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    handlerRenameTable() {
      renameTable(this.configuration.server, this.element.code)
        .then(response => {
          if (response.status) {
            this.$notify.success({
              title: this.$t('common.success'),
              message: this.stringFormat('{0} {1} {2}', [this.$t('common.rename'), this.$t('common.table'), this.$t('common.success')])
            })
            this.closeDialog()
          } else {
            this.$notify.error({
              title: this.$t('common.error'),
              message: response.message
            })
          }
        })
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.element.loading = this.loading
      }
    },
    getValue(newValue) {
      this.element.code = this.sqlFormatter(this.stringFormat('RENAME TABLE {0}.{1} TO {2}.{3}',
        [this.configuration.database, this.configuration.table, this.configuration.database, newValue]))
    }
  }
}
</script>
