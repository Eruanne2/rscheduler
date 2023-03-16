import { State } from './typing/types';

export const testState: State = {
  patients: [
    { name: 'Pt 1', genAvailability: [{ startTime: '0700', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 2', genAvailability: [{ startTime: '0700', endTime: '1300'}, { startTime: '1430', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 3', genAvailability: [{ startTime: '0700', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 4', genAvailability: [{ startTime: '0700', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 5', genAvailability: [{ startTime: '0700', endTime: '1715'}], type: 'patient' },
    { name: 'Pt 6', genAvailability: [{ startTime: '0700', endTime: '1715'}], type: 'patient' },
  ],
  therapists: [
    { name: 'Brian', primary: true, genAvailability: [{ startTime: '0700', endTime: '1530'}], type: 'therapist'},
    { name: 'Shay', primary: false, genAvailability: [{ startTime: '0930', endTime: '1715'}], type: 'therapist'},
    { name: 'Raul', primary: false, genAvailability: [{ startTime: '0930', endTime: '1715'}], type: 'therapist'},
    { name: 'Ari', primary: true, genAvailability: [{ startTime: '0700', endTime: '1530'}], type: 'therapist'},
  ],
  appointments: [
    { therapist: 'Brian', time: '0700', patient: 'Pt 1' },
    { therapist: 'Brian', time: '0745', patient: 'Pt 2' },
    { therapist: 'Brian', time: '0845', patient: 'Pt 3' },
    { therapist: 'Brian', time: '0930', patient: 'Pt 4' },
    { therapist: 'Shay', time: '1445', patient: 'Pt 4' },
    { therapist: 'Shay', time: '1530', patient: 'Pt 5' },
    { therapist: 'Shay', time: '1630', patient: 'Pt 6' },
    { therapist: 'Raul', time: '0930', patient: 'Pt 1' },
    { therapist: 'Raul', time: '1030', patient: 'Pt 2' },
    { therapist: 'Raul', time: '1115', patient: 'Pt 3' },
  ]
};
