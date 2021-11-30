const pg = require('package.json');

export class PackageUtils {
  public static get(key: string) {
    return pg[key];
  }
}
