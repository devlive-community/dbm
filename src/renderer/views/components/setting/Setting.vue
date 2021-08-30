<template>
  <el-dialog :title="this.$t('common.setting')" :visible.sync="bodyLoading" @close="closeDialog" :width="width">
    <el-row>
      <el-col :span="6">
        <el-menu :default-active="activeIndex" active-text-color="#409EFF" @select="handleSelect">
          <el-menu-item index="basic">
            <span slot="title">
              <i class="fa fa-cog"></i>
              {{ this.$t('common.basic') + this.$t('common.setting') }}
            </span>
          </el-menu-item>
          <el-menu-item index="editor">
            <span slot="title">
              <i class="fa fa-th-large"></i>
              {{ this.$t('common.editor') + this.$t('common.setting') }}
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="16" style="margin-left: 10px;">
        <setting-basic v-if="activeIndex === 'basic'"></setting-basic>
        <setting-editor v-if="activeIndex === 'editor'"/>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import SettingBasic from './SettingBasic'
import SettingEditor from './SettingEditor'

export default {
  components: {
    SettingBasic,
    SettingEditor
  },
  name: 'Setting',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    }
  },
  created() {
  },
  data() {
    return {
      bodyLoading: false,
      activeIndex: 'basic'
    }
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key
    },
    closeDialog() {
      this.$emit('close')
    }
  },
  watch: {
    loading: {
      deep: true,
      handler() {
        this.bodyLoading = this.loading
      }
    },
    width: {
      deep: true
    }
  }
}
</script>
