<template>
  <el-row :gutter="20">
    <el-empty v-if="this.isEmpty(elements)"/>
    <el-col v-else v-for="(item, index) in elements" :key="index" :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span> {{ (index + 1) + ': ' + item.name }}</span>
        </div>
        <el-popover placement="top" trigger="hover">
          <p v-for="(v, i) in Object.entries(item)" :key="i" :value="v[1]" class="item">
            <em>{{ v[0] }}</em> : {{ v[1] }}
          </p>
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
