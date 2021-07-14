<template>
  <el-dialog
    :title="stringFormat('{0} {1}', [this.$t('common.add'), this.$t('common.database')])" 
    :visible.sync="bodyLoading"
    @close="closeDialog">
    <el-form :model="form" label-width="120px" size="mini">
      <el-form-item :label="this.$t('common.database')">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-button type="primary" size="mini" @click="handlerAddDatabase">{{ this.$t('common.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { stringFormat } from '@/utils/Utils'
import { addDataBase } from '@/services/DataBase'

export default {
  name: 'AddDatabase',
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
  created() {
  },
  data() {
    return {
      bodyLoading: false,
      remoteServer: null,
      form: {
        name: ''
      }
    }
  },
  methods: {
    async handlerAddDatabase() {
      if (this.remoteServer === null) {
        this.$notify.error({
          title: 'Error',
          message: 'Remote Server must null!'
        })
        return
      }
      const response = await addDataBase(this.remoteServer, this.form.name)
      if (response.status) {
        this.$notify.success({
          title: this.$t('common.success'),
          message: stringFormat('Create Database <{0}> On Server <{1}> successful!', [this.form.name, this.remoteServer])
        })
        this.closeDialog()
      } else {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      }
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
