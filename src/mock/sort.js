import {SortType, DISABLED_SORT_TYPES} from '../const.js';

function generateSort() {
  return Object.values(SortType).map((sortType) => ({
    type: sortType,
    isDisabled: DISABLED_SORT_TYPES.includes(sortType),
  }));
}

export {generateSort};
