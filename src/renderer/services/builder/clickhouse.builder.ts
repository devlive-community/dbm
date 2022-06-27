import { BaseBuilder } from "@renderer/services/builder/base.builder";
import { StringUtils } from "@renderer/utils/string.utils";
import { SqlUtils } from "@renderer/utils/sql.utils";
import { ColumnModel } from "@renderer/model/column.model";
import { PropertyModel } from "@renderer/model/property.model";
import { DatabaseModel } from "@renderer/model/database.model";
import { PropertyEnum } from "@renderer/enum/property.enum";

export class ClickhouseBuilder implements BaseBuilder {
  public builder(configure: DatabaseModel, columns: ColumnModel[]): string {
    let sql = StringUtils.format('CREATE TABLE {0} (\n', [SqlUtils.getTableName(configure.database, configure.targetName)]);
    sql += StringUtils.format('{0}\n', [this.builderColumnsToString(columns)]);
    sql += StringUtils.format(') {0}\n', [this.builderEngine(configure)]);
    const mergeProperties = this.mergeProperties(configure);
    sql += this.builderProperties(mergeProperties);
    return sql;
  }

  builderColumnsToString(columns: ColumnModel[]): string {
    let columnStr = '';
    columns.forEach((value, index) => {
      if (index !== columns.length - 1) {
        columnStr += this.builderColumnToString(value, true);
      } else {
        columnStr += this.builderColumnToString(value, false);
      }
    });
    return columnStr;
  }

  builderColumnToString(value: ColumnModel, end: boolean): string {
    let column: string;
    let dStr: string;
    if (value.empty) {
      dStr = StringUtils.format('    {0} Nullable({1})', [value.name, value.type]);
    } else {
      dStr = StringUtils.format('    {0} {1}', [value.name, value.type]);
    }
    const endStr = end ? ',\n' : '';
    if (StringUtils.isNotEmpty(value.description)) {
      column = StringUtils.format(`    {0} COMMENT '{1}' {2}`, [dStr, value.description, endStr]);
    } else {
      column = StringUtils.format('    {0} {1}', [dStr, endStr]);
    }
    return column;
  }

  /**
   * Build key-value pairs based on configured table engine parameters
   * @param properties Configuration parameters
   * @returns sql string
   */
  private builderProperties(properties: PropertyModel[]): string {
    let substr: string = '';
    // const map = this.flatProperties(properties);
    // map.forEach((v, k) => {
    //     if (k !== 'type') {
    //         substr += StringUtils.format('\n  {0} = \'{1}\',', [k, v]);
    //     }
    // });
    properties
      .filter(p => p.origin !== undefined && StringUtils.isNotEmpty(p.origin))
      .filter(p => p.value !== undefined)
      .forEach(p => {
        substr += StringUtils.format('\n  {0} = \'{1}\',', [p.origin, p.value]);
      });
    if (StringUtils.isNotEmpty(substr)) {
      substr = StringUtils.format('SETTINGS {0}', [substr.substring(0, substr.length - 1)]);
    }
    return substr;
  }

  private builderEngine(configure: DatabaseModel): string {
    let sql: string = '';
    const prefix = '\nENGINE = ';
    switch (configure.propertyType) {
      case PropertyEnum.key:
      default:
        sql = StringUtils.format('{0} {1}()', [prefix, configure.type]);
        break;
      case PropertyEnum.name:
        const substr = configure.properties
          .filter(element => StringUtils.isNotEmpty(element.value))
          .flatMap(element => StringUtils.format('\'{0}\'', [element.value]))
          .join(', ');
        sql = StringUtils.format('{0} {1}({2})', [prefix, configure.type, substr]);
        break;
    }
    return sql;
  }

  private flatProperties(properties: PropertyModel[]): Map<string, string> {
    const map = new Map<string, string>();
    properties
      .filter(p => p.isSetting === undefined || p.isSetting)
      .forEach(p => {
        if (StringUtils.isNotEmpty(p.origin)) {
          map.set('type', PropertyEnum.key);
          map.set(p.origin, p.value);
        } else {
          map.set('type', PropertyEnum.name);
          map.set(p.name, p.value);
        }
      });
    return map;
  }

  /**
   * Merges required and optional configurations
   * @param configure Data model configuration
   * @private merges array
   */
  private mergeProperties(configure: DatabaseModel): PropertyModel[] {
    let applyArray = new Array();
    if (configure?.properties) {
      applyArray = applyArray.concat(configure.properties);
    }
    const filterOptionalProperties = configure.optionalProperties?.filter(element => StringUtils.isNotEmpty(element.value));
    if (filterOptionalProperties) {
      applyArray = applyArray.concat(filterOptionalProperties);
    }
    return applyArray;
  }
}
