import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #destinationsApiService = null;

  constructor({ destinationsApiService }) {
    super();
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch (err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

}
