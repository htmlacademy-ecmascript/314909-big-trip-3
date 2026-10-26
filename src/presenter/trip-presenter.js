import {render, replace} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import {generateSort} from '../mock/sort.js';
import {FilterType, SortType} from '../const.js';

export default class TripPresenter {
  #container = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();

  #points = [];

  constructor({container, pointsModel}) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#points = [...this.#pointsModel.points];

    if (this.#points.length === 0) {
      render(new EmptyListView({filterType: FilterType.EVERYTHING}), this.#container);
      return;
    }

    render(new SortView({
      sortItems: generateSort(),
      currentSortType: SortType.DAY,
    }), this.#container);
    render(this.#pointListComponent, this.#container);

    for (const point of this.#points) {
      this.#renderPoint(point);
    }
  }

  #renderPoint(point) {
    const destination = this.#pointsModel.getDestinationById(point.destination);
    const offers = this.#pointsModel.getOffersByType(point.type);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destination,
      offers,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const editFormComponent = new EditFormView({
      point,
      destination,
      offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onRollupClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
    });

    function replacePointToForm() {
      replace(editFormComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editFormComponent);
    }

    render(pointComponent, this.#pointListComponent.element);
  }
}
