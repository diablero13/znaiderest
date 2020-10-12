// import '../vendor/native-shim';
// import '../vendor/custom-elements.min';
// import '../vendor/webcomponents-platform';

class ZnaiderestWidget extends window.HTMLElement {
  constructor(...args) {
    super(...args);
    this.config = Object.fromEntries([...this.attributes].map(({ name, value }) => [name, value]));

    this.config.clientId = this.config.clientid;
    this.config.origin = window.location.host;

    this.style = `display: block;`;

    this.style.width = this.config.width ? this.config.width + 'px' : null;
    this.style.height = this.config.height ? this.config.height + 'px' : null;
  }

  connectedCallback() {
    const scriptSrc = [...document.scripts]
      .map(({ src }) => new URL(src))
      .find((src) => src.href.indexOf('znaiderest-component') !== -1);
    const shadow = this.attachShadow({ mode: 'closed' });
    const frame = document.createElement('iframe');
    const src = new URL(`${scriptSrc.href.split('/').slice(0, -1).join('/')}/index.html`);

    frame.style = 'border: none; display: block; height: 100%';

    frame.setAttribute('frameborder', 0);
    frame.setAttribute('width', this.config.width);

    Object.entries(this.config).forEach(([key, value]) => {
      if (!value) return;
      src.searchParams.set(key, value);
    });

    frame.src = src;
    shadow.appendChild(frame);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.customElements.define('znaiderest-widget', ZnaiderestWidget);
});
