export class EditorService {
  getDefault(): any {
    return {
      lineNumbers: true,
      mode: 'sql',
      lineWrapping: true,
      styleActiveLine: true,
      foldGutter: true,
      lineComment: ['\/\/'],
      keyMap: 'sublime',
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
    };
  }
}
