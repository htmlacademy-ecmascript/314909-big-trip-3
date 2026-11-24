import {getTotalPrice, getTripDates, getTripRoute, sortPointsByDate} from '../utils.js';

export default class TripInfoPresenter {
  #template = null;
  #element = null;
  #pointsModel = null;
  #tripTitleElement = null;
  #tripDatesElement = null;
  #tripCostElement = null;

  constructor({template, pointsModel}) {
    this.#template = template;
    this.#element = template.content.firstElementChild.cloneNode(true);
    this.#pointsModel = pointsModel;
    this.#tripTitleElement = this.#element.querySelector('.trip-info__title');
    this.#tripDatesElement = this.#element.querySelector('.trip-info__dates');
    this.#tripCostElement = this.#element.querySelector('.trip-info__cost-value');

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
  }

  init() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    const points = this.#pointsModel.points;

    if (points.length === 0) {
      this.#element.remove();
      return;
    }

    if (!this.#element.isConnected) {
      this.#template.after(this.#element);
    }

    const destinations = sortPointsByDate(points)
      .map((point) => this.#pointsModel.getDestinationById(point.destination)?.name)
      .filter(Boolean);

    this.#tripTitleElement.textContent = getTripRoute(destinations);
    this.#tripDatesElement.textContent = getTripDates(points);
    this.#tripCostElement.textContent = getTotalPrice(points, this.#pointsModel.offers);
  }

  #handlePointsModelEvent = () => {
    this.#renderTripInfo();
  };
}
