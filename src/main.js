import BoardPresenter from './presenter/board-presenter.js';
import EventsModel from './model/events-model.js';

const eventsModel = new EventsModel();

const boardPresenter = new BoardPresenter({eventsModel});

boardPresenter.init();
