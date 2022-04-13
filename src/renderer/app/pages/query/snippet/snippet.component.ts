import { Component } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ActionEnum } from '@renderer/enum/action.enum';
import { SnippetModel } from '@renderer/model/snippet.model';
import { SystemEditorModel } from '@renderer/model/system.model';
import { EditorService } from '@renderer/services/editor/editor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnippetService } from '@renderer/services/snippet/snippet.service';

@Component({
  selector: 'app-query-snippet',
  templateUrl: 'snippet.component.html'
})
export class SnippetComponent extends BaseComponent {
  configuration: Config;
  columns: any[] = new Array();
  headers: Columns[] = new Array();
  action = ActionEnum;
  snippet: SnippetModel;
  editorConfig: any;
  validateForm!: FormGroup;
  selectRow: SnippetModel;

  constructor(private editorService: EditorService,
              private modal: NzModalService,
              private formBuilder: FormBuilder,
              private snippetService: SnippetService,
              private messageService: NzMessageService,
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
    const created = this.translateService.instant('common.created');
    this.headers.push({key: created, title: created});
    const updated = this.translateService.instant('common.updated');
    this.headers.push({key: updated, title: updated});
    this.configuration = {...DefaultConfig};
    this.configuration.horizontalScroll = true;
    this.configuration.orderEnabled = false;
    this.configuration.paginationRangeEnabled = false;
    const cache = this.editorService.get() === null ? new SystemEditorModel() : this.editorService.get();
    this.editorConfig = Object.assign(this.editorService.getDefault(), cache);
    this.handlerRestValidator();
    this.initialize();
  }

  initialize() {
    this.snippetService.getAll()
    .then(response => {
      if (response.length > 0) {
        this.columns = response;
      }
    })
    .catch(() => {
      this.messageService.error(this.translateService.instant('common.error'));
    });
    ;
  }

  handlerRestValidator(): void {
    this.validateForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      code: [null, [Validators.required]]
    });
  }

  handlerShowDrawer(type: ActionEnum): void {
    this.dialog.create = true;
    this.handlerRestValidator();
    switch (type) {
      case ActionEnum.create:
        this.snippet = new SnippetModel();
        break;
    }
  }

  handlerCloseDrawer(): void {
    this.dialog.create = false;
    this.snippet = null;
    this.validateForm = null;
  }

  handlerSave(): void {
    if (this.validateForm.valid) {
      this.snippetService.save(this.snippet)
      .then(() => {
        this.messageService.success(this.translateService.instant('common.success'));
        this.handlerCloseDrawer();
        this.initialize();
      })
      .catch(() => {
        this.messageService.error(this.translateService.instant('common.error'));
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  handlerShowModal(row: SnippetModel): void {
    this.dialog.select = true;
    this.selectRow = row;
  }

  handlerCloseModal(): void {
    this.dialog.select = false;
  }
}
