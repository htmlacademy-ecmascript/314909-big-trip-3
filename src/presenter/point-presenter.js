import {render, replace, remove, RenderPosition} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import {UpdateType, UserAction} from '../const.js';

export default class PointPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #handleDestroy = null;

  #pointComponent = null;
  #editFormComponent = null;
  #point = null;
  #isNewPoint = false;

  constructor({pointListContainer, pointsModel, onDataChange, onModeChange, onDestroy = () => {}}) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleDestroy = onDestroy;
  }

  init(point = null) {
    this.#point = point;
    this.#isNewPoint = point === null;

    if (this.#isNewPoint) {
      this.#editFormComponent = this.#createForm();
      render(this.#editFormComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      return;
    }

    this.resetView();
    const previousPointComponent = this.#pointComponent;
    this.#pointComponent = new PointView({
      point,
      destination: this.#pointsModel.getDestinationById(point.destination),
      offers: this.#pointsModel.getOffersByType(point.type),
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (previousPointComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    replace(this.#pointComponent, previousPointComponent);
  }

  resetView() {
    if (this.#isNewPoint) {
      this.#handleDestroy();
      return;
    }

    if (this.#editFormComponent === null) {
      return;
    }

    replace(this.#pointComponent, this.#editFormComponent);
    remove(this.#editFormComponent);
    this.#editFormComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setAborting() {
    if (this.#editFormComponent !== null) {
      this.#editFormComponent.updateElement({isSaving: false, isDeleting: false});
      this.#editFormComponent.shake();
      return;
    }

    this.#pointComponent.shake();
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #createForm() {
    return new EditFormView({
      point: this.#point ?? undefined,
      offersByType: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick,
    });
  }

  #handleEditClick = () => {
    this.#handleModeChange();
    this.#editFormComponent = this.#createForm();
    replace(this.#editFormComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#editFormComponent.setSaving();
    const actionType = this.#isNewPoint ? UserAction.ADD_POINT : UserAction.UPDATE_POINT;
    this.#handleDataChange(actionType, UpdateType.MINOR, point);
  };

  #handleRollupClick = () => {
    this.resetView();
  };

  #handleDeleteClick = (point) => {
    if (this.#isNewPoint) {
      this.#handleDestroy();
      return;
    }

    this.#editFormComponent.setDeleting();
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key !== 'Escape') {
      return;
    }

    if (this.#editFormComponent.isDisabled) {
      return;
    }

    evt.preventDefault();
    this.resetView();
  };
}
