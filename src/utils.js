import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';


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

const setSaveButtonDisabled = () => {
  document.querySelector('.event__save-btn').disabled = true;
};

function isEventPast(startDate) {
  return startDate && dayjs().isAfter(startDate, 'D');
}

function isEventToday(startDate, endDate) {
  const now = new Date();
  return startDate < now && now < endDate;
}

function isEventFuture(startDate) {
  return startDate && dayjs().isBefore(startDate, 'D');
}


export {getRandomArrayElement, formatEventDate, formatEventTime, formatEventDuration, formatFormEventDate, setSaveButtonDisabled, isEventPast, isEventToday, isEventFuture};
