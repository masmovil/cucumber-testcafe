export function objectToQueryString(object) {
  return Object.keys(object)
    .sort((a: any, b: any) => a - b)
    .map(key => `${key}=${encodeURIComponent(object[key])}`)
    .join('&')
}
