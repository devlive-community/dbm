import { StringUtils } from "./string.utils"

export class ValidateUtils {

    /**
     * The loop recurses to check whether the parameter contains null data
     * @param config parameter
     * @returns {boolean}
     */
    public static validate(config: any): boolean {
        const empty = Object.keys(config).filter(item => StringUtils.isEmpty(config[item]))
        if (empty.length <= 0) {
            return true
        } else {
            return false
        }
    }

}
