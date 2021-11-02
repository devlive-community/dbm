<template>
  <div>
    <el-form-item :label="this.$t('common.uri')">
      <el-input v-model="config.uri"
                placeholder="DSN=mysqlconn"
                @change="handlerValidate"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.database')">
      <el-input v-model="config.database" @change="handlerValidate"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.table')">
      <el-input v-model="config.table" @change="handlerValidate"/>
    </el-form-item>
  </div>
</template>

<script>
const ValidateUtils = require('../../../../../utils/ValidateUtils')

export default {
  name: 'TableEngineOdbc',
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
        uri: null,
        database: null,
        table: null,
        validate: false
      }
    }
  },
  methods: {
    handlerValidate() {
      this.config.validate = ValidateUtils.validate(this.config)
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
