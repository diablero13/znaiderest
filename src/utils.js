export function domEventLogger({ detail, type }, method = 'log') {
  // eslint-disable-next-line
  console[method](type, detail);
}

export function getScriptPromise(url) {
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
  let params = null;
  try {
    params = window.top.location.search && new URL(window.top.location.search);
  } catch (error) {
    params = document.referrer // eslint-disable-line
      ? new URL(document.referrer) // eslint-disable-line
      : new URL(window.location);
  }
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
