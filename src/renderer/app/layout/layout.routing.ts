import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const LAYOUT_ROUTES: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomeModule)
      }
    ]
  }
];
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayoutRouting = RouterModule.forChild(LAYOUT_ROUTES);
