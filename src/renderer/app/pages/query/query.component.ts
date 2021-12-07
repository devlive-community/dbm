import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';
import { EditorService } from '@renderer/services/editor/editor.service';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { DatasourceModel } from '@renderer/model/datasource.model';
import { QueryService } from '@renderer/services/query/query.service';
import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';
import { ToastrService } from 'ngx-toastr';

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
              private toastrService: ToastrService) {
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
    const request = new RequestModel();
    this.responseTableData = null;
    request.config = this.datasourceService.getAll(this.datasource)?.data?.columns[0];
    sql = StringUtils.isEmpty(sql) ? this.codeEditor.codeMirror.getValue() : sql;
    this.queryService.getResponse(request, sql).then(response => {
      if (response.status) {
        this.responseTableData = response.data;
      } else {
        this.toastrService.error(response.message);
      }
    });
  }

  handlerSelectionExecute() {
    this.handlerExecute(this.codeEditor.codeMirror.getSelection());
  }
}
