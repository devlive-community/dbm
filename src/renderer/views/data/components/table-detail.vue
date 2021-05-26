<template>
  <el-dialog
    :visible.sync="tableDetailDialogVisible">
    <el-row>
      <el-pagination
        v-if="columns.length > 0"
        layout="total, prev, pager, next"
        :total="columns.length"
        background>
      </el-pagination>
      <el-table v-loading.body="loading"
        style="width: 100%"
        border
        :data="columns.slice((currentPage - 1) * pagesize, currentPage * pagesize)">
        <template v-for="(item,index) in headers">
          <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
        </template>
        <el-table-column
          v-if="columns.length > 0"
          fixed="right"
          label="Action"
          width="100">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              trigger="hover"
              content="Table DDL">
              <el-button type="text" 
                size="small" 
                slot="reference"
                :loading="buttonLoading"
                @click="handlerShowDDL(scope.row)">
                <i class="fa fa-bolt"></i> DDL
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: 'TableDetail',
  props: {
    tableDetailDialogVisible: {
      type: Boolean,
      default: false
    },
    headers: {
      type: Array,
      default: function() {
        return []
      }
    },
    columns: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      buttonLoading: false,
      pagesize: 10,
      currentPage: 1
    }
  },
  methods: {
    clickTitle() {
      this.isActive = !this.isActive
    }
  }
}
</script>