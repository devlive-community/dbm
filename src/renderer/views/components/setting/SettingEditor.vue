<template>
  <div>
    <el-alert :title="this.$t('alter.refersh_config')" type="warning" :closable="false"></el-alert>
    <br />
    <codemirror v-model="code" ref="previewEditor" :options="form" />
    <br />
    <el-form :model="form" label-width="150px" size="mini">
      <el-form-item :label="this.$t('common.theme')">
        <el-select filterable v-model="form.theme">
          <el-option v-for="item in themes" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$t('common.activeLine')">
        <el-switch v-model="form.styleActiveLine" :active-text="this.$t('common.yes')" :inactive-text="this.$t('common.no')" />
      </el-form-item>
      <el-form-item :label="this.$t('common.showLine')">
        <el-switch v-model="form.lineNumbers" :active-text="this.$t('common.yes')" :inactive-text="this.$t('common.no')" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { bufferSetting, getSetting } from '@/services/Setting'
import { isNotEmpty } from '@/utils/StringUtils'
import themes from '@/editor/theme'

export default {
  name: 'SettingEditor',
  props: {
  },
  created() {
    this._initialize()
  },
  data() {
    return {
      key: 'Editor',
      code: `SELECT 1 = 1`,
      themes: themes,
      form: {
        theme: 'eclipse',
        lineNumbers: true,
        styleActiveLine: true
      },
      options: null
    }
  },
  methods: {
    async _initialize() {
      const setting = await getSetting(this.key)
      if (isNotEmpty(setting)) {
        this.form = setting
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(value) {
        bufferSetting(value, this.key)
      }
    }
  }
}
</script>
<style scoped>
  /deep/ .CodeMirror {
    border: 1px solid #eee;
    height: auto;
  }
</style>
