import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { ActionEnum } from "@renderer/enum/action.enum";
import { TypeEnum } from "@renderer/enum/type.enum";

@Component({
  selector: 'object-designer-layout-header-database',
  templateUrl: './header.database.view.html',
  styleUrls: ['./header.database.style.scss']
})
export class LayoutHeaderDatabaseComponent {
  @Input()
  applyData: DesignerApplyData;

  @Output()
  emitter = new EventEmitter<DesignerApplyData>;

  constructor() {
  }

  handlerNewTable() {
    this.applyData.command.action = ActionEnum.create;
    this.applyData.command.type = TypeEnum.table;
    this.emitter.emit(this.applyData);
  }
}
