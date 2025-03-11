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
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleViewChange = null;
  #isEventEditing = false;
  #isEventSaving = true;
  #isOtherFormOpen = false;

  constructor({eventListContainer, onDataChange, onViewChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleViewChange = onViewChange;
  }

  init (event, destinations, offers) {
    this.#event = event;
    this.#destinations = destinations;
    this.#offers = offers;


    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: () => {
        this.#replaceEventToForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditComponent = new FormEditView({
      event: this.#event,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: async () => this.#replaceFormToEvent(),
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

      this.#isEventSaving = false;


      this.#eventEditComponent.reset(this.#event);
      this.#replaceFormToEvent();
    }
  };


  #replaceEventToForm() {

    this.#handleViewChange();
    this.#handleViewChange().then(() => {
      replace(this.#eventEditComponent, this.#eventComponent);
    });
    this.#isEventEditing = true;
  }

  async #replaceFormToEvent() {

    const updatedEvent = this.#eventEditComponent.parseStateToEvent(this.#eventEditComponent._state);
    const updatedDestination = this.#eventEditComponent.destinations;
    const updatedOffers = this.#eventEditComponent.offers;
    this.#event = updatedEvent;

    if (!this.#isOtherFormOpen && this.#isEventSaving) {
      await this.#handleDataChange(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        updatedEvent,
        updatedDestination,
        updatedOffers
      );
    }

    this.#isEventSaving = true;
    this.#isOtherFormOpen = false;

    replace(this.#eventComponent, this.#eventEditComponent);
    this.#isEventEditing = false;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

  }

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...this.#event, isFavorite: !this.#event.isFavorite});
  };

  resetView() {
    if (this.#isEventEditing) {
      this.#eventEditComponent.reset(this.#event);
      this.#isOtherFormOpen = true;
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

  setSaving() {
    if (this.#isEventEditing) {
      this.#eventEditComponent.updateElement({
        isSaving: true,
        isDisabled: true
      });
    }
  }


}
