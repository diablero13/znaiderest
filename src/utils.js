export const convertTime = time => `${Math.floor(time)}:${time % 1 ? '30' : '00'}`;

export const convertDay = day => {
  switch (day) {
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    case 7:
      return 'Sunday';
    default:
      return 'Monday';
  }
};

export const isEmpty = d =>
  typeof d === 'undefined' ||
  ((Array.isArray(d) || typeof d === 'string') && !d.length) ||
  !Object.keys(d).length;

export const parseData = str => {
  let data = null;
  if (!str) return null;

  try {
    data = JSON.parse(str);
  } catch (error) {
    data = str.split(';');
  }

  return !isEmpty(data) ? data : null;
};

export const getLocaleText = (key, locale, localization) => {
  const defaultLocale = localization[localization.DEFAULT_LOCALE];
  const currentLocale = localization[locale] || defaultLocale;
  return currentLocale[key] || defaultLocale[key] || currentLocale.DEFAULT_TEXT;
};

export function domEventLogger({ detail, type }, method = 'log') {
  // eslint-disable-next-line
  console[method](type, detail);
}

export function getScriptPromise(url, document = window.document) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function getUrlParams() {
  const params = new URL(window.location);
  return params.searchParams
    ? [...params.searchParams.entries()].reduce((acc, cur) => {
        return { ...acc, [cur[0]]: cur[1] };
      }, {})
    : {};
}

export function deepMerge(target, source) {
  function merge(targetObject, sourceObject) {
    if (isObject(targetObject) && isObject(sourceObject)) {
      Object.keys(sourceObject).forEach(key => {
        if (isObject(sourceObject[key])) {
          if (!targetObject[key] || !isObject(targetObject[key])) {
            // eslint-disable-next-line
            targetObject[key] = {};
          }

          merge(targetObject[key], sourceObject[key]);
        } else {
          Object.assign(targetObject, { [key]: sourceObject[key] });
        }
      });
    }
    return targetObject;
  }

  return merge({ ...target }, { ...source });
}

export function fakeFetch(data = {}, isError) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (!isError ? resolve(data) : reject(new Error('Request rejected!'))), 1000);
  });
}
