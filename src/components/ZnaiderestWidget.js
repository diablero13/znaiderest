import { getScriptPromise, getUrlParams } from '../utils';

import styles from './styles.css';

const RECAPTCHA_KEY = '6LcXi88ZAAAAANTQqorKaHeWWDX0MCdhvC2Rcgup';
const RECAPTCHA_SCRIPT_URL = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`;

const FONT_STYLES_URL =
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;600;700&display=swap';

const SHOULD_DISPLAY_PRELOADER_OVERLAY = true;

const BOOKING_LOADING_TEXT = `Znaiderest инициализируется...`;
const BOOKING_PROCESSING_TEXT = `Ваш запрос резервирования в процессе обработки...`;
const BOOKING_SUCCESS_TEXT = `Поздравляем ваше резервирование подтверждено!`;
const BOOKING_ERROR_TEXT = `К сожалению, что-то пошло не так и ваш запрос резервирования не может быть обработан.`;

export default class ZnaiderestWidget extends window.HTMLElement {
  constructor(...args) {
    super(...args);

    this.config = {
      clientId: this.dataset.clientId
    };

    this.style = 'display: block; width: 480px; height: 170px;';
  }

  connectedCallback() {
    const styleElement = document.createElement('style');
    styleElement.append(document.createTextNode(styles));

    const fontLink = document.createElement('link');
    fontLink.href = FONT_STYLES_URL;
    fontLink.rel = 'stylesheet';

    const root = document.createElement('div');
    root.id = 'znaiderest-widget';
    this.root = root;

    getScriptPromise(RECAPTCHA_SCRIPT_URL);

    this.shadow = this.attachShadow({ mode: 'closed' });

    const frame = document.createElement('iframe');
    frame.style = 'width: 100%; height: 100%; border: none;';
    frame.setAttribute('frameborder', 0);
    frame.setAttribute('referrerpolicy', 'unsafe-url');
    this.shadow.appendChild(frame);

    frame.contentWindow.document.head.appendChild(fontLink);
    frame.contentWindow.document.head.appendChild(styleElement);
    frame.contentWindow.document.body.appendChild(root);

    // this.shadow.appendChild(styleElement);
    // this.shadow.appendChild(root);

    this.onBookingLoading();

    this.bookingOverlay = this.renderBookingOverlay();
    this.bookingForm = this.bookingFormBootstrap();

    this.setupHandlers();
    this.fillBookingForm();
  }

  bookingFormBootstrap() {
    const bookingFormContainer = document.createElement('div');

    bookingFormContainer.id = 'znaiderest-booking-form';
    bookingFormContainer.innerHTML = `
<div class="title">
  Забронировать столик
</div>
<form name="booking" autocomplete="off">
  <div class="form-box">
    <div class="form-field name">
      <input placeholder="Ваше имя" type="text" name="name" required />
    </div>
    <div class="form-field phone">
      <input placeholder="Контактный телефон" type="tel" name="phone" required />
    </div>
    <div class="form-field number">
      <input placeholder="Количество персон" type="number" name="number" min="1" max="100" step="1" value="1" required />
    </div>
    <div class="form-field date">
      <input autocomplete="off" type="datetime-local" name="date" required />
    </div>
    <div class="form-field time">
      <input autocomplete="off" type="time" name="time" required />
    </div>
    <div class="form-field submit">
      <button type="submit">Подтвердить резерв</button>
    </div>
  </div>
</form>`;

    this.root.appendChild(bookingFormContainer);
    return bookingFormContainer;
  }

  fillBookingForm() {
    const titleElement = this.bookingForm.querySelector('.title');
    const dateField = this.bookingForm.querySelector('.form-box input[type="datetime-local"]');

    const titleText = `Забронировать столик в ресторане %${this.config.clientId}%`;
    const currentDate = new Date().toISOString().slice(0, -8);

    titleElement.textContent = titleText;
    dateField.value = currentDate;

    this.onBookingInit();
  }

  renderBookingOverlay() {
    const overlay = document.createElement('div');

    overlay.id = 'znaiderest-booking-overlay';

    if (SHOULD_DISPLAY_PRELOADER_OVERLAY) {
      overlay.innerHTML = `
<div class="loading overlay">
  ${BOOKING_LOADING_TEXT}
  <div class="preloader-box">
    <svg viewBox="0 0 50 50">
      <circle
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-miterlimit="10"
        cx="25" cy="25" r="20"
      ></circle>
    </svg>
  </div>
</div>
<div class="processing overlay">
  ${BOOKING_PROCESSING_TEXT}
  <div class="preloader-box">
    <svg viewBox="0 0 50 50">
      <circle
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-miterlimit="10"
        cx="25" cy="25" r="20"
      ></circle>
    </svg>
  </div>
</div>
<div class="success overlay">
  ${BOOKING_SUCCESS_TEXT}
</div>
<div class="error overlay">
  ${BOOKING_ERROR_TEXT}
</div>`;
    }

    this.root.appendChild(overlay);
    return overlay;
  }

  setupHandlers() {
    const bookingForm = this.bookingForm.querySelector('form');
    const submitButton = bookingForm.querySelector('button[type="submit"]');

    this.onBookingProcessing = this.onBookingProcessing.bind(this);
    this.onBookingInit = this.onBookingInit.bind(this);
    this.onBookingSuccess = this.onBookingSuccess.bind(this);
    this.onBookingError = this.onBookingError.bind(this);
    this.onBookingTrySubmit = this.onBookingTrySubmit.bind(this);

    submitButton.addEventListener('click', this.onBookingTrySubmit);
    bookingForm.addEventListener('submit', this.onBookingProcessing);

    if (isDebugMode()) this.activateLogger();
  }

  reCaptchaWrapper(callback = () => {}) {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_KEY, { action: 'submit' })
        .then(token => {
          console.log('ReCaptcha:', { token }); // eslint-disable-line
          callback(token);
        })
        .catch(this.onBookingError);
    });
  }

  onBookingTrySubmit(event) {
    // event.preventDefault();
    // const bookingForm = this.bookingForm.querySelector('form');
    // const isValid = bookingForm.reportValidity();
    this.bookingForm.classList.add('validated');
  }

  onBookingLoading() {
    this.switchContext('BOOKING_LOADING');
  }

  onBookingInit() {
    this.switchContext('BOOKING_INITIAL');
  }

  onBookingProcessing(event) {
    event.preventDefault();

    const {
      name: { value: name },
      phone: { value: phone },
      number: { value: number },
      date: { value: date },
      time: { value: time }
    } = event.target;

    this.switchContext('BOOKING_PROCESSING');

    this.reCaptchaWrapper(token => {
      fakeFetch({ name, phone, number, date, time, token })
        .then(this.onBookingSuccess)
        .catch(this.onBookingError);
    });
  }

  onBookingSuccess(response) {
    console.log('Success:', response); // eslint-disable-line
    this.switchContext('BOOKING_SUCCESS');
  }

  onBookingError(error) {
    console.error(error); // eslint-disable-line
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
  return getUrlParams().hasOwnProperty('znaiderest_debug_mode'); // eslint-disable-line
}

function fakeFetch(data = {}) {
  const isError = getUrlParams().hasOwnProperty('znaiderest_error'); // eslint-disable-line
  return new Promise((resolve, reject) => {
    setTimeout(() => (!isError ? resolve(data) : reject(new Error('Request rejected!'))), 1000);
  });
}
