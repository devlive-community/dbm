import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";

@Component({
  selector: 'object-designer-layout-content-operator-table-create',
  templateUrl: './operator.table.create.view.html',
  styleUrls: ['./operator.table.create.style.scss']
})
export class LayoutContentOperatorTableCreateComponent {
  private _applyColumns: DesignerColumn[];

  @Input()
  applyData: DesignerApplyData;

  @Input()
  get applyColumns(): DesignerColumn[] {
    return this._applyColumns;
  }

  set applyColumns(applyColumns: DesignerColumn[]) {
    this._applyColumns = applyColumns;
  }

  @Output()
  emitter = new EventEmitter<any[]>;

  constructor() {
  }
}
