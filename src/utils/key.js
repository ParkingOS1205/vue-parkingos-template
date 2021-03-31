import CryptoJS from 'crypto-js'
export const KEY = CryptoJS.enc.Utf8.parse('zldboink20170613')
export const CarTypeList = [
  { 'value_no': 0, 'value_name': '全部' },
  { 'value_no': 1, 'value_name': '临停车' },
  { 'value_no': 2, 'value_name': '月卡车' },
  { 'value_no': 3, 'value_name': '内部车' }
]
