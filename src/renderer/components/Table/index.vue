<template>
  <el-row v-loading="bodyLoading">
    <el-pagination
      v-if="columns.length > 0"
      layout="total, sizes, prev, pager, next"
      :total="columns.length"
      :page-sizes="[10, 20, 30, 50]"
      @current-change="handlerChangePage"
      @size-change="handleSizeChange"
      background>
    </el-pagination>
    <el-table
      style="width: 100%"
      border
      :data="columns.slice((currentPage - 1) * pageSize, currentPage * pageSize)">
      <el-table-column v-if="columns.length > 0" type="selection" width="55" align="center"></el-table-column>
      <el-table-column v-if="columns.length > 0" type="index" label="No" width="55" align="center" fixed></el-table-column>
      <template v-for="(item,index) in headers">
        <el-table-column :prop="item.name" :label="item.name" :key="index"></el-table-column>
      </template>
    </el-table>
  </el-row>
</template>

<script>
export default {
  name: 'TableDetail',
  props: {
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
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.currentPage = 1
    this.pageSize = 10
  },
  data() {
    return {
      bodyLoading: false,
      pageSize: 10,
      currentPage: 1
    }
  },
  methods: {
    handlerChangePage(currentPage) {
      this.currentPage = currentPage
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
    }
  },
  watch: {
    columns: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.pageSize = 10
      }
    },
    loading: {
      deep: true,
      handler() {
        this.bodyLoading = this.loading
      }
    }
  }
}
</script>
