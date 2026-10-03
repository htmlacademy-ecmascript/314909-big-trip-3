import {createElement} from '../render.js';
import {POINT_TYPES, DateFormat} from '../const.js';
import {formatDate, capitalize} from '../utils.js';

const BLANK_POINT = {
  type: 'flight',
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
};

function createTypeListTemplate(currentType) {
  return POINT_TYPES.map((type) => (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalize(type)}</label>
    </div>`
  )).join('');
}

function createDestinationListTemplate(destinations) {
  return destinations.map(({name}) => `<option value="${name}"></option>`).join('');
}

function createOffersTemplate(offers, selectedOfferIds) {
  if (offers.length === 0) {
    return '';
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map(({id, title, price}) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}" ${selectedOfferIds.includes(id) ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`).join('')}
      </div>
    </section>`
  );
}

function createPicturesTemplate(pictures) {
  if (pictures.length === 0) {
    return '';
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
      </div>
    </div>`
  );
}

function createDestinationTemplate(destination) {
  if (!destination || (!destination.description && destination.pictures.length === 0)) {
    return '';
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${destination.description ? `<p class="event__destination-description">${destination.description}</p>` : ''}
      ${createPicturesTemplate(destination.pictures)}
    </section>`
  );
}

function createDetailsTemplate(offersTemplate, destinationTemplate) {
  if (!offersTemplate && !destinationTemplate) {
    return '';
  }

  return (
    `<section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>`
  );
}

function createEditFormTemplate(point, destination, offers, destinations) {
  const {type, dateFrom, dateTo, basePrice} = point;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTypeListTemplate(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalize(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name ?? ''}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDestinationListTemplate(destinations)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, DateFormat.FORM_DATE_TIME)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, DateFormat.FORM_DATE_TIME)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        ${createDetailsTemplate(createOffersTemplate(offers, point.offers), createDestinationTemplate(destination))}
      </form>
    </li>`
  );
}

export default class EditFormView {
  constructor({point = BLANK_POINT, destination = null, offers = [], destinations = []}) {
    this.point = point;
    this.destination = destination;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createEditFormTemplate(this.point, this.destination, this.offers, this.destinations);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
