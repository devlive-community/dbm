<template>
  <el-dialog :title="body.title"  :visible.sync="body.show" :width="width" @close="closeDialog">
    <em>{{ this.$t('alter.operation') }} {{ this.$t('alter.result') }}</em>
    <el-alert :title="this.$t('common.necessary')" type="error">
      <el-tag type="info" size="mini">{{ body.id }}</el-tag>
    </el-alert>
    <ol>
      <li><el-tag type="danger" size="mini">{{ this.$t('common.no_callback') }}</el-tag> {{ this.$t('alter.stop_on_cluster') }}</li>
      <li>{{ this.$t('alter.operation_submit') }}</li>
      <el-input v-model="value" size="mini"></el-input>
    </ol>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="body.show = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
      <el-button type="primary" size="mini" @click="handlerKill">{{ this.$t('common.ok') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { killQuery } from '@/services/Query'

export default {
  name: 'QueryKill',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    title: {
      type: String,
      default: ''
    },
    server: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'processor'
    }
  },
  created() {
  },
  data() {
    return {
      body: {
        show: false,
        title: null,
        server: null,
        id: null,
        type: null
      },
      value: null
    }
  },
  methods: {
    async handlerKill() {
      const response = await killQuery(this.body.server, this.body.id, this.value, this.type)
      if (!response.status) {
        this.$notify.error({
          title: this.$t('common.error'),
          message: response.message
        })
      } else {
        this.$notify.success({
          title: this.$t('common.success'),
          message: response.message
        })
        this.closeDialog()
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
        this.body.show = this.loading
      }
    },
    width: {},
    title: {
      handler() {
        this.body.title = this.title
      }
    },
    server: {
      handler() {
        this.body.server = this.server
      }
    },
    id: {
      handler() {
        this.body.id = this.id
      }
    },
    type: {
      handler() {
        this.body.type = this.type
      }
    }
  }
}
</script>
