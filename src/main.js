import Znaiderest from './znaiderest';
import { getUrlParams, parseData } from './utils';

window.frameElement.style = 'display: block; border: none;';

function onDomLoaded() {
  const { clientId, custom, options, origin, locale } = {
    ...getUrlParams(),
    ...(window.frameElement ? window.frameElement.dataset : {})
  };

  const params = {
    custom: parseData(custom),
    options: parseData(options),
    origin,
    locale,
    clientId
  };

  const znaiderest = new Znaiderest(params);

  znaiderest.init();
}

document.addEventListener('DOMContentLoaded', onDomLoaded);
