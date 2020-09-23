// import createStore from './store';
// import { domEventLogger, getScriptPromise, fitFontSize } from './utils';

import styles from './styles.css';

// const EXTERNAL_SCRIPT_URL = null;
const SHOULD_DISPLAY_PRELOADER_OVERLAY = true;

// const initialState = {
//   title: null,
// };

export default class ZnaiderestWidget extends window.HTMLElement {
  constructor(...args) {
    super(...args);

    this.config = {
      clientId: this.dataset.clientId
    };

    // this.store = createStore(initialState);
  }

  connectedCallback() {
    const styleElement = document.createElement('style');
    styleElement.append(document.createTextNode(styles));

    this.root = document.createElement('div');
    this.root.id = 'znaiderest-widget';
    // this.root.insertBefore(styleElement, this.root.firstChild);

    this.shadow = this.attachShadow({ mode: 'closed' });
    this.shadow.appendChild(styleElement);
    this.shadow.appendChild(this.root);

    this.switchContext('BOOKING_LOADING');

    this.bookingOverlay = this.renderBookingOverlay();
    this.bookingForm = this.bookingFormBootstrap();

    this.fillBookingForm();
    this.setupHandlers();
  }

  bookingFormBootstrap() {
    const bookingFormContainer = document.createElement('div');

    bookingFormContainer.id = 'znaiderest-booking-form';
    bookingFormContainer.innerHTML = `
<div class="title">
  <p class='text'>Initial text</p>
</div>`;

    this.root.appendChild(bookingFormContainer);
    return bookingFormContainer;
  }

  fillBookingForm() {
    const titleElement = this.bookingForm.querySelector('.title p.text');
    const titleText = `Client ID: ${this.config.clientId}`;

    titleElement.textContent = titleText;

    this.switchContext('BOOKING_INITIAL');
  }

  renderBookingOverlay() {
    const overlay = document.createElement('div');

    overlay.id = 'znaiderest-booking-overlay';

    if (SHOULD_DISPLAY_PRELOADER_OVERLAY) {
      overlay.innerHTML = `
<svg viewBox="0 0 50 50">
  <circle
    fill="none"
    stroke="currentColor"
    stroke-width="4"
    stroke-miterlimit="10"
    cx="25" cy="25" r="20"
  ></circle>
</svg>`;
    }

    this.root.appendChild(overlay);
    return overlay;
  }

  setupHandlers() {
    this.onBookingProcessing = this.onBookingProcessing.bind(this);
    this.onBookedInit = this.onBookedInit.bind(this);
    this.onBookedSuccess = this.onBookedSuccess.bind(this);
    this.onBookedError = this.onBookedError.bind(this);

    // this.bookingForm.addEventListener('onSendrequest', this.onBookingProcessing);

    if (isDebugMode()) this.activateLogger();
  }

  onBookedInit() {
    this.switchContext('BOOKING_INITIAL');
  }

  onBookingProcessing() {
    this.switchContext('BOOKING_PROCESSING');
  }

  onBookedSuccess() {
    this.switchContext('BOOKING_SUCCESS');
  }

  onBookedError() {
    this.switchContext('BOOKING_ERROR');
  }

  activateLogger() {
    console.log('Logger activated'); // eslint-disable-line
  }

  switchContext(type) {
    switch (type) {
      case 'BOOKING_INITIAL':
        this.root.className = 'initial';
        break;
      case 'BOOKING_PROCESSING':
        this.root.className = 'processing';
        break;
      case 'BOOKING_SUCCESS':
        this.root.className = 'success';
        break;
      case 'BOOKING_ERROR':
        this.root.className = 'error';
        break;
      case 'BOOKING_LOADING':
        this.root.className = 'loading';
        break;
      default:
        this.root.className = 'loading';
    }
  }
}

function isDebugMode() {
  let params = '';
  try {
    params = window.top.location.search;
  } catch (error) {
    params = document.referrer // eslint-disable-line
      ? new URL(document.referrer).search // eslint-disable-line
      : window.location.search;
  }
  return params.indexOf('GlomexIntegrationDebugMode') !== -1;
}
