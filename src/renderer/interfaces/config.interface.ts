import { DatabaseEnum } from "@renderer/enum/database.enum";

export interface ConfigInterface {
  getName(): DatabaseEnum;

  /**
   * Get SQL statement
   * @param key statement key
   */
  getStatement(key: string): string;
}
