import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDestinationById, formatFormEventDate, formatEventTime, getOffersByType, getDestinationByCityName, setSaveButtonDisabled} from '../utils.js';

import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import { EMPTY_EVENT, EVENT_TYPES } from '../const.js';


function editFormViewTemplate(event) {
  const {startDate, endDate, type, price} = event;
  const formStartDate = startDate ? formatFormEventDate(startDate) : '';
  const formEndDate = endDate ? formatFormEventDate(endDate) : '';
  const startTime = startDate ? formatEventTime(startDate) : '';
  const endTime = endDate ? formatEventTime(endDate) : '';
  const destination = getDestinationById(event) || {};
  const destinationName = destination.cityName || '';
  const destinationDescription = destination.description || '';
  const offers = getOffersByType(event);

  const offersTemplate = offers
    .map((offer) => {
      const checked = event.offers.includes(offer.id) ? 'checked' : '';
      const offerName = offer.title.toLowerCase().split(' ').join('-');

      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-${offerName}" ${checked}>
        <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    }).join('');


  const eventTypeTemplate = EVENT_TYPES
    .map((eventType) => `<div class="event__type-item">
      <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${type === eventType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType[0].toUpperCase() + eventType.slice(1)}</label>
    </div>`).join('');

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypeTemplate}
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      <option value="Prague"></option>
                      <option value="Barcelona"></option>
                      <option value="Tokyo"></option>
                      <option value="Paris"></option>
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formStartDate} ${startTime}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formEndDate} ${endTime}">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>
                  <button class="event__save-btn btn btn--blue" type="submit" ${!destinationName || !startDate || !endDate ? 'disabled' : ''}>Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    ${offers.length > 0 ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}
                    <div class="event__available-offers">
                    ${offersTemplate}
                    </div>
                  </section>
                  <section class="event__section  event__section--destination">
                  ${destinationDescription ? '<h3 class="event__section-title  event__section-title--destination">Destination</h3>' : ''}
                    <p class="event__destination-description">${destinationDescription}</p>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class FormEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepicker = null;

  constructor({event = EMPTY_EVENT, onFormSubmit, onDeleteClick}) {
    super();
    this._setState(event);
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return editFormViewTemplate(this._state);
  }

  get state() {
    return this._state;
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#formCloseHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formCloseHandler);

    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('click', this.#eventTypeEditHandler);
    });

    this.element.querySelectorAll('.event__input--destination').forEach((input) => {
      input.addEventListener('change', this.#destinationEditHandler);
    });

    this.element.querySelectorAll('.event__offer-checkbox').forEach((input) => {
      input.addEventListener('click', this.#extraOffersEditHandler);
    });

    this.element.querySelectorAll('.event__input--price').forEach((input) => {
      input.addEventListener('change', this.#eventPriceEditHandler);
    });

    this.element.querySelectorAll('.event__input--price').forEach((input) => {
      input.addEventListener('keydown', this.#eventPriceValidateHandler);
    });

    this.#setDatepicker();

    this.element.querySelectorAll('.event__reset-btn').forEach((button) => {
      button.addEventListener('click', this.#formDeleteClickHandler);
    });

  }

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #eventTypeEditHandler = (evt) => {

    const target = evt.target;
    const eventType = target.value;

    this.updateElement({
      type: eventType,
      offers: []
    });
  };

  #destinationEditHandler = (evt) => {
    evt.preventDefault();
    const cityName = evt.target.value;
    const destination = getDestinationByCityName(cityName);

    if (destination) {
      this.updateElement({
        destinationID: destination.id
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #extraOffersEditHandler = (evt) => {
    const offerId = Number(evt.target.id);

    this.updateElement({
      offers: this._state.offers.includes(offerId) ? this._state.offers.filter((id) => id !== offerId) : [...this._state.offers, offerId]
    });

  };

  #eventPriceEditHandler = (evt) => {
    evt.preventDefault();
    const eventPrice = evt.target.value;

    if (eventPrice > 0) {
      this.updateElement({
        price: eventPrice
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #eventPriceValidateHandler = (evt) => {
    if (!/[0-9]/.test(evt.key) && evt.key !== 'Backspace') {
      evt.preventDefault();
    }
  };

  #startDateChangeHandler = ([userDate]) => {
    if (userDate <= this._state.endDate || this._state.endDate === null) {
      this.updateElement({
        startDate: userDate,
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #endDateChangeHandler = ([userDate]) => {
    if (userDate >= this._state.startDate || this._state.startDate === null) {
      this.updateElement({
        endDate: userDate,
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #setDatepicker() {
    this.#initDatepicker('#event-start-time-1', 'startDate', this.#startDateChangeHandler);
    this.#initDatepicker('#event-end-time-1', 'endDate', this.#endDateChangeHandler);
  }

  #initDatepicker(selector, stateKey, handler) {
    flatpickr(this.element.querySelector(selector), {
      dateFormat: 'd/m/y h:i',
      enableTime: true,
      defaultDate: this._state[stateKey] || undefined,
      onChange: handler,
    });
  }


  reset(event) {
    this.updateElement(event);
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this.state);
  };
}
