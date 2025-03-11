import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #events = [];

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;

  }

  get events() {
    return this.#events;
  }

  set events(events) {
    this.#events = events;
  }

  async init() {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch(err) {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      return;
    }

    const response = await this.#eventsApiService.updateEvent(update);
    const updatedEvent = this.#adaptToClient(response);
    this.#events.splice(index, 1, updatedEvent);

    this._notify(updateType, updatedEvent);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((event) => event.id === update.id);
    this.#events.splice(index, 1);

    this._notify(updateType);
  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      price: event['base_price'],
      startDate: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      endDate: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      destinationID: event['destination'],
      isFavorite: event['is_favorite']
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];
    delete adaptedEvent['destination'];

    return adaptedEvent;
  }
}
