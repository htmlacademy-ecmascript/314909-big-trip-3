import AbstractView from '../framework/view/abstract-view.js';
import {EmptyListMessage} from '../const.js';

function createEmptyListTemplate(filterType) {
  return (
    `<p class="trip-events__msg">${EmptyListMessage[filterType]}</p>`
  );
}

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyListTemplate(this.#filterType);
  }
}
