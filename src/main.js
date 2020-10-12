import Znaiderest from './znaiderest';
import { getUrlParams, parseData } from './utils';

function onDomLoaded() {
  const { clientId, custom, options, origin, locale, development } = {
    ...getUrlParams()
  };

  const params = {
    custom: parseData(custom),
    options: parseData(options),
    origin: origin || document.referrer,
    locale,
    clientId,
    development
  };

  const znaiderest = new Znaiderest(params);

  znaiderest.init();
}

document.addEventListener('DOMContentLoaded', onDomLoaded);
