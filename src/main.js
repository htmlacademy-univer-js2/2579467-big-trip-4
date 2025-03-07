import {render} from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import EventsModel from './model/events-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';


const eventsModel = new EventsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({eventsModel, filterModel, onNewEventDestroy: handleNewEventFormClose});

const filterContainer = document.querySelector('.trip-controls__filters');

boardPresenter.init();

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

render(newEventButtonComponent, document.querySelector('.trip-main'));


filterPresenter.init();
