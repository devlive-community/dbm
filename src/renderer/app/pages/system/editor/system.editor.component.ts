import { Component, DoCheck } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { SystemEditorModel } from '@renderer/model/system.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EditorService } from '@renderer/services/editor/editor.service';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { EditorThemeEnum } from '@renderer/enum/editor/theme.enum';
import { EditorLanguageEnum } from '@renderer/enum/editor/language.enum';

@Component({
  selector: 'app-system-editor',
  templateUrl: 'system.editor.component.html'
})
export class SystemEditorComponent extends BaseComponent implements DoCheck {
  model: SystemEditorModel;
  editor = {
    context: null,
    config: this.editorService.getDefault()
  };
  themes: string[] = new Array();
  languages: string[] = new Array();
  sqlTemplate = 'select name as `Name` \n' +
    'from (\n' +
    '  select name \n' +
    '  from db.tb\n' +
    ') where id > 1 \n' +
    'group by name \n' +
    'order by name \n' +
    'limit 10';

  constructor(private editorService: EditorService,
              private messageService: NzMessageService) {
    super();
    this.model = this.editorService.get() === null ? new SystemEditorModel() : this.editorService.get();
    this.editor.context = SqlUtils.formatter(this.sqlTemplate,
      this.editor.config = Object.assign(this.editor.config, this.model));
    Object.keys(EditorThemeEnum).forEach(value => {
      this.themes.push(value);
    });
    Object.keys(EditorLanguageEnum).forEach(value => {
      this.languages.push(value);
    });
  }

  handlerSave() {
    this.editorService.save(this.model);
    this.messageService.success('Save Successful!');
  }

  ngDoCheck(): void {
    this.editor.config = Object.assign(this.editor.config, this.model);
    this.editor.context = SqlUtils.formatter(this.editor.context, this.editor.config);
  }
}
