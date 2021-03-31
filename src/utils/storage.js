/**
 * @param {string} key
 * @returns {string}
 */
export function getPublicParameters(key) {
  let parkingos_userinfo = sessionStorage.getItem('parkingos_userinfo')
  let value = ''
  if (parkingos_userinfo) {
    parkingos_userinfo = JSON.parse(parkingos_userinfo)
    value = parkingos_userinfo[key]
  } else {
    value = ''
  }
  return value
}
