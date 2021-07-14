import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

import { getLength, getLengthGtZore, getLengthLtZore, getLengthEqZore, getFaIcon, stringFormat } from './utils/Utils'
Vue.prototype.getLength = getLength
Vue.prototype.getLengthGtZore = getLengthGtZore
Vue.prototype.getLengthLtZore = getLengthLtZore
Vue.prototype.getLengthEqZore = getLengthEqZore
Vue.prototype.getFaIcon = getFaIcon
Vue.prototype.stringFormat = stringFormat

import config from '../../package.json'
Vue.prototype.VERSION = config.version

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Support i18n
import { i18n } from './i18n'

// Support highcharts
import HighchartsVue from 'highcharts-vue'
Vue.use(HighchartsVue)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')
