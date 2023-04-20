import { TIME_SLOTS } from '../constants';
import { TimeRange, Person, ValidTime } from '../typing/types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

export const calcHeight = (slot: TimeRange): number => {
  const totalStartTime = dayjs(TIME_SLOTS[0].startTime, 'HHmm');
  const totalEndTime = dayjs(TIME_SLOTS[TIME_SLOTS.length -1].endTime, 'HHmm');
  const slotStart = dayjs(slot.startTime, 'HHmm');
  const slotEnd = dayjs(slot.endTime, 'HHmm');

  const totalMinutes = totalEndTime.diff(totalStartTime, 'minutes');
  const slotMinutes = slotEnd.diff(slotStart, 'minutes');
  return (slotMinutes / totalMinutes) * 100;
};

export const hasAvailable = (person: Person, slot: TimeRange): boolean => {
  return person.genAvailability.some((avb: TimeRange) => (
    dayjs(slot.startTime, 'HHmm').isBetween(dayjs(avb.startTime, 'HHmm'), dayjs(avb.endTime, 'HHmm'), 'minute', '[]')
      && dayjs(slot.endTime, 'HHmm').isBetween(dayjs(avb.startTime, 'HHmm'), dayjs(avb.endTime, 'HHmm'), 'minute', '[]')
  ));
};

export const isLC = (person: Person, slot: TimeRange): boolean => {
  if (person.type === 'patient' || !person.lc) return false;
  return person.lc.some((avb: TimeRange) => (
    dayjs(slot.startTime, 'HHmm').isBetween(dayjs(avb.startTime, 'HHmm'), dayjs(avb.endTime, 'HHmm'), 'minute', '[]')
      && dayjs(slot.endTime, 'HHmm').isBetween(dayjs(avb.startTime, 'HHmm'), dayjs(avb.endTime, 'HHmm'), 'minute', '[]')
  ));
};

export const isBefore = (timeA: ValidTime, timeB: ValidTime) => {
  return dayjs(timeA, 'HHmm').isBefore(dayjs(timeB, 'HHmm'));
};

export const isAfter = (timeA: ValidTime, timeB: ValidTime) => {
  return dayjs(timeA, 'HHmm').isAfter(dayjs(timeB, 'HHmm'));
};