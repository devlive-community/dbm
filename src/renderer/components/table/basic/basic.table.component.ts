import { Component, Input } from '@angular/core';
import { BaseComponent } from '@renderer/app/base.component';

const minAndMax = 3000;

@Component({
  selector: 'app-component-basic-table',
  templateUrl: './basic.table.component.html'
})
export class BasicTableComponent extends BaseComponent {
  @Input()
  value: { headers: { name: string; value: string }[], columns: [] };

  constructor() {
    super();
  }

  handlerAnalysisWidth(): number {
    let width = this.value?.columns.length * 100 + 360;
    if (width > minAndMax) {
      width = minAndMax;
    }
    return width;
  }
}
