// import '../vendor/native-shim';
// import '../vendor/custom-elements.min';
// import '../vendor/webcomponents-platform';

class ZnaiderestWidget extends window.HTMLElement {
  constructor(...args) {
    super(...args);

    this.config = Object.fromEntries([...this.attributes].map(({ name, value }) => [name, value]));

    this.config.clientId = this.config.clientid;
    this.config.origin = window.location.host;

    this.style.width = this.config.width;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    const frame = document.createElement('iframe');

    frame.src = './index.html';
    frame.style = 'border: none; display: block;';

    frame.setAttribute('frameborder', 0);
    frame.setAttribute('width', this.config.width);
    frame.setAttribute('referrerpolicy', 'unsafe-url');

    Object.entries(this.config).forEach(([key, value]) => {
      if (!value) return;
      frame.dataset[key] = value;
    });

    shadow.appendChild(frame);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.customElements.define('znaiderest-widget', ZnaiderestWidget);
});
