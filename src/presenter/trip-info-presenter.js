import {getTotalPrice, getTripDates, getTripRoute, sortPointsByDate} from '../utils.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoView = null;
  #pointsModel = null;

  constructor({template, pointsModel}) {
    this.#tripInfoView = new TripInfoView(template);
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      this.#tripInfoView.hide();
      return;
    }

    const destinations = sortPointsByDate(points)
      .map((point) => this.#pointsModel.getDestinationById(point.destination)?.name)
      .filter(Boolean);

    this.#tripInfoView.show({
      title: getTripRoute(destinations),
      dates: getTripDates(points),
      cost: getTotalPrice(points, this.#pointsModel.offers),
    });
  }

  #handlePointsModelEvent = () => {
    this.#renderTripInfo();
  };
}
