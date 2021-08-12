<template>
  <el-descriptions :column="1">
    <el-descriptions-item v-if="body.source.server" :label="this.$t('common.server')" :labelStyle="{width: '120px'}">
      <el-timeline>
        <el-timeline-item v-if="body.source.server">{{ body.source.server }}</el-timeline-item>
        <el-timeline-item v-if="body.target.server">{{ body.target.server }}</el-timeline-item>
      </el-timeline>
    </el-descriptions-item>
    <el-descriptions-item v-if="body.source.database && body.source.database.value" :label="this.$t('common.database')"
                          :labelStyle="{width: '120px'}">
      <el-timeline>
        <el-timeline-item v-if="body.source.database && body.source.database.value">{{
            body.source.database.value
          }}
        </el-timeline-item>
        <el-timeline-item v-if="body.target.database && body.target.database.value">{{
            body.target.database.value
          }}
        </el-timeline-item>
      </el-timeline>
    </el-descriptions-item>
    <el-descriptions-item v-if="body.source.table && body.source.table.value" :label="this.$t('common.table')"
                          :labelStyle="{width: '120px'}">
      <el-timeline>
        <el-timeline-item v-if="body.source.table && body.source.table.value">{{
            body.source.table.value
          }}
        </el-timeline-item>
        <el-timeline-item v-if="body.target.table && body.target.table.value">{{
            body.target.table.value
          }}
        </el-timeline-item>
      </el-timeline>
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: 'MigratePreview',
  props: {
    source: {
      type: Object,
      default: {}
    },
    target: {
      type: Object,
      default: {}
    }
  },
  created() {
  },
  data() {
    return {
      body: {
        source: {},
        target: {}
      }
    }
  },
  methods: {},
  watch: {
    source: {
      deep: true,
      handler() {
        this.body.source = this.source
      }
    },
    target: {
      deep: true,
      handler() {
        this.body.target = this.target
      }
    }
  }
}
</script>
