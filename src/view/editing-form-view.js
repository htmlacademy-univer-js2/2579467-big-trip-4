import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDestinationById, formatFormEventDate, formatEventTime, getOffersByType, getDestinationByCityName, setSaveButtonDisabled} from '../utils.js';

import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

function editFormViewTemplate(event) {
  const {startDate, endDate, type, price} = event;
  const formStartDate = formatFormEventDate(startDate);
  const formEndDate = formatFormEventDate(endDate);
  const startTime = formatEventTime(startDate);
  const endTime = formatEventTime(endDate);
  const destination = getDestinationById(event);
  const destinationName = destination.cityName;
  const destinationDescription = destination.description;
  const offers = getOffersByType(event);
  const offersTemplate = offers
    .map((offer) => {
      const checked = event.offers.includes(offer.id) ? 'checked' : '';
      const offerName = offer.title.toLowerCase().split(' ').join('-');

      return `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerName}-${offer.id}" type="checkbox" name="event-offer-${offerName}" ${checked}>
        <label class="event__offer-label" for="event-offer-${offerName}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
    }).join('');

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
                        <div class="event__type-item">
                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                        </div>
                        <div class="event__type-item">
                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                        </div>
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
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                    ${offersTemplate}
                    </div>
                  </section>
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationDescription}</p>
                  </section>
                </section>
              </form>
            </li>`;
}

export default class FormEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #datepicker = null;

  constructor({event, onFormSubmit}) {
    super();
    this._setState(FormEditView.parseEventToState(event));
    this.#handleFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return editFormViewTemplate(this._state);
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

    this.#setDatepicker();
  }

  #formCloseHandler = (evt) => {
    evt.preventDefault();
    const updatedEvent = FormEditView.parseStateToEvent(this._state);
    this.#handleFormSubmit(updatedEvent);
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
    const offerId = Number(evt.target.id.slice(-1));
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

  #startDateChangeHandler = ([userDate]) => {
    if (userDate <= this._state.endDate) {
      this.updateElement({
        startDate: userDate,
      });
    } else {
      setSaveButtonDisabled();
    }
  };

  #endDateChangeHandler = ([userDate]) => {
    if (userDate >= this._state.startDate) {
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
      defaultDate: this._state[stateKey],
      onChange: handler,
    });
  }


  reset(event) {
    this.updateElement(FormEditView.parseStateToEvent(event));
  }

  static parseEventToState(event) {
    return {...event};
  }

  static parseStateToEvent(state) {
    const event = {...state};

    return event;
  }
}
