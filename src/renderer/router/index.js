import Vue from 'vue'
import Router from 'vue-router'

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
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/query',
    component: Layout,
    redirect: '/example/table',
    name: 'Query',
    meta: { title: 'Query', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Query',
        component: () => import('@/views/query/index'),
        meta: { title: 'Query', icon: 'eye' }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/source',
    name: 'DataSource',
    meta: { title: 'DataSource', icon: 'example' },
    children: [
      {
        path: 'source',
        name: 'DataSource',
        component: () => import('@/views/data/source'),
        meta: { title: 'DataSource', icon: 'table' }
      },
      {
        path: 'metadata/:name',
        name: 'Metadata',
        component: () => import('@/views/data/metadata'),
        meta: { title: 'Metadata', icon: 'password' }
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

