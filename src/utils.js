import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;

function getRandomInteger(min, max) {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrayElement(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function formatDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

function getDuration(dateFrom, dateTo) {
  const minutes = dayjs(dateTo).diff(dateFrom, 'minute');
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

export {getRandomInteger, getRandomArrayElement, formatDate, getDuration, capitalize};
