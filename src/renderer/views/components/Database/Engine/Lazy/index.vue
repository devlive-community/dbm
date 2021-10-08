<template>
  <div>
    <el-form-item :label="this.stringFormat('{0} {1}', [this.$t('common.expiration'), this.$t('common.time')])">
      <el-input-number v-model="config.timeSeconds" @change="handlerValidate"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'DatabaseEngineLazy',
  components: {},
  props: {},
  mounted() {
    this.$emit('change', this.config)
  },
  created() {
  },
  data() {
    return {
      config: {
        timeSeconds: 0,
        validate: false
      }
    }
  },
  methods: {
    handlerValidate() {
      if (this.config.timeSeconds !== 0) {
        this.config.validate = true
      } else {
        this.config.validate = false
      }
    }
  },
  watch: {
    config: {
      deep: true,
      handler() {
        this.$emit('change', this.config)
      }
    }
  }
}
</script>
