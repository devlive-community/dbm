import { BaseComponent } from '@renderer/app/base.component';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SnippetService } from '@renderer/services/snippet/snippet.service';
import { SnippetModel } from '@renderer/model/snippet.model';
import { TranslateService } from '@ngx-translate/core';
import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { SystemEditorModel } from '@renderer/model/system.model';
import { EditorService } from '@renderer/services/editor/editor.service';

@Component({
  selector: 'app-component-quote-snippet',
  templateUrl: './quote.snippet.component.html'
})
export class QuoteSnippetComponent extends BaseComponent {
  @ViewChild('table')
  table: APIDefinition;
  @Input()
  visible: boolean;
  @Output()
  emitter = new EventEmitter<any>();
  @Output()
  emitterValue = new EventEmitter<any>();
  configuration: Config;
  columns: SnippetModel[] = new Array();
  headers: Columns[] = new Array();
  toggledRows = new Set<number>();
  tableWidth = '100%';
  editorConfig: any;

  constructor(private snippetService: SnippetService,
              private messageService: NzMessageService,
              private editorService: EditorService,
              private translateService: TranslateService) {
    super();
    const id = this.translateService.instant('common.id');
    this.headers.push({key: id, title: id});
    const name = this.translateService.instant('common.name');
    this.headers.push({key: name, title: name});
    const description = this.translateService.instant('common.description');
    this.headers.push({key: description, title: description});
    const code = this.translateService.instant('common.code');
    this.headers.push({key: code, title: code});
    const action = this.translateService.instant('common.action');
    this.headers.push({key: action, title: action});
    this.configuration = {...DefaultConfig};
    this.configuration.horizontalScroll = true;
    this.configuration.orderEnabled = false;
    this.configuration.paginationRangeEnabled = false;
    this.configuration.detailsTemplate = true;
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
    $event.preventDefault();
    this.table.apiEvent({
      type: API.toggleRowIndex,
      value: index
    });
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
