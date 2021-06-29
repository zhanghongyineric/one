import { CodeToText } from 'element-china-area-data'

// 四川省所有市级城市的编码
const SiChuanCityCode = new Map([
  ['510100', '成都市'],
  ['510300', '自贡市'],
  ['510400', '攀枝花市'],
  ['510500', '泸州市'],
  ['510600', '德阳市'],
  ['510700', '绵阳市'],
  ['510800', '广元市'],
  ['510900', '遂宁市'],
  ['511000', '内江市'],
  ['511100', '乐山市'],
  ['511300', '南充市'],
  ['511400', '眉山市'],
  ['511500', '宜宾市'],
  ['511600', '广安市'],
  ['511700', '达州市'],
  ['511800', '雅安市'],
  ['511900', '巴中市'],
  ['512000', '资阳市'],
  ['513200', '阿坝藏族羌族自治州'],
  ['513300', '甘孜藏族自治州'],
  ['513400', '凉山彝族自治州']
])

export default function getAreaText(code) {
  const codeArr = ['510000']
  if (SiChuanCityCode.has(code)) {
    codeArr.push(code)
    code = code.split('')
    code[code.length - 1] = '1'
    code = code.join('')
    codeArr.push(code)
  } else {
    const cityCodeArr = code.substring(0, 4).split('')
    cityCodeArr.push('00')
    const cityCode = cityCodeArr.join('')
    codeArr.push(cityCode)
    codeArr.push(code)
  }
  return codeArr
}
