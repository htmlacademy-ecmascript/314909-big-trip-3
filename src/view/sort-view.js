import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';
import {capitalize} from '../utils.js';

const SortLabel = {
  [SortType.OFFERS]: 'Offers',
};

function createSortItemTemplate({type, isDisabled}, currentSortType) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${type}">
      <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${type === currentSortType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${type}">${SortLabel[type] ?? capitalize(type)}</label>
    </div>`
  );
}

function createSortTemplate(sortItems, currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItems.map((sortItem) => createSortItemTemplate(sortItem, currentSortType)).join('')}
    </form>`
  );
}

export default class SortView extends AbstractView {
  #sortItems = [];
  #currentSortType = null;

  constructor({sortItems, currentSortType}) {
    super();
    this.#sortItems = sortItems;
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#sortItems, this.#currentSortType);
  }
}
