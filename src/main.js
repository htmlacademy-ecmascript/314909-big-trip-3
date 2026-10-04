import {render} from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  pointsModel,
});

render(new FilterView(), filterContainer);
render(new SortView(), tripEventsContainer);
tripPresenter.init();
