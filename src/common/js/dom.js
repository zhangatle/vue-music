export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export const htmlDataGetOrSet = (el, key, val) => {
  const attrPrefix = 'data-'
  if (!val) {
    return el && el.getAttribute(attrPrefix + key)
  } else {
    el.setAttribute(attrPrefix + key, val)
  }
}
