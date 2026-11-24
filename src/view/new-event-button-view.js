export default class NewEventButtonView {
  #button = null;

  constructor(button) {
    this.#button = button;
  }

  setClickHandler(handler) {
    this.#button.addEventListener('click', handler);
  }

  setDisabled(isDisabled) {
    this.#button.disabled = isDisabled;
  }
}
