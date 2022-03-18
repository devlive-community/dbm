/**
 * String Utils
 */
export class StringUtils {
  /**
   * Format string
   * <p>stringFormat('format {0}', ['test']) return 'format test'</p>
   *
   * @param formatted format style
   * @param args format param
   * @returns formatted string
   */
  public static format(formatted, args): string {
    for (let i = 0; i < args.length; i++) {
      const regexp = new RegExp('\\{' + i + '\\}', 'gi');
      formatted = formatted.replace(regexp, args[i]);
    }
    return formatted;
  }

  public static isEmpty(source): boolean {
    return StringUtils.getLengthEqZone(source);
  }

  public static isNotEmpty(source): boolean {
    return !StringUtils.isEmpty(source);
  }

  public static getLength(source): number {
    if (source !== undefined && source !== null) {
      return source.length;
    }
    return 0;
  }

  public static getLengthGtZone(source): boolean {
    return StringUtils.getLength(source) > 0;
  }

  public static getLengthLtZone(source): boolean {
    return StringUtils.getLength(source) < 0;
  }

  public static getLengthEqZone(source): boolean {
    return StringUtils.getLength(source) === 0;
  }

  public static getValue(source?: string, defaultValue?: string): string {
    if (source) {
      return source;
    }
    return defaultValue;
  }

  /**
   * Append backslashes
   * @param value
   */
  public static appendBackslash(value: string) {
    return value.replace(/\'/g, '\\\'');
  }
}
