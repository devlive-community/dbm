<template>
  <div>
    <el-form-item :label="this.stringFormat('{0} {1}', [this.$t('common.hdfs'), this.$t('common.uri')])">
      <el-input v-model="hdfs.uri"/>
    </el-form-item>
    <el-form-item :label="this.stringFormat('{0} {1}', [this.$t('common.hdfs'), this.$t('common.format')])">
      <el-select v-model="hdfs.format"/>
    </el-form-item>
  </div>
</template>

<script>
const StringUtils = require('../../../../../utils/StringUtils')

export default {
  name: 'TableEngineHdfs',
  components: {},
  props: {},
  created() {
  },
  data() {
    return {
      hdfs: {
        uri: '',
        format: 'Parquet', // Current Only support Parquet file
        validate: false
      }
    }
  },
  methods: {
    handlerValidate() {
      const empty = Object.keys(this.hdfs).filter(item => StringUtils.isEmpty(this.hdfs[item]))
      if (empty.length <= 0) {
        this.hdfs.validate = true
      } else {
        this.hdfs.validate = false
      }
    }
  },
  watch: {
    hdfs: {
      deep: true,
      handler() {
        this.handlerValidate()
        this.$emit('change', this.hdfs)
      }
    }
  }
}
</script>
