import {createElement} from '../render.js';

function createEventListTemplate() {
  return '<div class="board__events"></div>';
}

export default class EventListView {
  getTemplate() {
    return createEventListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
