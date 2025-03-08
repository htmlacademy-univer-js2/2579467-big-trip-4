import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {mockDestinations} from './mock/destination';
import {mockOffers} from './mock/offers';

dayjs.extend(duration);

const DATE_FORMAT = 'MMM D';
const FORM_DATE_FORMAT = 'DD/MM/YY';
const TIME_FORMAT = 'HH:mm';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatEventDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function formatFormEventDate(date) {
  return date ? dayjs(date).format(FORM_DATE_FORMAT) : '';
}

function formatEventTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function formatEventDuration(startDate, endDate) {
  const diff = dayjs(endDate).diff(dayjs(startDate));
  const eventDuration = dayjs.duration(diff);
  const durationInDays = String(eventDuration.days()).padStart(2, '0');
  const durationInHours = String(eventDuration.hours()).padStart(2, '0');
  const durationInMinutes = String(eventDuration.minutes()).padStart(2, '0');

  if (durationInHours === '00' && durationInDays === '00') {
    return `${durationInMinutes}M`;
  }

  if (durationInDays === '00') {
    return `${durationInHours}H ${durationInMinutes}M`;
  }

  return `${durationInDays}D ${durationInHours}H ${durationInMinutes}M`;
}

function getDestinationById(event) {
  return mockDestinations.find((destination) => destination.id === event.destinationID);
}

function getOffersByType(event) {
  return mockOffers.find((offer) => offer.type === event.type).offers;
}

function getDestinationByCityName(cityName) {
  return mockDestinations.find((destination) => destination.cityName === cityName);
}

const setSaveButtonDisabled = () => {
  document.querySelector('.event__save-btn').disabled = true;
};

function isEventPast(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isEventToday(dueDate) {
  return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
}

function isEventFuture(dueDate) {
  return dueDate && dayjs().isBefore(dueDate, 'D');
}


export {getRandomArrayElement, formatEventDate, formatEventTime, getDestinationById, getOffersByType, formatEventDuration, formatFormEventDate, getDestinationByCityName, setSaveButtonDisabled, isEventPast, isEventToday, isEventFuture};
