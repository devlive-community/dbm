import Vue from 'vue'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sql/sql'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/addon/comment/comment'
import 'codemirror/keymap/sublime'

import VueCodemirror from 'vue-codemirror'

import theme from './theme'

import Support from '../store/Support'

const StringUtils = require('../utils/StringUtils')

const token = Support.SETTING

const setting = JSON.parse(localStorage.getItem(StringUtils.format('{0}_{1}', [token, 'Editor'])))

const defaultOptions = {
  styleActiveLine: true,
  lineNumbers: true,
  line: true,
  lineComment: ['\/\/'],
  keyMap: 'sublime',
  mode: 'sql'
}

Object.assign(defaultOptions, setting)

theme.forEach(v => {
  import('codemirror/theme/' + v)
})

Vue.use(VueCodemirror, {
  options: defaultOptions
})
