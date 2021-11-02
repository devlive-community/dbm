<template>
  <el-dialog :title="this.$t('common.ddl')" :visible.sync="visible" :before-close="closeDialog" :width="'65%'">
    <el-skeleton v-if="loading" :rows="6" animated/>
    <div v-else>
      <codemirror v-model="value"/>
    </div>
  </el-dialog>
</template>

<script>
import { getFormatter } from '../../../../services/Setting'
import { getDatabaseDDL } from '../../../../services/DatabaseService'

const NotifyUtils = require('../../../../utils/NotifyUtils')

export default {
  name: 'DatabaseDdl',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    configure: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.handlerGetDatabaseDDL()
  },
  data() {
    return {
      loading: false,
      value: ''
    }
  },
  methods: {
    handlerGetDatabaseDDL() {
      this.loading = true
      getDatabaseDDL(this.configure.server, this.configure.database).then(response => {
        if (response.status) {
          const formatter = getFormatter()
          this.value = this.sqlFormatter(response.columns[0].statement, formatter)
        } else {
          NotifyUtils.error(this.$t('common.error'), response.message)
        }
        this.loading = false
      })
    },
    closeDialog() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
