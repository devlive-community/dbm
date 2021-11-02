<template>
  <div>
    <el-form-item :label="this.$t('common.uri')">
      <el-input v-model="config.uri"
                placeholder="jdbc:<driver_name>://<host_name>:<port>/?user=<username>&password=<password>"
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
const StringUtils = require('../../../../../utils/StringUtils')

export default {
  name: 'TableEngineJdbc',
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
      const empty = Object.keys(this.config).filter(item => StringUtils.isEmpty(this.config[item]))
      if (empty.length <= 0) {
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
