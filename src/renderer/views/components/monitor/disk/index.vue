<template>
  <el-row :gutter="20">
    <el-empty v-if="this.isEmpty(elements)"/>
    <el-col v-else v-for="(item, index) in elements" :key="index" :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span> {{ (index + 1) + ': ' + item.name }}</span>
        </div>
        <el-popover placement="top" trigger="hover">
          <el-descriptions :column="1" size="mini" :title="$t('common.information')" style="width: 300px;">
            <el-descriptions-item v-for="(v, i) in Object.entries(item)" :key="i" :value="v[1]" :label="v[0]"
                                  class="item">
              {{ v[1] }}
            </el-descriptions-item>
          </el-descriptions>
          <el-progress slot="reference" type="dashboard" :percentage="item.value"/>
        </el-popover>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'MonitorDisk',
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
      elements: []
    }
  },
  methods: {},
  watch: {
    items: {
      deep: true,
      handler() {
        this.elements = this.items
      }
    }
  }
}
</script>
