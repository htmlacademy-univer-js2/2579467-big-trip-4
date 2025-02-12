import SortView from '../view/sort-view.js';
import FormCreateView from '../view/creation-form-view.js';
import FormEditView from '../view/editing-form-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import FilterView from '../view/filter-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  eventListComponent = new EventListView();

  constructor({eventsModel}) {
    this.eventsContainer = document.querySelector('.trip-events');
    this.filterContainer = document.querySelector('.trip-controls__filters');
    this.eventsModel = eventsModel;
  }

  init() {
    this.boardEvents = [...this.eventsModel.getEvents()];

    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.eventsContainer);
    render(this.eventListComponent, this.eventsContainer);
    render(new FormEditView({event: this.boardEvents[0]}), this.eventListComponent.getElement());

    for (let i = 1; i < this.boardEvents.length; i++) {
      render(new EventView({event: this.boardEvents[i]}), this.eventListComponent.getElement());
    }

    render(new FormCreateView(), this.eventListComponent.getElement());
  }
}
