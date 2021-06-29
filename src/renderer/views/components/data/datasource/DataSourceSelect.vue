<template>
  <el-select v-model="model" size="mini" :placeholder="placeholder" @change="handlerChange">
    <el-option
      v-for="item in items"
      :key="item.name"
      :label="item.name"
      :disabled="!item.status"
      :value="item.name">
      <el-tooltip v-if="!item.status" class="item" effect="dark" :content="item.message" placement="top">
        <span style="float: left">{{ item.name }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px; margin-left: 10px;">{{ item.host }}</span>
      </el-tooltip>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'DataSource',
  props: {
    items: {
      type: Array,
      default: []
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  created() {
  },
  data() {
    return {
      model: null,
      datas: null
    }
  },
  methods: {
    handlerChange() {
      this.$emit('getValue', this.model)
    }
  },
  watch: {
    items: {
      deep: true,
      handler() {
        this.datas = this.items
      }
    },
    placeholder: {
      deep: true
    }
  }
}
</script>
