import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { DatasourceService } from "@renderer/services/management/datasource.service";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { TypeEnum } from "@renderer/enum/type.enum";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";

@Component({
  selector: 'object-designer-layout-header',
  templateUrl: './layout.header.view.html',
  styleUrls: ['./layout.header.style.scss']
})
export class LayoutHeaderComponent implements AfterViewInit {
  protected applyDataSource = {
    current: null,
    list: []
  }
  actionType = TypeEnum;

  @Input()
  applyData: DesignerApplyData;

  @Output()
  emitter = new EventEmitter<string>();

  constructor(private dataSourceService: DatasourceService) {
  }

  ngAfterViewInit(): void {
    this.dataSourceService.getAll().then(response => {
      this.applyDataSource.list = response.filter(value => value.type === DatabaseEnum.clickhosue);
    });
  }

  handlerDataSourceChange(value: string) {
    this.emitter.emit(value);
  }
}
