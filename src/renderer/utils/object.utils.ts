export class ObjectUtils {
  public static isNull(source): boolean {
    return source === undefined || source === null;
  }

  public static isNotNull(source): boolean {
    return !ObjectUtils.isNull(source);
  }
}
