import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';

import 'brace';
import 'brace/mode/sql';
import 'brace/ext/language_tools';
import 'brace/ext/static_highlight';
import 'brace/ext/statusbar';
import 'brace/ext/beautify';
import 'brace/theme/eclipse';
import 'brace/theme/monokai';

if (environment.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.error(err));
