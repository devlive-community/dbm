<template>
  <el-tree lazy :data="datas" :load="handlerLoadNode" @node-click="handleNodeClick">
    <span class="custom-tree-node" slot-scope="{ data }">
      <span><i :class="getFaIcon(data.type)"></i> {{ data.name }}</span>
    </span>
  </el-tree>
</template>

<script>
import { builderTree } from '@/utils/JsonUtils'
import { getQuery } from '@/services/Metadata'
import { SERVER, DATABASE, TABLE } from '@/utils/Support'

export default {
  name: 'DataTree',
  props: {
    items: {
      type: Array,
      default: []
    }
  },
  created() {
  },
  data() {
    return {
      datas: null,
      context: {
        title: null,
        server: null,
        database: null,
        table: null,
        type: null
      }
    }
  },
  methods: {
    handlerChange() {
      this.$emit('getValue', this.context)
    },
    async handlerLoadNode(node, resolve) {
      // You have to set it to be greater than 0 because 0 by default is going to repeat the data once
      if (node.level > 0) {
        switch (node.level) {
          case 1: { // DataBase
            this.context.server = node.data.name
            const response = await getQuery(node.data.name, 'SHOW DATABASES')
            if (response.status) {
              resolve(builderTree(response.columns, DATABASE))
            } else {
              this.$notify.error({
                title: this.$t('common.error'),
                message: response.message
              })
            }
            break
          }
          case 2: { // Table
            const sql = this.stringFormat(`
            SELECT uuid, name, engine, partition_key, sorting_key, total_rows, total_bytes
            FROM system.tables
            WHERE database = \'{0}\'
            `, [node.data.name])
            const response = await getQuery(this.context.server, sql)
            if (response.status) {
              resolve(builderTree(response.columns, TABLE))
            } else {
              this.$notify.error({
                title: this.$t('common.error'),
                message: response.message
              })
            }
            break
          }
          default: // TODO: Support Columns
            resolve([])
        }
      }
    },
    handleNodeClick(node) {
      this.context.type = node.type
      switch (node.type) {
        case SERVER:
          this.context.server = node.name
          this.context.database = null
          this.context.table = null
          break
        case DATABASE:
          this.context.database = node.name
          this.context.table = null
          break
        case TABLE:
          this.context.table = node.name
          break
      }
      this.context.title = node.name
    }
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.datas = builderTree(this.items, SERVER)
      }
    },
    context: {
      deep: true,
      handler(value) {
        this.$emit('change', value)
      }
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
