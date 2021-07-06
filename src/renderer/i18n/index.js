/**
 * Support i18n
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import en_US from './en_US'
import zh_CN from './zh_CN'

import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const DEFAULT_LANG = 'zh_CN'

const messages = {
  en_US: Object.assign(enLocale, en_US),
  zh_CN: Object.assign(zhLocale, zh_CN)
}

export const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || DEFAULT_LANG,
  messages
})

locale.i18n((key, value) => i18n.t(key, value))

export default i18n
