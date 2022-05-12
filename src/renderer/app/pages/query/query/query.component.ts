import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { QueryHistoryModel } from '@renderer/model/query.history.model';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StateEnum } from '@renderer/enum/state.enum';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { ResponseDataModel } from '@renderer/model/response.model';
import { SystemEditorModel } from '@renderer/model/system.model';
import { CommandModel } from '@renderer/model/command.model';
import { SnippetModel } from '@renderer/model/snippet.model';
import { ActionEnum } from '@renderer/enum/action.enum';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { KvModel } from '@renderer/model/kv.model';

@Component({
  selector: 'app-query',
  templateUrl: 'query.component.html'
})
export class QueryComponent extends BaseComponent implements AfterViewInit {
  @ViewChildren('codeEditors')
  private codeEditors: QueryList<ElementRef>;
  editorConfig: any;
  dataSources: DatasourceModel[];
  datasource: string;
  disabledButton = {
    execute: true,
    cancel: true
  };
  responseTableData: ResponseDataModel[] = new Array();
  executeCommands: CommandModel[] = new Array();
  editorContainers = [];
  resultContainers = [];
  loadingContainers = [];
  processorContainers = [];
  containerSelected = 0;
  codeSnippet = {
    disabled: false,
    value: SnippetModel
  };
  action: ActionEnum;
  actionComponent = ActionEnum;
  snippetValue: string;
  warningMessage: string;
  advancedConfiguration = {
    disabled: false,
    value: Array<KvModel>()
  };

  constructor(private editorService: EditorService,
              private datasourceService: DatasourceService,
              private queryService: QueryService,
              private messageService: NzMessageService,
              private modelService: NzModalService,
              private transactionService: TranslateService,
              private queryHistoryService: QueryHistoryService) {
    super();
    const cache = this.editorService.get() === null ? new SystemEditorModel() : this.editorService.get();
    this.editorConfig = Object.assign(this.editorService.getDefault(), cache);
    this.datasourceService.getAll().then(response => {
      this.dataSources = response;
    });
    this.editorContainers.push('Editor ' + 1);
    this.resultContainers.push('Editor ' + 1 + ' Result');
    this.loadingContainers.push({loading: false});
    this.responseTableData.push(new ResponseDataModel());
    this.processorContainers.push({icon: 'tint', color: '#2db7f5'});
    this.executeCommands.push(new CommandModel('EXPLAIN ...', 'EXPLAIN {0}'),
      new CommandModel('EXPLAIN AST ...', 'EXPLAIN AST {0}'),
      new CommandModel('EXPLAIN SYNTAX ...', 'EXPLAIN SYNTAX {0}'),
      new CommandModel('EXPLAIN PLAN ...', 'EXPLAIN PLAN {0}'),
      new CommandModel('EXPLAIN PIPELINE ...', 'EXPLAIN PIPELINE {0}'),
      new CommandModel('EXPLAIN ESTIMATE ...', 'EXPLAIN ESTIMATE {0}'),
      new CommandModel('EXPLAIN TABLE OVERRIDE ...', 'EXPLAIN TABLE OVERRIDE {0}'));
    this.advancedConfiguration.value.push(new KvModel());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
      // const queryInstance = this;
      codeMirror.on('inputRead', () => {
        codeMirror.showHint();
      })
      codeMirror.addKeyMap({
        'Ctrl-Enter': function(cm) {
          // queryInstance.handlerExecute(null);
          // Call the click method with the fetch element tag
          document.getElementById('executeButton').click();
        }
      });
    }, 0);
  }

  handlerCheckStatus() {
    const status = StringUtils.isEmpty(this.datasource);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    status === true ? this.disabledButton.execute = true : this.disabledButton.execute = false;
  }

  handlerExecute(command?: CommandModel) {
    this.warningMessage = null;
    this.disabledButton.execute = true;
    this.disabledButton.cancel = false;
    this.loading.button = true;
    this.loadingContainers[this.containerSelected].loading = true;
    const queryHistory = new QueryHistoryModel();
    queryHistory.createdTime = Date.parse(new Date().toString());
    const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
    let sql = codeMirror.getValue();
    if (StringUtils.isNotEmpty(codeMirror.getSelection())) {
      sql = codeMirror.getSelection();
    }
    if (command?.name) {
      sql = StringUtils.format(command.format, [sql]);
    }
    queryHistory.startTime = Date.parse(new Date().toString());
    const request = new RequestModel();
    this.datasourceService.findByAlias(this.datasource).then(response => {
      request.config = response;
      queryHistory.server = this.datasource;
      queryHistory.query = sql;
      this.processorContainers[this.containerSelected].icon = 'spinner fa-spin';
      this.processorContainers[this.containerSelected].color = 'cyan';
      const applyParams = this.advancedConfiguration.value
      .filter(item => StringUtils.isNotEmpty(item.key) || StringUtils.isNotEmpty(item.value));
      if (applyParams.length > 0) {
        request.params = applyParams;
      }
      this.queryService.getResponse(request, sql).then(response => {
        if (response.status) {
          queryHistory.state = StateEnum.success;
          this.processorContainers[this.containerSelected].icon = 'check-circle';
          this.processorContainers[this.containerSelected].color = '#87d068';
          if (response.data) {
            this.responseTableData[this.containerSelected] = response.data;
          } else {
            this.messageService.success('Operation is successful!');
          }
        } else {
          this.warningMessage = response.message;
          queryHistory.message = response.message;
          queryHistory.state = StateEnum.failure;
          this.processorContainers[this.containerSelected].icon = 'times-circle';
          this.processorContainers[this.containerSelected].color = '#f50';
        }
        this.disabledButton.execute = false;
        this.loadingContainers[this.containerSelected].loading = false;
        this.loading.button = false;
        this.disabledButton.cancel = true;
        queryHistory.endTime = Date.parse(new Date().toString());
        queryHistory.elapsedTime = queryHistory.endTime - queryHistory.startTime;
        this.queryHistoryService.save(queryHistory);
      });
    });
  }

  handlerFormatter() {
    const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
    codeMirror.setValue(SqlUtils.formatter(codeMirror.getValue(), this.editorConfig));
  }

  handlerCancel() {
    this.loadingContainers[this.containerSelected].loading = false;
    this.disabledButton.execute = false;
    this.loading.button = false;
    this.disabledButton.cancel = true;
    this.processorContainers[this.containerSelected].icon = 'ban';
    this.processorContainers[this.containerSelected].color = '#f50';
  }

  handlerAddContainer() {
    this.editorContainers.push('Editor ' + (this.editorContainers.length + 1));
    this.containerSelected = this.editorContainers.length;
    this.resultContainers.push('Editor ' + this.containerSelected + ' Result');
    this.loadingContainers.push({loading: false});
    this.responseTableData.push(new ResponseDataModel());
    this.processorContainers.push({icon: 'tint', color: '#2db7f5'});
    this.ngAfterViewInit();
  }

  handlerCloseContainer({index}: { index: number }) {
    this.editorContainers.splice(index, 1);
    this.resultContainers.splice(index, 1);
    this.responseTableData.splice(index, 1);
    this.loadingContainers.splice(index, 1);
    this.processorContainers.splice(index, 1);
  }

  handlerQuickQuery(close?: boolean) {
    if (close) {
      this.dialog.select = false;
    } else {
      this.dialog.select = true;
    }
  }

  handlerQuickQueryProcessor(sql?: string) {
    const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
    codeMirror.setValue(sql);
  }

  handlerExecuteCommand(command: CommandModel) {
    this.handlerExecute(command);
  }

  handlerCodeSnippet(close?: boolean) {
    if (close) {
      this.codeSnippet.disabled = false;
    } else {
      this.codeSnippet.disabled = true;
    }
  }

  handlerAdvancedConfiguration(close?: boolean) {
    if (close) {
      this.advancedConfiguration.disabled = false;
    } else {
      this.advancedConfiguration.disabled = true;
    }
  }

  handlerAddAdvancedConfiguration() {
    this.advancedConfiguration.value.push(new KvModel());
  }

  handlerRemoveAdvancedConfiguration(index: number) {
    this.advancedConfiguration.value.splice(index, 1);
  }

  handlerCodeSnippetProcessor(sql?: string) {
    const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
    codeMirror.setValue(sql);
  }

  handlerShowCreateSnippet(type: ActionEnum): void {
    this.dialog.create = true;
    this.action = type;
    this.snippetValue = this.codeEditors.get(this.containerSelected)['codeMirror'].getValue();
  }

  handlerCloseCreateSnippet(event: boolean) {
    this.dialog.create = false;
  }

  handlerCloseAlert() {
    this.warningMessage = null;
  }

  handlerShowMoreEllipsis() {
    this.modelService.error({
      nzWidth: '80%',
      nzKeyboard: false,
      nzMaskClosable: false,
      nzOkText: this.transactionService.instant('common.ok'),
      nzContent: this.warningMessage
    });
  }
}
