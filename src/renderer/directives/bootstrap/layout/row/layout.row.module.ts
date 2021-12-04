import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutRowComponent } from './layout.row.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LayoutRowComponent
  ],
  exports: [
    LayoutRowComponent
  ],
  providers: []
})
export class LayoutRowModule {
}
