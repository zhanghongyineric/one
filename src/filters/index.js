import { parseTime } from '@/utils'

let onlineOption = null

/**
 * 获取存储的线上字典
 * @returns {object}
 */
export function getOnlineOption() {
  return onlineOption || (onlineOption = JSON.parse(localStorage.getItem('onlineOption')))
}

/**
 * 把日期转换为 标准格式 {y}-{m}-{d} {h}:{i}:{s}
 * @param date
 * @param cFormat
 * @returns {string|null}
 */
export function dateFilter(date, cFormat) {
  return parseTime(new Date(date), cFormat)
}
