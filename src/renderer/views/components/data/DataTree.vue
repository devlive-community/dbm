<template>
  <div class="tree-container">
    <el-tree class="_tree" ref="dataTree" lazy :data="treeItems" :load="handlerLoadNode" @node-click="handleNodeClick"
             :node-key="nodeKey"
             @node-contextmenu="handlerRightClick">
      <span class="custom-tree-node" slot-scope="{ data }">
        <span><i :class="getFaIcon(data.type)"></i> {{ data.name }}</span>
      </span>
    </el-tree>
    <el-popover v-model="menu.show" v-if="menu.data.length > 0" placement="right" trigger="manual"
                class="popover-inter"
                id="contextMenu"
                :style="`left: ${menu.position.x}px; top: ${menu.position.y}px;`">
      <el-dropdown-item v-for="item in menu.data" :key="item.id">
        <el-button size="mini" type="text" @click="handlerClickMenu(item)">
          <i :class="'fa fa-'+ item.icon"></i> {{ item.name }}
        </el-button>
      </el-dropdown-item>
    </el-popover>
  </div>
</template>

<script>
import { builderTree } from '@/utils/JsonUtils'
import { getDataByParam } from '@/services/Metadata'
import { SERVER, DATABASE, TABLE, COLUMN } from '@/utils/Support'
import { getContextMenu } from '../../../services/ContextMenu'

export default {
  name: 'DataTree',
  props: {
    items: {
      type: Array,
      default: []
    },
    nodeKey: {
      type: String,
      default() {
        return 'name'
      }
    }
  },
  created() {
  },
  data() {
    return {
      treeItems: null,
      context: {
        title: null,
        server: null,
        database: null,
        table: null,
        type: null
      },
      menu: {
        show: false,
        data: [],
        position: {
          x: '',
          y: ''
        }
      }
    }
  },
  mounted() {
    document.addEventListener('click', e => {
      const contextMenu = document.getElementById('contextMenu')
      if (contextMenu) {
        if (!contextMenu.contains(e.target)) {
          this.$emit('updateTreeMenu', false)
        }
      }
    })
  },
  methods: {
    handlerChange() {
      this.$emit('getValue', this.context)
    },
    async handlerLoadNode(node, resolve) {
      // You have to set it to be greater than 0 because 0 by default is going to repeat the data once
      if (node.level > 0) {
        let queryType = DATABASE
        const level = node.level
        if (level === 1) {
          this.context.server = node.data.name
        } else if (level === 2) {
          queryType = TABLE
          this.context.database = node.data.name
        } else if (level === 3) {
          queryType = COLUMN
          this.context.table = node.data.name
        } else {
          resolve([])
          return
        }
        const response = await getDataByParam(this.context.server, queryType, this.context.database, this.context.table)
        if (response.status) {
          resolve(builderTree(response.columns, queryType))
        } else {
          this.$notify.error({
            title: this.$t('common.error'),
            message: response.message
          })
        }
      }
    },
    handleNodeClick(node) {
      this.handlerUpdateTreeMenu(false)
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
      this.menu.data = getContextMenu(node.type)
      this.context.title = node.name
    },
    handlerRightClick(event, node) {
      this.menu.position.x = event.offsetX
      this.menu.position.y = event.clientY - 120
      this.handlerSetCurrTreeNode(node[this.nodeKey], node)
      this.menu.show = true
    },
    handlerUpdateTreeMenu(value) {
      this.menu.show = value
    },
    handlerClickMenu(menu) {
      this.handlerUpdateTreeMenu(false)
      this.$emit('handlerClickTreeMenu', menu)
    },
    handlerSetCurrTreeNode(key, node) {
      this.$refs['dataTree'].setCurrentKey(key)
      this.handleNodeClick(node)
    }
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.treeItems = builderTree(this.items, SERVER)
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

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree-container {
  position: relative;

  ._tree {
    color: #444;
    padding-left: 6px;
    overflow: auto;

    .tree_label {
      font-size: 14px;
      letter-spacing: 1px;
      margin-left: 5px;
    }
  }

  .popover-inter {
    position: absolute;

    ul {
      padding: 1px;
    }

    li {
      list-style: none;
    }
  }

  .el-popover {
    padding: 1px;
    min-width: 20px;
    border: 1px solid #ebeef5;
    border-radius: 0;
    box-shadow: 4px 4px 4px -4px rgb(121, 118, 118);
  }

  .el-tree > .el-tree-node {
    min-width: 100%;
    display: inline-block;
  }
}

/deep/ .el-popover {
  padding: 2px;
}
</style>
