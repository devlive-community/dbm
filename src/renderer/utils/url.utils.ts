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

    // Append url
    if (StringUtils.isNotEmpty(request.config.url)) {
      remoteUrl = StringUtils.format('{0}/{1}', [remoteUrl, request.config.url]);
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
    if (StringUtils.isNotEmpty(request.config.database)) {
      if (remoteUrl.indexOf('?') === -1) {
        remoteUrl = StringUtils.format('{0}?database={1}', [remoteUrl, request.config.database]);
      } else {
        remoteUrl = StringUtils.format('{0}&database={1}', [remoteUrl, request.config.database]);
      }
    }
    return remoteUrl;
  }

  public static formatUrlWithHostAndPort(request: RequestModel): string {
    const protocol = StringUtils.getValue(request.config.protocol, 'http');
    return StringUtils.format('{0}://{1}:{2}', [protocol, request.config.host, request.config.port]);
  }
}
