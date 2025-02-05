import BoardView from '../view/board-view.js';
import SortView from '../view/sort-view.js';
import FormCreateView from '../view/creation-form-view.js';
import FormEditView from '../view/editing-form-view.js';
import EventListView from '../view/event-list-view.js';
import EventView from '../view/event-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  eventListComponent = new EventListView();

  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.eventListComponent, this.boardComponent.getElement());
    render(new FormEditView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.eventListComponent.getElement());
    }

    render(new FormCreateView(), this.eventListComponent.getElement());
  }
}
