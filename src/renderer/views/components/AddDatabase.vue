<template>
  <el-dialog
    title="Add Database" 
    :visible.sync="bodyLoading"
    @close="closeDialog">
    <el-form :model="form" label-width="120px" size="mini">
      <el-form-item label="Database Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">Cancel</el-button>
      <el-button type="primary" size="mini" @click="handlerAddDatabase">Save</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { runExecute } from '@/api/query'
import { stringFormat, getDataSource, getServerURL } from '@/utils/Utils'

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
    handlerAddDatabase() {
      if (this.remoteServer === null) {
        this.$notify.error({
          title: 'Error',
          message: 'Remote Server must null!'
        })
        return
      }
      const dataSource = getDataSource(this.remoteServer)
      const remoteServer = getServerURL(dataSource[0].host, dataSource[0].port, null)
      const sql = stringFormat('CREATE DATABASE {0}', [this.form.name])
      runExecute(remoteServer, sql).then(response => {
        if (response.status === 200) {
          this.$notify.success({
            title: 'Success',
            message: stringFormat('Create Database <{0}> On Server <{1}> successful!', [this.form.name, this.remoteServer])
          })
        }
        this.closeDialog()
      }).catch(response => {
        this.$notify.error({
          title: 'Error',
          message: response.data
        })
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
