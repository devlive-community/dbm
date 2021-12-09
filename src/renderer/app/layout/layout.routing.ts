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
      },
      {
        path: 'query',
        children: [
          {
            path: 'query',
            loadChildren: () => import('../pages/query/query/query.module').then(m => m.QueryModule)
          },
          {
            path: 'history',
            loadChildren: () => import('../pages/query/history/history.module').then(m => m.HistoryModule)
          }
        ]
      },
      {
        path: 'management',
        children: [
          {
            path: 'datasource',
            loadChildren: () => import('../pages/management/datasource/datasource.module').then(m => m.DatasourceModule)
          }
        ]
      }
    ]
  }
];
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayoutRouting = RouterModule.forChild(LAYOUT_ROUTES);
