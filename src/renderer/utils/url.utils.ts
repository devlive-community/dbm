import { RequestModel } from '@renderer/model/request.model';
import { StringUtils } from '@renderer/utils/string.utils';

export class UrlUtils {
  public static formatUrl(request: RequestModel): string {
    let remoteUrl;
    const hasAuthentication = (StringUtils.isNotEmpty(request.config.username) && StringUtils.isNotEmpty(request.config.password));
    const protocol = StringUtils.getValue(request.config.protocol, 'http');
    if (hasAuthentication) {
      remoteUrl = StringUtils.format('{0}://{1}:{2}/?user={3}&password={4}',
        [protocol, request.config.host, request.config.port, request.config.username, request.config.password]);
    } else {
      remoteUrl = StringUtils.format('{0}://{1}:{2}',
        [protocol, request.config.host, request.config.port]);
    }
    if (request.params) {
      const params = request.params
      .map(param => StringUtils.format('{0}={1}', [param.key, param.value]))
      .join('&');
      if (hasAuthentication) {
        remoteUrl = StringUtils.format('{0}&{1}', [remoteUrl, params]);
      } else {
        remoteUrl = StringUtils.format('{0}?{1}', [remoteUrl, params]);
      }
    }
    return remoteUrl;
  }
}
