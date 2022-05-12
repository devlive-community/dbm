import { PersistenceService } from '@renderer/services/persistence.service';
import { BaseService } from '@renderer/services/base.service';
import { RequestModel } from '@renderer/model/request.model';
import { ResponseModel } from '@renderer/model/response.model';
import { BaseModel } from '@renderer/model/base.model';
import { Support } from '@renderer/support';
import { SystemEditorModel } from '@renderer/model/system.model';

export class EditorService extends PersistenceService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    return Promise.resolve(undefined);
  }

  getDefault(): any {
    return {
      lineNumbers: true,
      mode: 'sql',
      lineWrapping: true,
      styleActiveLine: true,
      foldGutter: true,
      hintOptions: {
        completeSingle: false
      },
      lineComment: ['\/\/'],
      keyMap: 'sublime',
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
    };
  }

  getAll(): BaseModel[] {
    return [];
  }

  save(model: BaseModel): any {
    localStorage.setItem(Support.KEY_SYSTEM_SETTING_EDITOR, JSON.stringify(model));
  }

  get(): SystemEditorModel {
    const cache = JSON.parse(localStorage.getItem(Support.KEY_SYSTEM_SETTING_EDITOR));
    return cache === null ? new SystemEditorModel() : cache;
  }

  clear(): boolean {
    return false;
  }

  deleteById(id: number): boolean {
    return false;
  }
}
