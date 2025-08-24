export function encodeObjectToBase64(obj) {
  try {
    const json = JSON.stringify(obj)
    return btoa(unescape(encodeURIComponent(json)))
  } catch (e) {
    return ''
  }
}

export function decodeBase64ToObject(str) {
  try {
    const json = decodeURIComponent(escape(atob(str)))
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}


