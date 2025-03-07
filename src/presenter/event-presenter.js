import { render } from '../framework/render.js';
import { replace } from '../framework/render.js';
import { remove } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import FormEditView from '../view/editing-form-view.js';
import EventView from '../view/event-view.js';

export default class EventPresenter {
  #eventListContainer = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #event = null;
  #handleDataChange = null;
  #handleViewChange = null;
  #isEventEditing = false;

  constructor({eventListContainer, onDataChange, onViewChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleViewChange = onViewChange;
  }

  init (event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      onEditClick: () => {
        this.#replaceEventToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new FormEditView({
      event: this.#event,
      onFormSubmit: () => {
        this.#replaceFormToEvent();
      },
      onDeleteClick: this.#handleDeleteClick,
      onCloseClick: () => {
        this.#replaceFormToEvent();
      }
    });

    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#eventListContainer.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventListContainer.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };


  #replaceEventToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    this.#handleViewChange();
    this.#isEventEditing = true;
  }

  #replaceFormToEvent() {
    const updatedEvent = this.#eventEditComponent._state;
    this.#event = updatedEvent;
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      updatedEvent);

    replace(this.#eventComponent, this.#eventEditComponent);
    this.#isEventEditing = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

  }

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite});
  };

  resetView() {
    if (this.#isEventEditing) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  }

  #handleDeleteClick = (event) => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

}
