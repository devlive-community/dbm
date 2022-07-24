import { DatabaseEnum } from "@renderer/enum/database.enum";
import { RequestModel } from "@renderer/model/request.model";
import { ResponseModel } from "@renderer/model/response.model";

export interface PluginInterface {
  getName(): DatabaseEnum;

  /**
   * Get results from the remote service through the executed SQL statement
   * @param request Remote service configuration information
   * @param sql Executed SQL statement
   */
  getResponse(request: RequestModel, sql?: string): Promise<ResponseModel>;
}
