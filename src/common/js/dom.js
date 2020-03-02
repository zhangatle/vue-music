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

const elementStyle = document.createElement('div').style
const vendor = (() => {
  const transforms = {
    'webkit': 'webkitTransform',
    'moz': 'mozTransform',
    'o': 'oTransform',
    'ms': 'msTransform',
    'standard': 'transform'
  }
  for (let key in transforms) {
    if (elementStyle[transforms[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export const prefixStyle = (style) => {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
