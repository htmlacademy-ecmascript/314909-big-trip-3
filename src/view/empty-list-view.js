import AbstractView from '../framework/view/abstract-view.js';
import {encodeHtml} from '../utils.js';

function createEmptyListTemplate(message) {
  return /* HTML */ `<p class="trip-events__msg">${encodeHtml(message)}</p>`;
}

export default class EmptyListView extends AbstractView {
  #message = '';

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyListTemplate(this.#message);
  }
}
