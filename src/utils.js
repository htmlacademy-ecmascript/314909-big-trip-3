import dayjs from 'dayjs';
import he from 'he';
import {DateFormat, FilterType, POINT_TYPES, SortType} from './const.js';

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;
const MAX_VISIBLE_DESTINATIONS = 3;

function formatDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getDurationInMinutes(dateFrom, dateTo) {
  return dayjs(dateTo).diff(dateFrom, 'minute');
}

function formatDuration(minutes) {
  const pointDuration = dayjs.duration(minutes, 'minutes');

  if (minutes < MINUTES_IN_HOUR) {
    return pointDuration.format('mm[M]');
  }

  if (minutes < MINUTES_IN_DAY) {
    return pointDuration.format('HH[H] mm[M]');
  }

  return `${String(Math.floor(pointDuration.asDays())).padStart(2, '0')}D ${pointDuration.format('HH[H] mm[M]')}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function encodeHtml(value) {
  return he.encode(String(value ?? ''));
}

function getValidPointType(type) {
  return POINT_TYPES.includes(type) ? type : POINT_TYPES[0];
}

function isPointFuture({dateFrom}) {
  return dayjs(dateFrom).isAfter(dayjs());
}

function isPointPresent({dateFrom, dateTo}) {
  const now = dayjs();

  return !dayjs(dateFrom).isAfter(now) && !dayjs(dateTo).isBefore(now);
}

function isPointPast({dateTo}) {
  return dayjs(dateTo).isBefore(dayjs());
}

function getTripRoute(destinations) {
  if (destinations.length <= MAX_VISIBLE_DESTINATIONS) {
    return destinations.join(' — ');
  }

  return `${destinations[0]} — ... — ${destinations[destinations.length - 1]}`;
}

function sortPointsByDate(points) {
  return [...points].sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom)));
}

function getTripDates(points) {
  if (points.length === 0) {
    return '';
  }

  const sortedPoints = sortPointsByDate(points);
  const startDate = dayjs(sortedPoints[0].dateFrom);
  const endDate = dayjs(sortedPoints[sortedPoints.length - 1].dateTo);

  if (startDate.isSame(endDate, 'day')) {
    return startDate.format(DateFormat.TRIP_DATE);
  }

  return `${startDate.format(DateFormat.TRIP_DATE)} — ${endDate.format(DateFormat.TRIP_DATE)}`;
}

function getTotalPrice(points, offersByType) {
  return points.reduce((totalPrice, point) => {
    const offers = offersByType.find((offer) => offer.type === point.type)?.offers ?? [];
    const selectedOffersPrice = offers
      .filter((offer) => (point.offers ?? []).includes(offer.id))
      .reduce((price, offer) => price + offer.price, 0);

    return totalPrice + point.basePrice + selectedOffersPrice;
  }, 0);
}

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPointPresent),
  [FilterType.PAST]: (points) => points.filter(isPointPast),
};

const sort = {
  [SortType.DAY]: (points) => points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom))),
  [SortType.TIME]: (points) =>
    points.sort(
      (pointA, pointB) =>
        getDurationInMinutes(pointB.dateFrom, pointB.dateTo) - getDurationInMinutes(pointA.dateFrom, pointA.dateTo),
    ),
  [SortType.PRICE]: (points) => points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice),
};

export {
  formatDate,
  getDurationInMinutes,
  formatDuration,
  capitalize,
  encodeHtml,
  getValidPointType,
  getTripRoute,
  getTripDates,
  getTotalPrice,
  sortPointsByDate,
  filter,
  sort,
};
