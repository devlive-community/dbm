import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { DatasourceService } from "@renderer/services/management/datasource.service";
import { DatabaseEnum } from "@renderer/enum/database.enum";
import { TypeEnum } from "@renderer/enum/type.enum";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { ActionEnum } from "@renderer/enum/action.enum";
import { AssertUtils } from "@renderer/app/views/object_designer/utils/assert.utils";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";

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
  @Input()
  applyColumns: DesignerColumn[];
  @Output()
  emitter = new EventEmitter<string>();
  @Output()
  emitterColumns = new EventEmitter<DesignerColumn[]>;

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

  handlerEmitterColumns(applyColumns: DesignerColumn[]) {
    this.emitterColumns.emit(applyColumns);
  }

  isNoneDatabase(): boolean {
    return this.applyData.type === TypeEnum.database
      && this.applyData.isOpen
      && this.applyData.command.action === ActionEnum.none;
  }

  isCreateTable(): boolean {
    return AssertUtils.isCreateTable(this.applyData);
  }
}
