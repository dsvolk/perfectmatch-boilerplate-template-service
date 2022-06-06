// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 Deep clones all properties except functions
 var arr = [1, 2, 3];
 var subObj = {aa: 1};
 var obj = {a: 3, b: 5, c: arr, d: subObj};
 var objClone = clone(obj);
 arr.push(4);
 subObj.bb = 2;
 obj; // {a: 3, b: 5, c: [1, 2, 3, 4], d: {aa: 1}}
 objClone; // {a: 3, b: 5, c: [1, 2, 3], d: {aa: 1, bb: 2}}
 */
export function deepClone<T>(obj: T): T {
  if (typeof obj == 'function') {
    return obj;
  }
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    // include prototype properties
    const value = obj[key];
    const type = {}.toString.call(value).slice(8, -1);
    if (type == 'Array' || type == 'Object') {
      result[key] = deepClone(value);
    } else if (type == 'Date') {
      result[key] = new Date(value.getTime());
    } else if (type == 'RegExp') {
      result[key] = RegExp(value.source, getRegExpFlags(value));
    } else {
      result[key] = value;
    }
  }
  return result;
}

function getRegExpFlags(regExp) {
  if (typeof regExp.source.flags == 'string') {
    return regExp.source.flags;
  } else {
    const flags = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}
