<template>
  <div>
    <el-alert :title="this.$t('alter.refersh_config')" type="warning" :closable="false"></el-alert>
    <br />
    <el-form :model="form" label-width="120px" size="mini">
      <el-form-item :label="this.$t('common.network') + this.$t('common.timeout')">
        <el-tooltip placement="top">
            <div slot="content">
              <span v-html="this.$t('view.component.setting.basic.tooltip.network')"></span>
            </div>
            <el-input
              :placeholder="this.$t('view.component.setting.basic.placeholder.network')"
              v-model="form.network">
              <i slot="prefix" class="fa fa-at"></i>
            </el-input>
          </el-tooltip>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { bufferSetting, getSetting } from '@/services/Setting'
import { isNotEmpty } from '@/utils/StringUtils'

export default {
  name: 'SettingBasic',
  props: {
  },
  created() {
    this._initialize()
  },
  data() {
    return {
      key: 'Basic',
      form: {
        network: 10
      }
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
