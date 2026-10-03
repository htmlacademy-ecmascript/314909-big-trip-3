import {getRandomPoint} from '../mock/points.js';
import {mockDestinations} from '../mock/destinations.js';
import {mockOffers} from '../mock/offers.js';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  destinations = mockDestinations;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    return this.destinations.find((destination) => destination.id === id);
  }

  getOffersByType(type) {
    return this.offers.find((offersByType) => offersByType.type === type)?.offers ?? [];
  }
}
