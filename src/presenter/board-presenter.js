import SortView from '../view/sort-view.js';
import FormCreateView from '../view/creation-form-view.js';
import FormEditView from '../view/editing-form-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import FilterView from '../view/filter-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();

  constructor() {
    this.eventsContainer = document.querySelector('.trip-events');
    this.filterContainer = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new FormEditView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }

    render(new FormCreateView(), this.eventListComponent.getElement());
  }
}
