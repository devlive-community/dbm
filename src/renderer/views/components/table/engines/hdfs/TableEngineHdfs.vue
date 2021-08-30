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
        format: 'Parquet' // Current Only support Parquet file
      }
    }
  },
  methods: {},
  watch: {
    hdfs: {
      deep: true,
      handler() {
        this.$emit('change', this.hdfs)
      }
    }
  }
}
</script>
