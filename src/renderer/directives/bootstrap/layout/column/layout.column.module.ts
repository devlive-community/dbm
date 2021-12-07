import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutColumnComponent } from './layout.column.component';
import { FormsModule } from '@angular/forms';
import { LayoutRowComponent } from '@renderer/directives/bootstrap/layout/row/layout.row.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LayoutColumnComponent
  ],
  exports: [
    LayoutColumnComponent
  ],
  providers: [
    LayoutRowComponent
  ]
})
export class LayoutColumnModule {
}
