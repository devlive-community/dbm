import { BaseComponent } from '@renderer/app/base.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SnippetService } from '@renderer/services/snippet/snippet.service';
import { SnippetModel } from '@renderer/model/snippet.model';
import { TranslateService } from '@ngx-translate/core';
import { SystemEditorModel } from '@renderer/model/system.model';
import { EditorService } from '@renderer/services/editor/editor.service';

@Component({
  selector: 'app-component-quote-snippet',
  templateUrl: './quote.snippet.component.html'
})
export class QuoteSnippetComponent extends BaseComponent {
  @Input()
  visible: boolean;
  @Output()
  emitter = new EventEmitter<any>();
  @Output()
  emitterValue = new EventEmitter<any>();
  columns: SnippetModel[] = new Array();
  toggledRows = new Set<number>();
  tableWidth = '100%';
  editorConfig: any;

  constructor(private snippetService: SnippetService,
              private messageService: NzMessageService,
              private editorService: EditorService,
              private translateService: TranslateService) {
    super();
    const cache = this.editorService.get() === null ? new SystemEditorModel() : this.editorService.get();
    this.editorConfig = Object.assign(this.editorService.getDefault(), cache);
    this.editorConfig.readOnly = true;
    this.initialize();
  }

  initialize() {
    this.snippetService.getAll()
    .then((snippets: SnippetModel[]) => {
      this.columns = snippets;
    })
    .catch(() => {
      this.messageService.error(this.translateService.instant('common.error'));
    });
  }

  handlerCancel() {
    this.visible = false;
    this.emitter.emit(this.visible);
  }

  handlerRowToggled($event: MouseEvent, index: number): void {
    if (this.toggledRows.has(index)) {
      this.toggledRows.delete(index);
    } else {
      this.toggledRows.add(index);
    }
    this.tableWidth = document.getElementById('table')?.offsetWidth - 15 + 'px';
  }

  handlerRowSelectedQuote(snippet: SnippetModel): void {
    this.emitterValue.emit(snippet.code);
    this.handlerCancel();
  }
}
