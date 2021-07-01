<template>
  <el-dialog :title="this.$t('common.setting')" :visible.sync="bodyLoading" @close="closeDialog" :width="width">
    <el-row>
      <el-col :span="6">
        <el-menu default-active="basic">
          <el-menu-item index="basic">
            <span slot="title">
              <i class="fa fa-cog"></i>
              {{this.$t('common.basic') + this.$t('common.setting')}}
            </span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="16">
        <setting-basic></setting-basic>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import SettingBasic from './SettingBasic'
export default {
  components: { SettingBasic },
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
      bodyLoading: false
    }
  },
  methods: {
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
