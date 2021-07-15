<template>
  <el-dialog :title="body.title"  :visible.sync="body.show" :width="width" @close="closeDialog">
    <codemirror v-model="body.ddl" />
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="body.show = false" size="mini">{{ this.$t('common.cancel') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TableDdl',
  components: {
  },
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
    ddl: {
      type: String,
      default: ''
    }
  },
  created() {
  },
  data() {
    return {
      body: {
        show: false,
        title: '',
        ddl: ''
      }
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
        this.body.show = this.loading
      }
    },
    width: {},
    title: {
      handler() {
        this.body.title = this.title
      }
    },
    ddl: {
      handler() {
        this.body.ddl = this.sqlFormatter(this.ddl)
      }
    }
  }
}
</script>
