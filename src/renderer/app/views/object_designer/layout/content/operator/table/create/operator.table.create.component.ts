import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";
import { S2CellType, S2Event, TableSheet } from "@antv/s2";
import { debounce } from 'lodash';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'object-designer-layout-content-operator-table-create',
  templateUrl: './operator.table.create.view.html',
  styleUrls: ['./operator.table.create.style.scss']
})
export class LayoutContentOperatorTableCreateComponent{
  private _applyColumns: DesignerColumn[];
  @ViewChild("inputColumnContainer")
  inputColumnContainer: ElementRef;

  @Input()
  applyData: DesignerApplyData;

  @Input()
  get applyColumns(): DesignerColumn[] {
    return this._applyColumns;
  }

  set applyColumns(applyColumns: DesignerColumn[]) {
    this._applyColumns = applyColumns;
    if (applyColumns.length > 0) {
      this.handlerDrawColumn();
    }
  }

  @Output()
  emitter = new EventEmitter<any[]>;

  columnInfoVisible = {
    input: true
  };
  tableSheet: TableSheet;
  cell: S2CellType;

  constructor(private translateService: TranslateService) {
  }

  handlerDrawColumn() {
    const container = document.getElementById('tableColumnsContainer');
    container.innerHTML = '';
    const s2Options = {
      width: this.applyData.width - 205,
      height: this.applyData.height,
    }
    const s2DataConfig = {
      fields: {
        columns: ['name', 'type', 'length', 'isNull', 'isPrimaryKey', 'comment'],
      },
      meta: [{
        field: 'name',
        name: this.translateService.instant('common.name'),
      }, {
        field: 'type',
        name: this.translateService.instant('common.type'),
      }, {
        field: 'length',
        name: this.translateService.instant('common.length'),
      }, {
        field: 'isNull',
        name: this.translateService.instant('common.is_null'),
      }, {
        field: 'isPrimaryKey',
        name: this.translateService.instant('common.key'),
      }, {
        field: 'comment',
        name: this.translateService.instant('common.comment'),
      }],
      data: JSON.parse(JSON.stringify(this.applyColumns))
    };
    this.tableSheet = new TableSheet(container, s2DataConfig, s2Options);
    this.tableSheet.setThemeCfg({name: 'gray'});
    const debounceRender = debounce((width, height) => {
      this.tableSheet.changeSheetSize(width, height)
      this.tableSheet.render(false);
    }, 0)
    new ResizeObserver(([entry] = []) => {
      debounceRender(this.applyData.width - 205, this.applyData.height);
    }).observe(document.body);

    this.tableSheet.on(S2Event.DATA_CELL_CLICK, (event) => {
      if (!this.columnInfoVisible.input) {
        this.handlerInputBlur();
      }

      this.columnInfoVisible.input = false;
      this.cell = this.tableSheet.getCell(event.target);
      const meta = this.cell.getMeta();
      // The X and Y axes need to add the left and top pixel values
      this.inputColumnContainer.nativeElement.style.left = (meta.x + 201) + 'px';
      this.inputColumnContainer.nativeElement.style.top = (meta.y + 73) + 'px';
      this.inputColumnContainer.nativeElement.style.width = meta.width + 'px';
      this.inputColumnContainer.nativeElement.style.height = meta.height + 'px';
      this.inputColumnContainer.nativeElement.value = meta.fieldValue;
      this.inputColumnContainer.nativeElement.focus({preventScroll: true});
    });

    this.tableSheet.render();
  }

  handlerInputBlur() {
    if (this.tableSheet && this.cell) {
      const {rowIndex, valueField} = this.cell.getMeta();
      this.tableSheet.dataSet.originData[rowIndex][valueField] = this.inputColumnContainer.nativeElement.value;
      this.tableSheet.render(true);
      this.columnInfoVisible.input = true;
      this.inputColumnContainer.nativeElement.value = '';
    }
    this.emitter.emit(this.tableSheet.dataSet.originData);
  }
}
