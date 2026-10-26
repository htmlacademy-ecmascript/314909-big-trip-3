import AbstractView from '../framework/view/abstract-view.js';
import {capitalize} from '../utils.js';

function createFilterItemTemplate({type, count}, currentFilterType) {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? 'checked' : ''} ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalize(type)}</label>
    </div>`
  );
}

function createFilterTemplate(filters, currentFilterType) {
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilterType = null;

  constructor({filters, currentFilterType}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }
}
