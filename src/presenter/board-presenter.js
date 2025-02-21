import SortView from '../view/sort-view.js';
import FormCreateView from '../view/creation-form-view.js';
import EventListView from '../view/event-list-view.js';
import FilterView from '../view/filter-view.js';
import { render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils.js';

export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #eventsContainer = null;
  #filterContainer = null;
  #eventsModel = null;
  #boardEvents = [];
  #eventPresenters = new Map();

  constructor({eventsModel}) {
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#eventsModel = eventsModel;

  }

  init() {
    this.#boardEvents = [...this.#eventsModel.events];

    render(new FilterView(), this.#filterContainer);
    render(new SortView(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (let i = 0; i < this.#boardEvents.length; i++) {
      this.#renderEvent(this.#boardEvents[i]);
    }

    render(new FormCreateView(), this.#eventListComponent.element);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleEventChange,
      onViewChange: this.#handleViewChange
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #handleEventChange = (updatedEventList) => {
    this.#boardEvents = updateItem(this.#boardEvents, updatedEventList);
    this.#eventPresenters.get(updatedEventList.id).init(updatedEventList);
  };

  #handleViewChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };
}
