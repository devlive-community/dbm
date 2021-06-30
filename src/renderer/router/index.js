import Vue from 'vue'
import Router from 'vue-router'
import i18n from '@/i18n'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Index',
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/index/index')
    }]
  },
  {
    path: '/query',
    component: Layout,
    redirect: '/example/table',
    name: 'Query',
    meta: { title: i18n.t('router.query'), icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Query',
        component: () => import('@/views/query/index'),
        meta: { title: i18n.t('router.query'), icon: 'eye' }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/source',
    name: 'DataSource',
    meta: { title: i18n.t('router.data.source'), icon: 'adjust' },
    children: [
      {
        path: 'source',
        name: 'DataSource',
        component: () => import('@/views/data/source/index'),
        meta: { title: i18n.t('router.data.source'), icon: 'table' }
      },
      {
        path: 'metadata/:name',
        name: 'Metadata',
        component: () => import('@/views/data/metadata/index'),
        meta: { title: i18n.t('router.data.metadata'), icon: 'archive' }
      },
      {
        path: 'detail/:server/:database/:table',
        name: 'Detail',
        hidden: true,
        component: () => import('@/views/data/detail'),
        meta: { title: i18n.t('router.data.table.detail'), icon: 'password' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

