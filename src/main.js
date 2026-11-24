import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import BigTripApiService from './api/big-trip-api-service.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic c7v2n5k9m4q8x1z6';

dayjs.extend(duration);

const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const newEventButton = document.querySelector('.trip-main__event-add-btn');
const tripInfoTemplate = document.querySelector('#trip-info-template');

const apiService = new BigTripApiService(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel({apiService});
const filterModel = new FilterModel();
const tripPresenter = new TripPresenter({
  container: tripEventsContainer,
  newEventButton,
  pointsModel,
  filterModel,
});
const filterPresenter = new FilterPresenter({
  filterContainer,
  pointsModel,
  filterModel,
});
const tripInfoPresenter = new TripInfoPresenter({
  template: tripInfoTemplate,
  pointsModel,
});

newEventButton.addEventListener('click', () => tripPresenter.createPoint());

tripPresenter.showLoading();

async function bootstrap() {
  try {
    await Promise.all([pointsModel.init(), pointsModel.initDestinations(), pointsModel.initOffers()]);

    filterPresenter.init();
    tripInfoPresenter.init();
    tripPresenter.init();
    newEventButton.disabled = false;
  } catch {
    tripPresenter.showLoadingError();
  }
}

bootstrap();
