import { Component, OnInit } from '@angular/core';
import { DatasourceModel } from '@renderer/model/datasource.model';

@Component({
  selector: 'app-management-datasource',
  templateUrl: 'datasource.component.html'
})
export class DatasourceComponent implements OnInit {
  formInfo: DatasourceModel;

  ngOnInit() {
    this.formInfo = new DatasourceModel();
  }
}
