<template>
  <el-dialog
      :title="this.stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.column')])"
      :visible.sync="bodyLoading"
      :width="'80%'"
      @close="closeDialog">
    <el-row :gutter="20">
      <el-form :model="form" label-width="20px" size="mini">
        <el-form-item v-for="(column) in form.columns" :key="column.key">
          <el-col :span="6">
            <el-input v-model="column.name"
                      :placeholder="stringFormat('{0}{1}', [$t('common.column'), $t('common.name')])"/>
          </el-col>
          <el-col :span="6">
            <el-select v-model="column.type"
                       :placeholder="stringFormat('{0}{1}', [$t('common.column'), $t('common.type')])">
              <el-option v-for="item in ColumnTypeUtils.TYPES" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="column.comment"
                      :placeholder="stringFormat('{0}{1}', [$t('common.column'), $t('common.comment')])"/>
          </el-col>
          <el-col :span="6">
            <el-tooltip :content="$t('tooltip.is_empty')" placement="top">
              <el-switch v-model="column.empty" :active-text="$t('common.yes')" :inactive-text="$t('common.no')"/>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button v-if="form.columns < 0" @click="handlerAddColumn">
            {{ this.stringFormat('{0}{1}', [this.$t('common.add'), this.$t('common.column')]) }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-button type="primary" size="mini" @click="handlerGenerate">{{ this.$t('common.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addColumns } from '../../../../services/ColumnService'

export default {
  name: 'AddColumn',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    configure: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.handlerAddColumn()
  },
  data() {
    return {
      bodyLoading: false,
      form: {
        columns: []
      }
    }
  },
  methods: {
    handlerAddColumn() {
      this.form.columns.push({
        name: '',
        type: 'String',
        comment: '',
        empty: false,
        key: Date.now()
      })
    },
    handlerGenerate() {
      addColumns(this.configure, this.form.columns[0]).then(response => {
        if (response.status) {
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
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.bodyLoading = this.loading
      }
    }
  }
}
</script>
