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
}
