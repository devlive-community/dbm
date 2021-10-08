<template>
  <div>
    <el-alert :title="this.$t('alter.refresh_config')" type="warning" :closable="false"></el-alert>
    <el-form :model="form" label-width="150px" size="mini">
      <el-divider content-position="left">{{ this.$t('common.editor') }}</el-divider>
      <codemirror v-model="code" ref="previewEditor" :options="form"/>
      <br/>
      <el-form-item :label="this.$t('common.theme')">
        <el-select filterable v-model="form.theme">
          <el-option v-for="item in themes" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$t('common.activeLine')">
        <el-switch v-model="form.styleActiveLine" :active-text="this.$t('common.yes')"
                   :inactive-text="this.$t('common.no')"/>
      </el-form-item>
      <el-form-item :label="this.$t('common.showLine')">
        <el-switch v-model="form.lineNumbers" :active-text="this.$t('common.yes')"
                   :inactive-text="this.$t('common.no')"/>
      </el-form-item>
      <el-divider content-position="left">{{ this.$t('common.format') }}</el-divider>
      <el-form-item :label="this.$t('common.language')">
        <el-select filterable v-model="form.formatter.language">
          <el-option v-for="item in this.SqlUtils.LANGUAGES" :key="item.label" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="this.$t('common.uppercase')">
        <el-checkbox v-model="form.formatter.uppercase">{{ this.$t('common.uppercase') }}</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { bufferSetting, getSetting } from '@/services/Setting'
import themes from '@/editor/theme'

export default {
  name: 'SettingEditor',
  props: {},
  created() {
    this._initialize()
  },
  data() {
    return {
      key: 'Editor',
      code: 'select id as `ID`, name as `Name` from db.tb where id > 1 group by name order by name limit 10',
      themes: themes,
      form: {
        theme: 'eclipse',
        lineNumbers: true,
        styleActiveLine: true,
        formatter: this.SqlUtils.DEFAULT
      },
      options: null
    }
  },
  methods: {
    async _initialize() {
      this.code = this.sqlFormatter(this.code, this.form.formatter)
      const setting = await getSetting(this.key)
      if (this.isNotEmpty(setting)) {
        // If the new property is not available, do a configuration merge
        this.form = Object.assign(setting, this.form)
      }
    }
  },
  watch: {
    form: {
      deep: true,
      handler(value) {
        bufferSetting(value, this.key)
        this.code = this.sqlFormatter(this.code, this.form.formatter)
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
