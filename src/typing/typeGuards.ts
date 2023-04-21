import { Person, Therapist, ValidTime } from './types';

export const checkIsTherapist = (person: Person | null): person is Therapist => {
  if (!person) return false;
  return (person as Therapist).primary !== undefined;
};

export const checkIsValidTime = (time: string): time is ValidTime => {
  return ['0700', '0745', '0830', '0845', '0930', '1015', '1030', '1115', '1200', '1300', '1345', '1430', '1445', '1530', '1615', '1630', '1715'].includes(time);
};