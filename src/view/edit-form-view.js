import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {POINT_TYPES, DateFormat} from '../const.js';
import {formatDate, capitalize, encodeHtml, getValidPointType} from '../utils.js';

const BLANK_POINT = {
  type: 'flight',
  destination: null,
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
  isSaving: false,
  isDeleting: false,
};

const END_DATE_PICKER_INDEX = 1;

function createTypeListTemplate(currentType, isDisabled) {
  return POINT_TYPES.map(
    (type) =>
      /* HTML */ `<div class="event__type-item">
        <input
          id="event-type-${type}-1"
          class="event__type-input  visually-hidden"
          type="radio"
          name="event-type"
          value="${type}"
          ${type === currentType ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}
        />
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1"
          >${capitalize(type)}</label
        >
      </div>`,
  ).join('');
}

function createDestinationListTemplate(destinations) {
  return destinations.map(({name}) => /* HTML */ `<option value="${encodeHtml(name)}"></option>`).join('');
}

function getDestinationById(destinations, destinationId) {
  return destinations.find(({id}) => id === destinationId);
}

function getOffersByType(offersByType, type) {
  return offersByType.find((offers) => offers.type === type)?.offers ?? [];
}

function createOffersTemplate(offers, selectedOfferIds, isDisabled) {
  if (offers.length === 0) {
    return '';
  }

  const selectors = offers.map(
    ({id, title, price}) =>
      /* HTML */ `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${encodeHtml(id)}"
          type="checkbox"
          name="event-offer-${encodeHtml(id)}"
          data-offer-id="${encodeHtml(id)}"
          ${selectedOfferIds.includes(id) ? 'checked' : ''}
          ${isDisabled ? 'disabled' : ''}
        />
        <label class="event__offer-label" for="event-offer-${encodeHtml(id)}">
          <span class="event__offer-title">${encodeHtml(title)}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${encodeHtml(price)}</span>
        </label>
      </div>`,
  );

  return /* HTML */ `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">${selectors.join('')}</div>
  </section>`;
}

function createPicturesTemplate(pictures) {
  if (pictures.length === 0) {
    return '';
  }

  return /* HTML */ `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map(({src, description}) => /* HTML */ `<img class="event__photo" src="${encodeHtml(src)}" alt="${encodeHtml(description)}" />`).join('')}
    </div>
  </div>`;
}

function createDestinationTemplate(destination) {
  if (!destination || (!destination.description && destination.pictures.length === 0)) {
    return '';
  }

  return /* HTML */ `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${destination.description ? `<p class="event__destination-description">${encodeHtml(destination.description)}</p>` : ''}
    ${createPicturesTemplate(destination.pictures)}
  </section>`;
}

function createDetailsTemplate(offersTemplate, destinationTemplate) {
  if (!offersTemplate && !destinationTemplate) {
    return '';
  }

  return /* HTML */ `<section class="event__details">${offersTemplate} ${destinationTemplate}</section>`;
}

function createRollupButtonTemplate(isNewPoint, isDisabled) {
  if (isNewPoint) {
    return '';
  }

  return /* HTML */ `<button class="event__rollup-btn" type="button" aria-disabled="${isDisabled}">
    <span class="visually-hidden">Open event</span>
  </button>`;
}

function getResetButtonText(isNewPoint, isDeleting) {
  if (isDeleting) {
    return 'Deleting...';
  }

  return isNewPoint ? 'Cancel' : 'Delete';
}

function createEditFormTemplate(point, destinations, offersByType) {
  const {type, dateFrom, dateTo, basePrice, isSaving = false, isDeleting = false} = point;
  const validPointType = getValidPointType(type);
  const isNewPoint = !point.id;
  const isDisabled = isSaving || isDeleting;
  const destination = getDestinationById(destinations, point.destination);
  const offers = getOffersByType(offersByType, validPointType);

  return /* HTML */ `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post" aria-busy="${isDisabled}">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img
              class="event__type-icon"
              width="17"
              height="17"
              src="img/icons/${validPointType}.png"
              alt="Event type icon"
            />
          </label>
          <input
            class="event__type-toggle  visually-hidden"
            id="event-type-toggle-1"
            type="checkbox"
            ${isDisabled ? 'disabled' : ''}
          />

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypeListTemplate(validPointType, isDisabled)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${capitalize(validPointType)}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${encodeHtml(destination?.name)}"
            list="destination-list-1"
            required
            ${isDisabled ? 'disabled' : ''}
          />
          <datalist id="destination-list-1">${createDestinationListTemplate(destinations)}</datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${formatDate(dateFrom, DateFormat.FORM_DATE_TIME)}"
            required
            ${isDisabled ? 'disabled' : ''}
          />
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${formatDate(dateTo, DateFormat.FORM_DATE_TIME)}"
            required
            ${isDisabled ? 'disabled' : ''}
          />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${encodeHtml(basePrice)}"
            min="1"
            step="1"
            required
            ${isDisabled ? 'disabled' : ''}
          />
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset" aria-disabled="${isDisabled}">
          ${getResetButtonText(isNewPoint, isDeleting)}
        </button>
        ${createRollupButtonTemplate(isNewPoint, isDisabled)}
      </header>
      ${createDetailsTemplate(createOffersTemplate(offers, point.offers, isDisabled), createDestinationTemplate(destination))}
    </form>
  </li>`;
}

export default class EditFormView extends AbstractStatefulView {
  #offersByType = [];
  #destinations = [];
  #datePickers = [];
  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;

  constructor({point = BLANK_POINT, offersByType = [], destinations = [], onFormSubmit, onRollupClick, onDeleteClick}) {
    super();
    this._state = {...point};
    this.#offersByType = offersByType;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;

    this.#setEventListeners();
    this.#setDatePickers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations, this.#offersByType);
  }

  get isDisabled() {
    return this._state.isSaving || this._state.isDeleting;
  }

  removeElement() {
    this.#datePickers.forEach((datePicker) => datePicker.destroy());
    this.#datePickers = [];
    super.removeElement();
  }

  _restoreHandlers() {
    this.#setEventListeners();
    this.#setDatePickers();
  }

  setSaving() {
    this.updateElement({isSaving: true});
  }

  setDeleting() {
    this.updateElement({isDeleting: true});
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleFormSubmit({...this._state, basePrice: Number(this._state.basePrice)});
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);
  };

  #typeChangeHandler = (evt) => {
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const destination = this.#destinations.find(({name}) => name === evt.target.value);

    this.updateElement({destination: destination?.id ?? null});
  };

  #destinationInputHandler = (evt) => {
    const isDestinationValid = this.#destinations.some(({name}) => name === evt.target.value);

    evt.target.setCustomValidity(isDestinationValid ? '' : 'Select a destination from the list');
  };

  #priceInputHandler = (evt) => {
    this._setState({basePrice: evt.target.value});
  };

  #offersChangeHandler = () => {
    const selectedOffers = [...this.element.querySelectorAll('.event__offer-checkbox:checked')];
    this._setState({offers: selectedOffers.map((input) => input.dataset.offerId)});
  };

  #dateFromChangeHandler = ([selectedDate]) => {
    const dateFrom = selectedDate?.toISOString() ?? null;
    const endDatePicker = this.#datePickers[END_DATE_PICKER_INDEX];
    const [dateTo] = endDatePicker.selectedDates;

    endDatePicker.set('minDate', selectedDate ?? null);

    if (selectedDate && dateTo && selectedDate > dateTo) {
      endDatePicker.setDate(selectedDate);
      this._setState({dateFrom, dateTo: dateFrom});
      return;
    }

    this._setState({dateFrom});
  };

  #dateToChangeHandler = ([selectedDate]) => {
    this._setState({dateTo: selectedDate?.toISOString() ?? null});
  };

  #setEventListeners() {
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#rollupButtonClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
    this.element
      .querySelectorAll('.event__type-input')
      .forEach((typeInput) => typeInput.addEventListener('change', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationInputHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
  }

  #setDatePickers() {
    const commonOptions = {
      enableTime: true,
      dateFormat: DateFormat.FLATPICKR_DATE_TIME,
    };

    this.#datePickers = [
      flatpickr(this.element.querySelector('[name="event-start-time"]'), {
        ...commonOptions,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      }),
      flatpickr(this.element.querySelector('[name="event-end-time"]'), {
        ...commonOptions,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      }),
    ];
  }
}
