/*
 * FileName: 全局filter
 * @author: ZhouJiaXing
 * @date: 2021/5/21 下午4:07
 */

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

/**
 * 根据安全码id获取颜色
 * @param id
 * @returns {string}
 */
export function getColorById(id) {
  const onlineOption = getOnlineOption()
  return {
    color: onlineOption.code_color.map[id] || '#91cc75'
  }
}

/**
 * 根据安全码id获取安全码名称
 * @param id
 * @returns {string}
 */
export function getCodeNameById(id) {
  const onlineOption = getOnlineOption()
  return onlineOption.safe_code.map[id]
}

/**
 * 根据安全码id获取安全码风险等级
 * @param id
 * @returns {string}
 */
export function getLevelNameById(id) {
  const onlineOption = getOnlineOption()
  return onlineOption.risk_level.map[id]
}
