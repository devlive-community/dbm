<template>
  <div>
    <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.kafka'), this.$t('common.broker')])">
      <el-input v-model="kafka.broker"/>
    </el-form-item>
    <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.kafka'), this.$t('common.topic')])">
      <el-input v-model="kafka.topic"/>
    </el-form-item>
    <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.kafka'), this.$t('common.group')])">
      <el-input v-model="kafka.group"/>
    </el-form-item>
    <el-form-item :label="this.stringFormat('{0}{1}', [this.$t('common.kafka'), this.$t('common.format')])">
      <el-input v-model="kafka.format"/>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'TableEngineKafka',
  components: {},
  props: {},
  created() {
  },
  data() {
    return {
      kafka: {
        broker: null,
        topic: null,
        group: null,
        format: 'JSONEachRow'
      }
    }
  },
  methods: {},
  watch: {
    kafka: {
      deep: true,
      handler() {
        this.$emit('change', this.kafka)
      }
    }
  }
}
</script>
