<template>
  <textarea ref='mycode' class='codesql' v-model='value'></textarea>
</template>

<script>
import 'codemirror/theme/ambiance.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'

const CodeMirror = require('codemirror/lib/codemirror')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/sql/sql')
require('codemirror/addon/hint/show-hint')
require('codemirror/addon/hint/sql-hint')

export default {
  name: 'code-mirror',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this._initialize()
  },
  methods: {
    _initialize() {
      const mime = 'text/x-mariadb'
      const defaultConfig = {
        mode: mime,
        indentWithTabs: true,
        smartIndent: true,
        lineNumbers: true,
        matchBrackets: true
      }
      this.editor = CodeMirror.fromTextArea(this.$refs.mycode, Object.assign(this.config, defaultConfig))
    }
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.editor.setValue(this.value)
      }
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }
</style>
