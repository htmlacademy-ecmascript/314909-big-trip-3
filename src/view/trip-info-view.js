export default class TripInfoView {
  #template = null;
  #element = null;
  #titleElement = null;
  #datesElement = null;
  #costElement = null;

  constructor(template) {
    this.#template = template;
    this.#element = template.content.firstElementChild.cloneNode(true);
    this.#titleElement = this.#element.querySelector('.trip-info__title');
    this.#datesElement = this.#element.querySelector('.trip-info__dates');
    this.#costElement = this.#element.querySelector('.trip-info__cost-value');
  }

  show({title, dates, cost}) {
    this.#titleElement.textContent = title;
    this.#datesElement.textContent = dates;
    this.#costElement.textContent = cost;

    if (!this.#element.isConnected) {
      this.#template.after(this.#element);
    }
  }

  hide() {
    this.#element.remove();
  }
}
