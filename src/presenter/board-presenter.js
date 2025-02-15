import SortView from '../view/sort-view.js';
import FormCreateView from '../view/creation-form-view.js';
import FormEditView from '../view/editing-form-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import FilterView from '../view/filter-view.js';
import { render } from '../framework/render.js';
import { replace } from '../framework/render.js';

export default class BoardPresenter {
  #eventListComponent = new EventListView();
  #eventsContainer = null;
  #filterContainer = null;
  #eventsModel = null;

  constructor({eventsModel}) {
    this.#eventsContainer = document.querySelector('.trip-events');
    this.#filterContainer = document.querySelector('.trip-controls__filters');
    this.#eventsModel = eventsModel;
  }

  init() {
    this.boardEvents = [...this.#eventsModel.events];

    render(new FilterView(), this.#filterContainer);
    render(new SortView(), this.#eventsContainer);
    render(this.#eventListComponent, this.#eventsContainer);

    for (let i = 0; i < this.boardEvents.length; i++) {
      this.#renderEvent(this.boardEvents[i]);
    }

    render(new FormCreateView(), this.#eventListComponent.element);
  }

  #renderEvent(event) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView({
      event,
      onEditClick: () => {
        replaceEventToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const eventEditComponent = new FormEditView({
      event,
      onFormSubmit: () => {
        replaceFormToEvent();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceEventToForm() {
      replace(eventEditComponent, eventComponent);
    }

    function replaceFormToEvent() {
      replace(eventComponent, eventEditComponent);
    }

    render(eventComponent, this.#eventListComponent.element);
  }
}
