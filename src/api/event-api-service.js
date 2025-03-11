import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventsApiService extends ApiService {
  get events() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  async updateEvent(event) {

    const response = await this._load({
      url: `points/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });


    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(event) {
    const adaptedEvent = {...event,
      'base_price': Number(event.price),
      'date_from': event.startDate instanceof Date ? event.startDate.toISOString() : null,
      'date_to': event.endDate instanceof Date ? event.endDate.toISOString() : null,
      'destination': event.destinationID,
      'is_favorite': event.isFavorite
    };

    delete adaptedEvent.price;
    delete adaptedEvent.startDate;
    delete adaptedEvent.endDate;
    delete adaptedEvent.destinationID;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
