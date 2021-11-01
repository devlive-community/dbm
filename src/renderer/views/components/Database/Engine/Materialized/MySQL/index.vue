<template>
  <div>
    <el-form-item>
      <el-alert :title="this.$t('alter.experimental')" :closable="false" type="warning"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.host')">
      <el-input v-model="config.host" @change="handlerValidate"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.port')">
      <el-input type="number" v-model="config.port" @change="handlerValidate"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.database')">
      <el-input v-model="config.database" @change="handlerValidate"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.username')">
      <el-input v-model="config.username" @change="handlerValidate"/>
    </el-form-item>
    <el-form-item :label="this.$t('common.password')">
      <el-input type="password" v-model="config.password" @change="handlerValidate"/>
    </el-form-item>
  </div>
</template>

<script>
const StringUtils = require('../../../../../../utils/StringUtils')

export default {
  name: 'DatabaseEngineMaterializedMysql',
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
        host: null,
        port: 3306,
        database: null,
        username: null,
        password: null,
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
