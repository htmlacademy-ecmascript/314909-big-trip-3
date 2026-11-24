const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DateFormat = {
  POINT_DAY: 'MMM D',
  POINT_TIME: 'HH:mm',
  FORM_DATE_TIME: 'DD/MM/YY HH:mm',
  FLATPICKR_DATE_TIME: 'd/m/y H:i',
  TRIP_DAY: 'DD',
  TRIP_DATE: 'DD MMM',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offer',
};

const DISABLED_SORT_TYPES = [SortType.EVENT, SortType.OFFERS];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const EmptyListMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

const LoadingMessage = 'Loading...';
const FailedLoadingMessage = 'Failed to load latest route information';

export {
  POINT_TYPES,
  DateFormat,
  FilterType,
  SortType,
  DISABLED_SORT_TYPES,
  UserAction,
  UpdateType,
  TimeLimit,
  EmptyListMessage,
  LoadingMessage,
  FailedLoadingMessage,
};
