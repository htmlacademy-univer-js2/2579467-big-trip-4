import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class DesintationsApiService extends ApiService {
  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  async updateEvent(destinations) {
    const response = await this._load({
      url: `destinations/${destinations.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(destinations)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });


    const parsedResponse = await ApiService.parseResponse(response);


    return parsedResponse;
  }

  #adaptToServer(destinations) {
    const adaptedDestinations = {...destinations,
      'name': destinations.cityName
    };

    delete adaptedDestinations.cityName;

    return adaptedDestinations;
  }
}
