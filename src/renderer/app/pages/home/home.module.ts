import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const HOME_ROUTES: Routes = [
  {path: '', component: HomeComponent}
];

@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(HOME_ROUTES)
  ],
  exports: [],
  declarations: [
    HomeComponent
  ],
  providers: []
})
// @ts-ignore
export class HomeModule {
}
