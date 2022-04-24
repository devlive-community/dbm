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
            path: 'snippet',
            loadChildren: () => import('../pages/query/snippet/snippet.module').then(m => m.SnippetModule)
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
          },
          {
            path: 'metadata',
            loadChildren: () => import('../pages/management/metadata/metadata.module').then(m => m.MetadataModule)
          }
        ]
      },
      {
        path: 'tools',
        children: [
          {
            path: 'track',
            loadChildren: () => import('../pages/tools/track/track.module').then(m => m.TrackModule)
          },
          {
            path: 'migrte',
            loadChildren: () => import('../pages/tools/migrte/migrte.module').then(m => m.MigrateModule)
          }
        ]
      },
      {
        path: 'system',
        children: [
          {
            path: 'basic',
            loadChildren: () => import('../pages/system/basic/basic.module').then(m => m.BasicModule)
          },
          {
            path: 'editor',
            loadChildren: () => import('../pages/system/editor/system.editor.module').then(m => m.SystemEditorModule)
          }
        ]
      },
      {
        path: 'monitor',
        children: [
          {
            path: 'processor',
            loadChildren: () => import('../pages/monitor/processor/monitor.processor.module').then(m => m.MonitorProcessorModule)
          },
          {
            path: 'connection',
            loadChildren: () => import('../pages/monitor/connection/monitor.connection.module').then(m => m.MonitorConnectionModule)
          },
          {
            path: 'mutations',
            loadChildren: () => import('../pages/monitor/mutations/monitor.mutations.module').then(m => m.MonitorMutationsModule)
          },
          {
            path: 'query',
            loadChildren: () => import('../pages/monitor/query/monitor.query.module').then(m => m.MonitorQueryModule)
          }
        ]
      }
    ]
  }
];
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LayoutRouting = RouterModule.forChild(LAYOUT_ROUTES);
