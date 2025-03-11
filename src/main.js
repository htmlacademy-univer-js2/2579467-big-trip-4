import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import EventsModel from './model/events-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import EventsApiService from './api/event-api-service.js';
import DesintationsApiService from './api/destination-api-service.js';
import OffersApiService from './api/offers-api-service.js';

const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic fo0w590z329779a';


const eventsModel = new EventsModel({
  eventsApiService: new EventsApiService(END_POINT, AUTHORIZATION)
});

const destinationsModel = new DestinationsModel({
  destinationsApiService: new DesintationsApiService(END_POINT, AUTHORIZATION)
});

await destinationsModel.init();

const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)
});

await offersModel.init();

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({eventsModel, filterModel, destinationsModel, offersModel, onNewEventDestroy: handleNewEventFormClose});

const filterContainer = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  eventsModel
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  boardPresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}


eventsModel.init().finally(() => {
  render(newEventButtonComponent, document.querySelector('.trip-main'));
});

boardPresenter.init();
filterPresenter.init();
