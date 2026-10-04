import dayjs from 'dayjs';
import {POINT_TYPES} from '../const.js';
import {getRandomInteger, getRandomArrayElement} from '../utils.js';
import {mockDestinations} from './destinations.js';
import {mockOffers} from './offers.js';

let pointId = 0;

function getRandomOfferIds(type) {
  const {offers} = mockOffers.find((offersByType) => offersByType.type === type);

  return offers
    .filter(() => Math.random() > 0.5)
    .map((offer) => offer.id);
}

function getRandomPoint() {
  const type = getRandomArrayElement(POINT_TYPES);
  const dateFrom = dayjs().add(getRandomInteger(-5, 5), 'day').add(getRandomInteger(0, 1440), 'minute');
  const dateTo = dateFrom.add(getRandomInteger(20, 3000), 'minute');

  pointId++;

  return {
    id: `point-${pointId}`,
    type,
    destination: getRandomArrayElement(mockDestinations).id,
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString(),
    basePrice: getRandomInteger(20, 1000),
    isFavorite: Math.random() > 0.5,
    offers: getRandomOfferIds(type),
  };
}

export {getRandomPoint};
