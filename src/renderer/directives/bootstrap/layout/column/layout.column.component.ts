import { Component, Input } from '@angular/core';

@Component({
  selector: 'dbm-layout-column',
  templateUrl: './layout.column.component.html'
})
export class LayoutColumnComponent {
  @Input()
  span: number = 1;
}
