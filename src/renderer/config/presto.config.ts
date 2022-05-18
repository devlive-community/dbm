import {BaseConfig} from "@renderer/config/base.config";

export class PrestoConfig implements BaseConfig {
  version = `
SELECT node_version AS version
FROM system.runtime.nodes
LIMIT 1
  `;
  columnDiskUsedRatio: string;
  columnItems: string;
  databaseDiskUsedRatio: string;
  databaseItems: string;
  databaseItemsFilterFuzzy: string;
  databaseItemsFilterPrecise: string;
  diskUsedRatio: string;
  tableDiskUsedRatio: string;
  tableItems: string;
  tableItemsFilterFuzzy: string;
  tableItemsFilterPrecise: string;
}
