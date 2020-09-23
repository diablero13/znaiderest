// import '../vendor/native-shim';
// import '../vendor/custom-elements.min';
// import '../vendor/webcomponents-platform';

import ZnaiderestWidget from './components/ZnaiderestWidget';

document.addEventListener('DOMContentLoaded', onDomLoaded);

function onDomLoaded() {
  window.customElements.define('znaiderest-widget', ZnaiderestWidget);
}
