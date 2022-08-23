import { AfterViewInit, Component, Input } from "@angular/core";
import { DesignerApplyData } from "@renderer/app/views/object_designer/model/designer.apply.data";
import { TypeEnum } from "@renderer/enum/type.enum";

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'object-designer-layout-content',
  templateUrl: './layout.content.view.html',
  styleUrls: ['./layout.content.style.scss']
})
export class LayoutContentComponent implements AfterViewInit {
  @Input()
  applyData: DesignerApplyData;

  actionType = TypeEnum;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.handlerInitialize();
  }

  handlerInitialize() {
  }
}
