import { BaseService } from '@renderer/services/base.service';
import { ResponseDataModel, ResponseModel } from '@renderer/model/response.model';
import { RequestModel } from '@renderer/model/request.model';
import { HttpUtils } from '@renderer/utils/http.utils';
import { UrlUtils } from '@renderer/utils/url.utils';
import { RequestUtils } from '@renderer/utils/request.utils';
import { StringUtils } from '@renderer/utils/string.utils';
import { DatasourceModel } from '@renderer/model/datasource.model';

export class DatasourceService implements BaseService {
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel> {
    sql = 'SELECT version() AS version';
    return HttpUtils.post(UrlUtils.formatUrl(request), sql);
  }

  save(request: RequestModel): ResponseModel {
    const response = new ResponseModel();
    const dsData = this.getAll(null).data;
    const dataSources = dsData.columns;
    const validateResponse = dataSources.filter(item => item.alias === request.config.alias);
    if (validateResponse.length > 0) {
      response.status = false;
      response.message = StringUtils.format('DataSource <{0}> Save Error, exists!',
        [request.config.alias]);
    } else {
      dataSources.push(request.config);
      localStorage.setItem(RequestUtils.KEY_DATASOURCE, JSON.stringify(dataSources));
      response.status = true;
      response.message = StringUtils.format('DataSource <{0}> Save Success!',
        [request.config.alias]);
    }
    return response;
  }

  /**
   * Get the local storage buffer data source
   *
   * @param uniqueName Data source name
   */
  getAll(uniqueName?: string): ResponseModel {
    const response = new ResponseModel();
    response.status = true;
    const dataSources = JSON.parse(localStorage.getItem(RequestUtils.KEY_DATASOURCE));
    const sources = dataSources === null ? [] : dataSources;
    const responseData = new ResponseDataModel();
    responseData.columns = sources;
    if (sources.length > 0) {
      const headers = [];
      Object.keys(sources[0]).forEach(key => {
        headers.push({
          name: key,
          type: 'String'
        });
      });
      responseData.headers = headers;
      if (StringUtils.isNotEmpty(uniqueName)) {
        responseData.columns = sources.filter(item => item.alias === uniqueName);
      }
    }
    response.data = responseData;
    return response;
  }

  delete(unique: string): ResponseModel {
    const response = new ResponseModel();
    response.status = true;
    const dataSources = JSON.parse(localStorage.getItem(RequestUtils.KEY_DATASOURCE))
    .filter(item => item.alias !== unique);
    localStorage.setItem(RequestUtils.KEY_DATASOURCE, JSON.stringify(dataSources));
    response.message = StringUtils.format('Delete <{0}> success!',
      [unique]);
    return response;
  }

  update(unique: string, source: DatasourceModel) {
    const response = new ResponseModel();
    const dataSources = JSON.parse(localStorage.getItem(RequestUtils.KEY_DATASOURCE))
    .filter(item => item.alias !== unique);
    const validateResponse = dataSources.filter(item => item.alias === source.alias);
    if (validateResponse.length > 0) {
      response.message = StringUtils.format('DataSource <{0}> update error, exists!',
        [source.alias]);
      response.status = false;
    } else {
      dataSources.push(source);
      localStorage.setItem(RequestUtils.KEY_DATASOURCE, JSON.stringify(dataSources));
      response.message = StringUtils.format('Update <{0}> success!',
        [unique]);
      response.status = true;
    }
    return response;
  }
}
