import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import NoEventView from '../view/no-event-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { UserAction, UpdateType, FilterType} from '../const.js';
import EventPresenter from './event-presenter.js';
import NewEventPresenter from './new-event-presenter.js';
import LoadingView from '../view/loading-view.js';
import { filter } from '../filters.js';


export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #eventsContainer = null;
  #eventsModel = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventPresenters = new Map();
  #newEventPresenter = null;
  #filterModel = null;
  #noEventComponent = null;
  #loadingComponent = new LoadingView();
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor({eventsModel, filterModel, destinationsModel, offersModel, onNewEventDestroy}) {
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

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

  get destinations() {
    const destinations = this.#destinationsModel.destinations;

    return destinations;
  }

  get offers() {
    const offers = this.#offersModel.offers;

    return offers;
  }


  init() {

    render(new SortView(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    for (let i = 0; i < this.events.length; i++) {
      this.#renderEvent(this.events[i], this.destinations, this.offers);
    }

  }

  createEvent() {
    this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init(this.destinations, this.offers);
  }

  #renderEvent(event, destinations, offers) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onViewChange: this.#handleViewChange
    });

    eventPresenter.init(event, destinations, offers);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEvents(events, destinations, offers) {


    if (this.events.length === 0) {
      this.#renderNoEvents();
      return;
    }

    events.forEach((event) => {
      this.#renderEvent(event, destinations, offers);
    });
  }

  #renderNoEvents() {

    this.#noEventComponent = new NoEventView({
      filterType: this.#filterType
    });


    render(this.#noEventComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }


  #handleViewAction = async (actionType, updateType, updatedEventList) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(updatedEventList.id).setSaving();
        await this.#eventsModel.updateEvent(updateType, updatedEventList);
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
        this.#eventPresenters.get(data.id).init(data, this.destinations, this.offers);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderEvents(this.events, this.destinations, this.offers);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#clearBoard();
        this.#renderEvents(this.events, this.destinations, this.offers);
        break;
    }

  };

  #clearBoard() {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
    remove(this.#loadingComponent);
    remove(this.#noEventComponent);
  }

  #handleViewChange = async () => {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

}
