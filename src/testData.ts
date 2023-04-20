import { State } from './typing/types';

export const testState: State = {
  patients: [
    { name: 'Pt 1', genAvailability: [{ startTime: '0700', endTime: '0845' }, {startTime: '0930', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 2', genAvailability: [{ startTime: '0700', endTime: '1300'}, { startTime: '1430', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 3', genAvailability: [{ startTime: '0700', endTime: '0845' }, {startTime: '0930', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 4', genAvailability: [{startTime: '0745', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 5', genAvailability: [{ startTime: '0930', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 6', genAvailability: [{ startTime: '0700', endTime: '0745' }, {startTime: '0830', endTime: '1715'}], type: 'patient' },
  ],
  therapists: [
    { name: 'Brian', primary: true, genAvailability: [{ startTime: '0700', endTime: '1530'}], type: 'therapist'},
    { name: 'Shay', primary: false, genAvailability: [{ startTime: '0930', endTime: '1715'}], type: 'therapist'},
    { name: 'Raul', primary: false, genAvailability: [{ startTime: '0930', endTime: '1715'}], type: 'therapist'},
    { name: 'Ari', primary: true, genAvailability: [{ startTime: '0930', endTime: '1715'}], type: 'therapist'},
  ],
  appointments: [],
};
