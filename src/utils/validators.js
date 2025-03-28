// utils/validators.js
/**
 * 数字验证函数（支持配置项）
 * @param {string} input - 输入内容
 * @param {Object} [options] - 配置选项
 * @param {boolean} [options.allowNegative=false] - 是否允许负数
 * @param {boolean} [options.allowDecimal=true] - 是否允许小数
 * @param {number} [options.decimalDigits=2] - 小数位数限制
 * @returns {{isValid: boolean, value: number|null, error: string|null}} 验证结果
 */
export const validateNumeric = (input, {
  allowNegative = false,
  allowDecimal = true,
  decimalDigits = 2
} = {}) => {
  // 空值处理
  if (input === '') return { isValid: true, value: null, error: null }

  // 基础正则验证
  const pattern = allowDecimal
    ? `^${allowNegative ? '-?' : ''}\\d*(\\.\\d{0,${decimalDigits}})?$`
    : `^${allowNegative ? '-?' : ''}\\d+$`

  if (!new RegExp(pattern).test(input)) {
    return {
      isValid: false,
      value: null,
      error: allowDecimal
        ? `请输入有效的${allowNegative ? '正负' : ''}数字${decimalDigits ? `（最多${decimalDigits}位小数）` : ''}`
        : `请输入有效的${allowNegative ? '正负' : ''}整数`
    }
  }

  // 数值转换
  const numValue = Number(input)
  if (isNaN(numValue)) {
    return {
      isValid: false,
      value: null,
      error: '包含非法字符'
    }
  }

  // 边界检查
  if (!allowNegative && numValue < 0) {
    return {
      isValid: false,
      value: null,
      error: '不允许输入负数'
    }
  }

  return { isValid: true, value: numValue, error: null }
}

/**
 * 带自动修正的验证函数
 * @param {Event} event - 输入事件对象
 * @param {Function} errorHandler - 错误处理回调
 * @param {Object} [options] - 验证配置
 * @returns {number|null} 有效数值或null
 */
export const numericInputHandler = (event, errorHandler, options) => {
  const input = event.target.value
  const { isValid, value, error } = validateNumeric(input, options)

  if (!isValid) {
    errorHandler?.(error)
    event.target.value = input.replace(/[^-\d.]/g, '') // 自动过滤非法字符
    return null
  }

  return value
}
