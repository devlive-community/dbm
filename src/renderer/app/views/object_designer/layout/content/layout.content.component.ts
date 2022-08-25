import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { TypeEnum } from "@renderer/enum/type.enum";
import { DesignerColumn } from "@renderer/app/views/object_designer/model/designer.column";
import { AssertUtils } from "@renderer/app/views/object_designer/utils/assert.utils";

@Component({
  selector: 'object-designer-layout-content',
  templateUrl: './layout.content.view.html',
  styleUrls: ['./layout.content.style.scss']
})
export class LayoutContentComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;
  @Input()
  applyColumns: DesignerColumn[];

  @Output()
  emitter = new EventEmitter<DesignerColumn[]>;

  actionType = TypeEnum;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.handlerInitialize();
  }

  handlerInitialize() {
  }

  isCreateTable(): boolean {
    return AssertUtils.isCreateTable(this.applyData);
  }

  handlerForward(event: any[]) {
    this.applyColumns = event;
    this.emitter.emit(this.applyColumns);
  }
}
