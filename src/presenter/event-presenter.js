import { render } from '../framework/render.js';
import { replace } from '../framework/render.js';
import { remove } from '../framework/render.js';
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
        document.removeEventListener('keydown', this.#escKeyDownHandler);
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

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToEvent();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };


  #replaceEventToForm() {
    replace(this.#eventEditComponent, this.#eventComponent);
    this.#handleViewChange();
    this.#isEventEditing = true;
  }

  #replaceFormToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    this.#isEventEditing = false;
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  resetView() {
    if (this.#isEventEditing) {
      this.#replaceFormToEvent();
    }
  }

}
