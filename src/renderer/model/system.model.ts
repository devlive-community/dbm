import { BaseModel } from '@renderer/model/base.model';
import { FormatEnum } from '@renderer/enum/format.enum';
import { EditorThemeEnum } from '@renderer/enum/editor/theme.enum';

export class SystemBasicModel extends BaseModel {
  public network = 10;
  public format: FormatEnum = FormatEnum.JSON;
  public language = 'en';
}

export class SystemEditorModel extends BaseModel {
  public theme = EditorThemeEnum['3024-day'];
  public styleActiveLine = true;
  public lineNumbers = true;
  public language = 'mysql';
  public uppercase = true;
  public matchBrackets = false;
}
