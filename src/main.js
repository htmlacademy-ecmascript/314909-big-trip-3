import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './mock/filter.js';
import {FilterType} from './const.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointsModel,
});

render(new FilterView({
  filters: generateFilter(pointsModel.points),
  currentFilterType: FilterType.EVERYTHING,
}), filterContainer);
tripPresenter.init();
