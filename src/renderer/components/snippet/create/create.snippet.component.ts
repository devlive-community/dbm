import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { ActionEnum } from '@renderer/enum/action.enum';
import { SnippetModel } from '@renderer/model/snippet.model';
import { SystemEditorModel } from '@renderer/model/system.model';
import { EditorService } from '@renderer/services/editor/editor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnippetService } from '@renderer/services/snippet/snippet.service';
import { StringUtils } from '@renderer/utils/string.utils';

@Component({
  selector: 'app-component-create-snippet',
  templateUrl: 'create.snippet.component.html'
})
export class CreateSnippetComponent extends BaseComponent implements AfterViewInit {
  @Input()
  visible: boolean;
  @Input()
  action: ActionEnum;
  @Input()
  snippetValue?: string;
  @Input()
  snippetComponent?: SnippetModel;
  @Output()
  emitter = new EventEmitter<boolean>();
  snippet: SnippetModel;
  editorConfig: any;
  validateForm!: FormGroup;

  constructor(private editorService: EditorService,
              private modal: NzModalService,
              private formBuilder: FormBuilder,
              private snippetService: SnippetService,
              private messageService: NzMessageService,
              private translateService: TranslateService) {
    super();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialize();
    }, 0);
  }

  initialize() {
    const cache = this.editorService.get() === null ? new SystemEditorModel() : this.editorService.get();
    this.editorConfig = Object.assign(this.editorService.getDefault(), cache);
    this.handlerShowDrawer(this.action);
  }

  handlerRestValidator(): void {
    this.validateForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      code: [null, [Validators.required]]
    });
  }

  handlerShowDrawer(type: ActionEnum): void {
    this.handlerRestValidator();
    switch (type) {
      case ActionEnum.create:
        this.snippet = new SnippetModel();
        if (this.snippetValue) {
          this.snippet.code = this.snippetValue;
        }
        break;
      case ActionEnum.update:
        this.snippet = this.snippetComponent;
    }
  }

  handlerCloseDrawer(close?: boolean): void {
    this.snippet = null;
    this.validateForm = null;
    if (StringUtils.isEmpty(close)) {
      this.emitter.emit(false);
    }
    this.emitter.emit(close);
  }

  handlerSave(): void {
    if (this.validateForm.valid) {
      if (this.action === ActionEnum.create) {
        this.snippetService.save(this.snippet)
        .then(() => {
          this.messageService.success(this.translateService.instant('common.success'));
          this.handlerCloseDrawer(true);
        })
        .catch(() => {
          this.messageService.error(this.translateService.instant('common.error'));
        });
      } else {
        this.snippetService.update(this.snippet)
        .then(() => {
          this.messageService.success(this.translateService.instant('common.success'));
          this.handlerCloseDrawer(true);
        })
        .catch(error => {
          this.messageService.error(error);
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }
}
