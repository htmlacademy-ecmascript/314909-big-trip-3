import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';
import {capitalize} from '../utils.js';

const SortLabel = {
  [SortType.OFFERS]: 'Offers',
};

function createSortItemTemplate({type, isDisabled}, currentSortType) {
  return /* HTML */ `<div class="trip-sort__item  trip-sort__item--${type}">
    <input
      id="sort-${type}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="${type}"
      data-sort-type="${type}"
      ${type === currentSortType ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    />
    <label class="trip-sort__btn" for="sort-${type}">${SortLabel[type] ?? capitalize(type)}</label>
  </div>`;
}

function createSortTemplate(sortItems, currentSortType) {
  return /* HTML */ `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItems.map((sortItem) => createSortItemTemplate(sortItem, currentSortType)).join('')}
  </form>`;
}

export default class SortView extends AbstractView {
  #sortItems = [];
  #currentSortType = null;
  #handleSortTypeChange = null;

  constructor({sortItems, currentSortType, onSortTypeChange = () => {}}) {
    super();
    this.#sortItems = sortItems;
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeClickHandler);
  }

  get template() {
    return createSortTemplate(this.#sortItems, this.#currentSortType);
  }

  #sortTypeClickHandler = (evt) => {
    const sortInput = evt.target.closest('.trip-sort__input');

    if (sortInput === null) {
      return;
    }

    this.#handleSortTypeChange(sortInput.dataset.sortType);
  };
}
