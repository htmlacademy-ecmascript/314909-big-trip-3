import {render} from '../render.js';
import PointListView from '../view/point-list-view.js';
import EditFormView from '../view/edit-form-view.js';
import CreateFormView from '../view/create-form-view.js';
import PointView from '../view/point-view.js';

export default class TripPresenter {
  pointListComponent = new PointListView();

  constructor({container, pointsModel}) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.pointsModel.getPoints()];
    const [firstPoint] = this.points;

    render(this.pointListComponent, this.container);
    render(new EditFormView({
      point: firstPoint,
      destination: this.pointsModel.getDestinationById(firstPoint.destination),
      offers: this.pointsModel.getOffersByType(firstPoint.type),
      destinations: this.pointsModel.getDestinations(),
    }), this.pointListComponent.getElement());
    render(new CreateFormView(), this.pointListComponent.getElement());

    for (const point of this.points) {
      render(new PointView({
        point,
        destination: this.pointsModel.getDestinationById(point.destination),
        offers: this.pointsModel.getOffersByType(point.type),
      }), this.pointListComponent.getElement());
    }
  }
}
