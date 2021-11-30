<template>
  <el-menu
      mode="horizontal"
      router
      :default-active="$route.path"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
  >
    <el-menu-item index="/" style="float: left;">
      <el-avatar :src="logo"></el-avatar>
    </el-menu-item>
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <el-menu-item
          v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
          :key="item.children[0].name"
          :index="item.path+'/'+item.children[0].path"
      >
        <i v-if="item.children[0].meta&&item.children[0].meta.icon" :class="'fa fa-' + item.children[0].meta.icon"></i>
        {{ item.children[0].meta.title }}
        <el-tag v-if="item.children[0].new" type="danger" size="mini" effect="dark">{{ $t('common.new') }}</el-tag>
      </el-menu-item>
      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <i v-if="item.meta && item.meta.icon" :class="'fa fa-' + item.meta.icon"></i>
          {{ item.meta.title }}
          <el-tag v-if="item.new" type="danger" size="mini" effect="dark">{{ $t('common.new') }}</el-tag>
        </template>
        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item :is-nest="true" v-if="child.children&&child.children.length>0" :routes="[child]"
                        :key="child.path"></sidebar-item>
          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <i v-if="child.meta&&child.meta.icon" :class="'fa fa-' + child.meta.icon"></i>
              <span v-if="child.meta&&child.meta.title" slot="title">
                  {{ child.meta.title }}
                  <el-tag v-if="item.children[0].new" type="danger" size="mini" effect="dark">{{
                      $t('common.new')
                    }}</el-tag>
                </span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
    <el-submenu :index="'rightInfo'" style="float: right;">
      <template slot="title">
        <div class="avatar-wrapper">
          <span>DBM</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
      </template>
      <el-menu-item index="/">
        <i class="fa fa-home"></i> {{ this.$t('router.index') }}
      </el-menu-item>
      <el-menu-item index="#Setting" @click.native="loading.setting = true">
        <i class="fa fa-cogs"></i> {{ this.$t('common.setting') }}
      </el-menu-item>
    </el-submenu>
    <!-- i18n -->
    <el-submenu :index="'rightLang'" style="float: right;">
      <template slot="title">
        <i class="fa fa-language"></i>
      </template>
      <el-menu-item :index="'#en_US'" @click.native="toggleLang('en_US')" :disabled="$i18n.locale == 'en_US'">English
      </el-menu-item>
      <el-menu-item :index="'#zh_CN'" @click.native="toggleLang('zh_CN')" :disabled="$i18n.locale == 'zh_CN'">中文
      </el-menu-item>
    </el-submenu>
    <!-- other -->
    <el-tooltip :content="this.$t('common.reload')">
      <el-menu-item class="right danger" :index="'#reload'" @click.native="reloadPage">
        <i class="fa fa-road"/>
      </el-menu-item>
    </el-tooltip>
    <el-menu-item class="right danger">
      <a @click="handlerOpenUrl"><i class="fab fa-github"/></a>
    </el-menu-item>
    <setting :loading="loading.setting" :width="'60%'" @close="loading.setting = false"></setting>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import { shell } from 'electron'

import logo from '@/assets/images/logo.png'
import ScrollBar from '@/components/ScrollBar'
import Setting from '@/views/components/setting/Setting'

export default {
  components: {
    ScrollBar,
    Setting
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes
    }
  },
  data() {
    return {
      logo,
      loading: {
        setting: false
      }
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    },
    handlerOpenUrl() {
      shell.openExternal('https://github.com/EdurtIO/dbm')
    },
    toggleLang(lang) {
      if (lang === 'zh_CN') {
        localStorage.setItem('locale', 'zh_CN')
        this.$i18n.locale = localStorage.getItem('locale')
      } else if (lang === 'en_US') {
        localStorage.setItem('locale', 'en_US')
        this.$i18n.locale = localStorage.getItem('locale')
      }
      this.$message({
        message: this.$i18n.t('common.switch'),
        type: 'success'
      })
      setTimeout(this.reloadPage, 2000)
    },
    reloadPage() {
      window.location.reload()
    }
  }
}
</script>
<style scoped>
.right {
  float: right;
}
</style>
