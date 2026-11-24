import {render, replace, remove} from '../framework/render.js';
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
  #isEditMode = false;
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

    const destination = point ? this.#pointsModel.getDestinationById(point.destination) : null;
    const offers = point ? this.#pointsModel.getOffersByType(point.type) : [];
    const previousPointComponent = this.#pointComponent;
    const previousEditFormComponent = this.#editFormComponent;

    this.#editFormComponent = new EditFormView({
      point: point ?? undefined,
      offersByType: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick,
      onDeleteClick: this.#handleDeleteClick,
    });

    if (this.#isNewPoint) {
      render(this.#editFormComponent, this.#pointListContainer);
      this.#isEditMode = true;
      document.addEventListener('keydown', this.#escKeyDownHandler);
      return;
    }

    this.#pointComponent = new PointView({
      point,
      destination,
      offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    if (previousPointComponent === null || previousEditFormComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#isEditMode) {
      replace(this.#editFormComponent, previousEditFormComponent);
      return;
    }

    replace(this.#pointComponent, previousPointComponent);
  }

  resetView() {
    if (this.#isNewPoint) {
      this.#handleDestroy();
      return;
    }

    if (!this.#isEditMode) {
      return;
    }

    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setAborting() {
    if (this.#isEditMode) {
      this.#editFormComponent.shake(() =>
        this.#editFormComponent.updateElement({
          isSaving: false,
          isDeleting: false,
        }),
      );
      return;
    }

    this.#pointComponent.shake();
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#isEditMode = true;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#isEditMode = false;
  }

  #handleEditClick = () => {
    this.#handleModeChange();
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#editFormComponent.setSaving();
    const actionType = this.#isNewPoint ? UserAction.ADD_POINT : UserAction.UPDATE_POINT;
    this.#handleDataChange(actionType, UpdateType.MINOR, point);
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
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
    if (this.#isNewPoint) {
      this.#handleDestroy();
      return;
    }

    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
