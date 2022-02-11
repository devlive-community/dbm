import { DatasourceModule } from '@renderer/app/pages/management/datasource/datasource.module';
import { StringUtils } from '@renderer/utils/string.utils';
import { DatasourceModel } from '@renderer/model/datasource.model';

export class RequestUtils {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static KEY_DATASOURCE = 'DATASOURCE';
  public static KEY_SYSTEM_SETTING_BASIC = 'SETTING_BASIC';

  public static getDatasource(name: string, host?: string, port?: number, username?: string, password?: string): DatasourceModule {
    let response: DatasourceModel;
    if (StringUtils.isNotEmpty(name)) {
      response = JSON.parse(localStorage.getItem(RequestUtils.KEY_DATASOURCE))
        .filter(item => item.name === name);
    } else {
      response = new DatasourceModel();
      response.host = host;
      response.port = port;
      response.username = username;
      response.password = password;
    }
    return response;
  }
}
