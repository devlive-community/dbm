import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { SqlUtils } from '@renderer/utils/sql.utils';
import { QueryHistoryModel } from '@renderer/model/query.history.model';
import { Md5 } from 'ts-md5';
import { QueryHistoryService } from '@renderer/services/query/query.history.service';
import { StateEnum } from '@renderer/enum/state.enum';

@Component({
  selector: 'app-query',
  templateUrl: 'query.component.html'
})
export class QueryComponent extends BaseComponent {
  @ViewChild('codeEditor')
  private codeEditor;
  editorConfig: any;
  datasources: DatasourceModel[];
  datasource: string;
  disabledButton = {
    execute: true
  };
  responseTableData: any;

  constructor(private editorService: EditorService,
              private datasourceService: DatasourceService,
              private queryService: QueryService,
              private queryHistoryService: QueryHistoryService) {
    super();
    this.editorConfig = this.editorService.getDefault();
    this.datasources = this.datasourceService.getAll()?.data?.columns;
  }

  handlerCheckStatus() {
    const status = StringUtils.isEmpty(this.datasource);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    status === true ? this.disabledButton.execute = true : this.disabledButton.execute = false;
  }

  handlerExecute(sql?: string) {
    const queryHistory = new QueryHistoryModel();
    queryHistory.id = Md5.hashStr(sql + new Date());
    queryHistory.query = sql;
    queryHistory.startTime = Date.parse(new Date().toString());
    const request = new RequestModel();
    this.responseTableData = null;
    request.config = this.datasourceService.getAll(this.datasource)?.data?.columns[0];
    queryHistory.server = this.datasource;
    sql = StringUtils.isEmpty(sql) ? this.codeEditor.codeMirror.getValue() : sql;
    this.queryService.getResponse(request, sql).then(response => {
      if (response.status) {
        this.responseTableData = response.data;
        queryHistory.state = StateEnum.success;
      } else {
        // this.toastrService.error(response.message);
        queryHistory.message = response.message;
        queryHistory.state = StateEnum.failure;
      }
      queryHistory.endTime = Date.parse(new Date().toString());
      queryHistory.elapsedTime = queryHistory.endTime - queryHistory.startTime;
      this.queryHistoryService.save(queryHistory);
    });
  }

  handlerSelectionExecute() {
    this.handlerExecute(this.codeEditor.codeMirror.getSelection());
  }

  handlerFormatter() {
    this.codeEditor.codeMirror.setValue(SqlUtils.formatter(this.codeEditor.codeMirror.getValue()));
  }
}
