import { State, Person } from '../typing/types';

export const deepCopyState = (state: State): State => JSON.parse(JSON.stringify(state));
export const deepCopyPerson = (person: Person): Person => JSON.parse(JSON.stringify(person));
export const randomize = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];