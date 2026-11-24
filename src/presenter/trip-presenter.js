import {render, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {generateSort} from '../mock/sort.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import {
  EmptyListMessage,
  FAILED_LOADING_MESSAGE,
  FilterType,
  LOADING_MESSAGE,
  SortType,
  TimeLimit,
  UpdateType,
  UserAction,
} from '../const.js';
import {filter, sort} from '../utils.js';

export default class TripPresenter {
  #container = null;
  #newEventButton = null;
  #pointsModel = null;
  #filterModel = null;

  #pointListComponent = null;
  #currentSortType = SortType.DAY;
  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  #sortComponent = null;
  #emptyListComponent = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #isInitialized = false;
  #uiBlocker = new UiBlocker(TimeLimit);

  constructor({container, newEventButton, pointsModel, filterModel}) {
    this.#container = container;
    this.#newEventButton = newEventButton;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handlePointsModelEvent);
    this.#filterModel.addObserver(this.#handleFilterModelEvent);
  }

  init() {
    if (!this.#isInitialized) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
      this.#isInitialized = true;
    }

    this.#renderTrip();
  }

  showLoading() {
    this.#showMessage(LOADING_MESSAGE);
  }

  showLoadingError() {
    this.#showMessage(FAILED_LOADING_MESSAGE);
  }

  createPoint() {
    if (this.#newPointPresenter !== null) {
      return;
    }

    this.#filterModel.filter = FilterType.EVERYTHING;
    this.#newEventButton.setDisabled(true);

    if (this.#pointListComponent === null) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
      this.#pointListComponent = new PointListView();
      render(this.#pointListComponent, this.#container);
    }

    this.#newPointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onDestroy: this.#handleNewPointFormClose,
    });
    this.#newPointPresenter.init();
  }

  #renderTrip() {
    const points = filter[this.#filterModel.filter](this.#pointsModel.points);

    if (points.length === 0) {
      this.#showMessage(EmptyListMessage[this.#filterModel.filter ?? FilterType.EVERYTHING]);
      return;
    }

    this.#sortComponent = new SortView({
      sortItems: generateSort(),
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    this.#pointListComponent = new PointListView();

    render(this.#sortComponent, this.#container);
    render(this.#pointListComponent, this.#container);
    this.#renderPoints();
  }

  #renderPoints() {
    const points = filter[this.#filterModel.filter](this.#pointsModel.points);
    const sortedPoints = sort[this.#currentSortType](points);

    for (const point of sortedPoints) {
      this.#renderPoint(point);
    }
  }

  #showMessage(message) {
    remove(this.#emptyListComponent);
    this.#emptyListComponent = new EmptyListView({message});
    render(this.#emptyListComponent, this.#container);
  }

  #clearPointList() {
    this.#handleNewPointFormClose();
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearTrip() {
    this.#clearPointList();
    remove(this.#sortComponent);
    remove(this.#pointListComponent);
    remove(this.#emptyListComponent);
    this.#sortComponent = null;
    this.#pointListComponent = null;
    this.#emptyListComponent = null;
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          await this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
        case UserAction.DELETE_POINT:
          this.#pointPresenters.get(update.id)?.setAborting();
          break;
        case UserAction.ADD_POINT:
          this.#newPointPresenter?.setAborting();
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());

    this.#handleNewPointFormClose();
  };

  #handleNewPointFormClose = () => {
    if (this.#newPointPresenter === null) {
      return;
    }

    this.#newPointPresenter.destroy();
    this.#newPointPresenter = null;
    this.#newEventButton.setDisabled(false);

    if (this.#pointsModel.points.length === 0) {
      remove(this.#pointListComponent);
      this.#pointListComponent = null;
      this.#showMessage(EmptyListMessage[FilterType.EVERYTHING]);
    }
  };

  #handlePointsModelEvent = (updateType, data) => {
    if (updateType === UpdateType.PATCH) {
      this.#pointPresenters.get(data.id)?.init(data);
      return;
    }

    this.#clearTrip();
    this.#renderTrip();
  };

  #handleFilterModelEvent = () => {
    this.#currentSortType = SortType.DAY;
    this.#clearTrip();
    this.#renderTrip();
  };
}
