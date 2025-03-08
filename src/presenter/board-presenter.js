import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { UserAction, UpdateType, FilterType} from '../const.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import { filter } from '../filters.js';


export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #eventsContainer = null;
  #eventsModel = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #filterModel = null;
  #noEventComponent = null;

  #filterType = FilterType.EVERYTHING;

  constructor({eventsModel, filterModel, onNewEventDestroy}) {
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    this.#filterType = this.#filterModel.filter;
    const events = this.#eventsModel.events;
    const filteredEvents = filter[this.#filterType](events);

    return filteredEvents;
  }


  init() {

    render(new SortView(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (let i = 0; i < this.events.length; i++) {
      this.#renderEvent(this.events[i]);
    }

  }

  createEvent() {
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onViewChange: this.#handleViewChange
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents(events) {
    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (this.events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    events.forEach((event) => this.#renderEvent(event));
  }

  #renderNoEvents() {

    this.#noEventComponent = new NoEventView({
      filterType: this.#filterType
    });


    render(this.#noEventComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }


  #handleViewAction = (actionType, updateType, updatedEventList) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, updatedEventList);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, updatedEventList);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, updatedEventList);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderEvents(this.events);
        break;
    }
  };

  #clearBoard() {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleViewChange = () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

}
