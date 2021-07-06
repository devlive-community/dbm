<template>
  <el-dialog
    title="Server Infomation" 
    :visible.sync="bodyLoading"
    @close="closeDialog">
    <el-tabs>
      <el-tab-pane>
        <span slot="label">Infomation</span>
        <server-status-infomation :server="remoteServer" :loading="true"></server-status-infomation>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button @click="bodyLoading = false" size="mini">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ServerStatusInfomation from './ServerStatusInfomation'

export default {
  components: {
    ServerStatusInfomation
  },
  name: 'ServerStatus',
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
      remoteServer: null
    }
  },
  methods: {
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
