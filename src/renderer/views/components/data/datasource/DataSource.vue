<template>
  <el-dialog :title="title" :visible.sync="elementLoading.body" :width="width" @close="closeDialog">
    <el-form :model="form" size="mini">
      <el-form-item label="Alias Name" :label-width="formLabelWidth">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Host" :label-width="formLabelWidth">
        <el-input v-model="form.host"></el-input>
      </el-form-item>
      <el-form-item label="Port" :label-width="formLabelWidth">
        <el-input v-model="form.port"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" :loading="elementLoading.test" type="success" @click="hadnlerTest()">Test Connection</el-button>
      <el-button size="mini" @click="elementLoading.body = false">Cancel</el-button>
      <el-button type="primary" size="mini" @click="handlerProcessor()">OK</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveDataSource, getConnection } from '@/services/DataSource'

export default {
  name: 'DataSource',
  props: {
    title: {
      type: String,
      default: ''
    },
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
  },
  data() {
    return {
      form: {
        name: '',
        host: '',
        port: '',
        userName: '',
        password: ''
      },
      formLabelWidth: '120px',
      elementLoading: {
        body: false,
        test: false
      }
    }
  },
  methods: {
    async handlerProcessor() {
      const response = await saveDataSource(this.form)
      if (!response.status) {
        this.$notify.error({
          title: 'Error',
          message: response.message
        })
      } else {
        this.$notify.success({
          title: 'Success',
          message: response.message
        })
        this.closeDialog()
        this.$emit('refresh')
      }
    },
    async hadnlerTest() {
      this.elementLoading.test = true
      const response = await getConnection(this.form.host, this.form.port)
      if (!response.status) {
        this.$notify.error({
          title: 'Error',
          message: response.message
        })
      } else {
        this.$notify.success({
          title: 'Success',
          message: response.message
        })
      }
      this.elementLoading.test = false
    },
    closeDialog() {
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.elementLoading.body = this.loading
      }
    },
    width: {
      deep: true
    },
    title: {
      deep: true
    }
  }
}
</script>
