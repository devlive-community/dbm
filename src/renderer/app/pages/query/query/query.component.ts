import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { QueryHistoryModel } from '@renderer/model/query.history.model';
import { Md5 } from 'ts-md5';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StateEnum } from '@renderer/enum/state.enum';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { ResponseDataModel } from '@renderer/model/response.model';

@Component({
  selector: 'app-query',
  templateUrl: 'query.component.html'
})
export class QueryComponent extends BaseComponent {
  @ViewChildren('codeEditors')
  private codeEditors: QueryList<ElementRef>;
  editorConfig: any;
  dataSources: DatasourceModel[];
  datasource: string;
  disabledButton = {
    execute: true
  };
  responseTableData: ResponseDataModel[] = new Array();
  editorContainers = [];
  resultContainers = [];
  loadingContainers = [];
  containerSelected = 0;

  constructor(private editorService: EditorService,
              private datasourceService: DatasourceService,
              private queryService: QueryService,
              private messageService: NzMessageService,
              private queryHistoryService: QueryHistoryService) {
    super();
    this.editorConfig = this.editorService.getDefault();
    this.dataSources = this.datasourceService.getAll()?.data?.columns;
    this.editorContainers.push('Editor ' + 1);
    this.resultContainers.push('Editor ' + 1 + ' Result');
    this.loadingContainers.push({loading: false});
    this.responseTableData.push(new ResponseDataModel());
  }

  handlerCheckStatus() {
    const status = StringUtils.isEmpty(this.datasource);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    status === true ? this.disabledButton.execute = true : this.disabledButton.execute = false;
  }

  handlerExecute(sql?: string) {
    this.disabledButton.execute = true;
    this.loading.button = true;
    this.loadingContainers[this.containerSelected].loading = true;
    const queryHistory = new QueryHistoryModel();
    queryHistory.id = Md5.hashStr(sql + new Date());
    queryHistory.startTime = Date.parse(new Date().toString());
    const request = new RequestModel();
    request.config = this.datasourceService.getAll(this.datasource)?.data?.columns[0];
    queryHistory.server = this.datasource;
    sql = StringUtils.isEmpty(sql) ? this.codeEditors.get(this.containerSelected)['codeMirror'].getValue() : sql;
    queryHistory.query = sql;
    this.queryService.getResponse(request, sql).then(response => {
      if (response.status) {
        queryHistory.state = StateEnum.success;
        if (response.data) {
          this.responseTableData[this.containerSelected] = response.data;
        } else {
          this.messageService.success('Operation is successful!');
        }
      } else {
        this.messageService.error(response.message);
        queryHistory.message = response.message;
        queryHistory.state = StateEnum.failure;
      }
      this.disabledButton.execute = false;
      this.loadingContainers[this.containerSelected].loading = false;
      this.loading.button = false;
      queryHistory.endTime = Date.parse(new Date().toString());
      queryHistory.elapsedTime = queryHistory.endTime - queryHistory.startTime;
      this.queryHistoryService.save(queryHistory);
    });
  }

  handlerSelectionExecute() {
    const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
    this.handlerExecute(codeMirror.getSelection());
  }

  handlerFormatter() {
    const codeMirror = this.codeEditors.get(this.containerSelected)['codeMirror'];
    codeMirror.setValue(SqlUtils.formatter(codeMirror.getValue()));
  }

  handlerAddContainer() {
    this.editorContainers.push('Editor ' + (this.editorContainers.length + 1));
    this.containerSelected = this.editorContainers.length;
    this.resultContainers.push('Editor ' + this.containerSelected + ' Result');
    this.loadingContainers.push({loading: false});
    this.responseTableData.push(new ResponseDataModel());
  }

  handlerCloseContainer({index}: { index: number }) {
    this.editorContainers.splice(index, 1);
    this.resultContainers.splice(index, 1);
    this.responseTableData.splice(index, 1);
    this.loadingContainers.splice(index, 1);
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
    console.log(sql);
    codeMirror.setValue(sql);
  }
}
