import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule
  ],
  declarations: [
    TableComponent
  ],
  exports: [
    TableComponent
  ],
  providers: []
})
export class TableModule {
}
