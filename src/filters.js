import { FilterType } from './const.js';
import { isEventPast, isEventToday, isEventFuture } from './utils.js';

const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isEventFuture(event.startDate)),
  [FilterType.PRESENT]: (events) => events.filter((event) => isEventToday(event.startDate)),
  [FilterType.PAST]: (events) => events.filter((event) => isEventPast(event.startDate)),
};

export {filter};
