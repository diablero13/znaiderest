import { convertTime, convertDay, getLocaleText } from './utils';
import { RECAPTCHA_KEY, API_BASE_URI, LOCALIZATION } from './constants';

import styles from './styles.css';

const IS_DEVELOPMENT = true;

export default class Znaiderest {
  constructor({ clientId, options, custom, origin, locale }) {
    this.config = { clientId, options, origin, locale, custom };
    this.client = { clientId, origin };

    this.root = document.getElementById('znaiderest-widget');
    this.bookingOverlay = document.getElementById('znaiderest-booking-overlay');
    this.bookingForm = document.getElementById('znaiderest-booking-form');
  }

  setStyles() {
    const styleElement = document.createElement('style');
    const logoBox = document.getElementById('znaiderest-logo');
    const { color, background } = this.config.custom || {};

    let customStyles = `:root {
      ${color ? `--custom-text-color: ${color};` : ''}
      ${background ? `--custom-background-color: ${background};` : ''}
    }`;

    if (this.config.custom && this.config.custom.hideFooter) {
      logoBox.style.display = 'none';
      this.root.style.padding = 0;
      customStyles += `
      .grecaptcha-badge {
        position: absolute !important;
        bottom: auto !important;
      }
      `;
    }

    this.root.style.display = 'block';
    styleElement.append(document.createTextNode(customStyles + styles));
    document.body.appendChild(styleElement);
  }

  setFrameHeight() {
    const { frameElement } = window;
    frameElement.height = document.getElementById('znaiderest-widget').clientHeight;
  }

  init() {
    this.applyLocalization();
    this.setStyles();
    this.onBookingLoading();

    if (!this.config.clientId) {
      this.onInitError();
      return;
    }

    this.setupHandlers();
    this.getClientData();
  }

  applyLocalization() {
    const localizableElements = [...this.root.querySelectorAll('[data-text-key]')];

    localizableElements.forEach((element) => {
      const key = element.dataset.textKey;
      const localText = getLocaleText(key, this.config.locale, LOCALIZATION);
      element.textContent = localText;
    });
  }

  getClientData() {
    const { clientId } = this.config;
    this.reCaptchaWrapper((token) => {
      fetch(`${API_BASE_URI}/places/${clientId}`, {
        method: 'GET',
        mode: 'cors',
        headers: !IS_DEVELOPMENT
          ? {
              'X-Recapthca-Token': token,
              'X-Client-Host': origin
            }
          : {}
      })
        .then((res) => res.json())
        .then(this.onClientDataLoaded)
        .catch(this.onInitError);
    }, 'initial');
  }

  fillBookingForm({ name }) {
    const FORM_TITLE_TEXT = getLocaleText('FORM_TITLE_TEXT', this.config.locale, LOCALIZATION);
    const titleElement = this.bookingForm.querySelector('.title');
    const dateField = this.bookingForm.querySelector('.form-box input[type="date"]');

    const title = `${FORM_TITLE_TEXT} ${name}`;
    const date = new Date();
    const [isoDateString] = date.toISOString().split('T');

    titleElement.textContent = title;
    dateField.value = isoDateString;

    this.renderTimeOptions(date);
    this.renderCustomOptions();
    this.onBookingInit();
  }

  renderTimeOptions(date) {
    const timeField = this.bookingForm.querySelector('.form-box select[name="time"]');
    const { open, close } = this.client.hours[convertDay(date.getDay())];
    const options = [...Array((close - open) / 0.5 + 1)]
      .map((el, i) => {
        const timeString = convertTime(open + i / 2);
        return `<option value="${timeString}">${timeString}</option>`;
      })
      .join('\n');

    timeField.innerHTML = options;
  }

  renderCustomOptions() {
    const { options } = this.config;
    const optionsField = this.bookingForm.querySelector('.form-field.options');
    const optionsList = optionsField.querySelector('.checkbox-box');

    if (!options || !options.length) return;

    optionsField.classList.remove('hidden');

    optionsList.innerHTML = options
      .map((option, i) => {
        if (!option) return '';
        const value = option.value || option;
        const title = ((s) => s.splice(0, 1, s[0].toUpperCase()) && s.join(''))([
          ...(option.title || value).trim()
        ]);
        return `
  <div class="checkbox">
    <input
      type="checkbox"
      name="options"
      id="booking-option-${i + 1}" value="${value}"
      ${option.checked ? 'checked' : ''}
    />
    <label for="booking-option-${i + 1}">${title}</label>
  </div>`;
      })
      .join('');
  }

  onClientDataLoaded({ name, hours }) {
    this.client = { ...this.client, name, hours };
    this.fillBookingForm({ name, hours });
    this.setFrameHeight();
  }

  onBookingDateChange({ target: { value } }) {
    this.renderTimeOptions(new Date(value));
  }

  onBookingSubmit(event) {
    event.preventDefault();
    const form = this.bookingForm.querySelector('form');
    const isValid = form.reportValidity();
    const { name, phone, number, date, time, notes } = form;
    const options = [...form.querySelectorAll('input[name="options"]')];
    const optionsString = options.length
      ? options
          .filter(({ checked }) => checked)
          .map(({ value }) => value)
          .join('; ')
      : '';

    const data = {
      on_time: `${date.value} ${time.value}:00`,
      contact: {
        first_name: name.value,
        phone_number: phone.value
      },
      attributes: {
        seats: number.value
      },
      notes: notes.value.length ? `${notes.value};\n${optionsString}` : optionsString
    };

    this.bookingForm.classList.add('validated');

    if (isValid) {
      this.onBookingProcessing(data);
    } else {
      // eslint-disable-next-line
      console.error('Invalid!', {
        data,
        validity: {
          name: name.validity,
          phone: phone.validity,
          number: number.validity,
          date: date.validity,
          time: time.validity,
          notes: notes && notes.validity
        }
      });
    }
  }

  onBookingLoading() {
    this.switchContext('BOOKING_LOADING');
  }

  onBookingInit() {
    this.switchContext('BOOKING_INITIAL');
  }

  onBookingProcessing(data) {
    this.switchContext('BOOKING_PROCESSING');

    const { clientId } = this.config;
    this.reCaptchaWrapper((token) => {
      return fetch(`${API_BASE_URI}/places/${clientId}/reservations`, {
        body: JSON.stringify(data),
        method: 'POST',
        mode: 'cors',
        headers: !IS_DEVELOPMENT
          ? {
              'X-Recapthca-Token': token,
              'X-Client-Host': origin
            }
          : {}
      })
        .then((res) => {
          if (!res.ok) {
            this.onBookingError();
          } else {
            this.onBookingSuccess(res);
          }
          return res;
        })
        .catch(this.onBookingError);
    }, 'submit');
  }

  onBookingSuccess(response) {
    console.log('Success:', response); // eslint-disable-line
    this.switchContext('BOOKING_SUCCESS');
  }

  onBookingError(error) {
    console.error('Booking error!', error); // eslint-disable-line
    this.switchContext('BOOKING_ERROR');
  }

  onInitError(error) {
    console.error('Init error!', error); // eslint-disable-line
    this.switchContext('INIT_ERROR');
  }

  switchContext(type) {
    switch (type) {
      case 'BOOKING_INITIAL':
        this.root.className = 'initial';
        break;
      case 'BOOKING_PROCESSING':
        this.root.className = 'overlay processing';
        break;
      case 'BOOKING_SUCCESS':
        this.root.className = 'overlay success';
        break;
      case 'BOOKING_LOADING':
        this.root.className = 'overlay loading';
        break;
      case 'BOOKING_ERROR':
        this.root.className = 'overlay booking-error';
        break;
      case 'INIT_ERROR':
        this.root.className = 'overlay init-error';
        break;
      default:
        this.root.className = 'overlay loading';
    }
  }

  setupHandlers() {
    const bookingForm = this.bookingForm.querySelector('form');
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const dateField = bookingForm.date;

    this.onClientDataLoaded = this.onClientDataLoaded.bind(this);
    this.onBookingDateChange = this.onBookingDateChange.bind(this);
    this.onBookingSubmit = this.onBookingSubmit.bind(this);
    this.onBookingProcessing = this.onBookingProcessing.bind(this);
    this.onBookingInit = this.onBookingInit.bind(this);
    this.onBookingSuccess = this.onBookingSuccess.bind(this);
    this.onBookingError = this.onBookingError.bind(this);
    this.onInitError = this.onInitError.bind(this);

    submitButton.addEventListener('click', this.onBookingSubmit);
    bookingForm.addEventListener('submit', this.onBookingSubmit);
    dateField.addEventListener('change', this.onBookingDateChange);
  }

  reCaptchaWrapper(callback = () => {}, action = 'submit') {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_KEY, { action })
        .then((token) => {
          // console.log('RECAPTCHA', { token }); // eslint-disable-line
          callback(token);
        })
        .catch(this.onBookingError);
    });
  }
}
