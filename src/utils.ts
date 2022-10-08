export const isClass = (fn) => typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn))

