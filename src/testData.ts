import { State } from './typing/types';

export const testState: State = {
  patients: [
    { name: 'Pt 1', availability: [{ startTime: '0700', endTime: '1715'}] },
    { name: 'Pt 2', availability: [{ startTime: '0700', endTime: '1300'}, { startTime: '1430', endTime: '1715'}] },
    { name: 'Pt 3', availability: [{ startTime: '0700', endTime: '1715'}] },
    { name: 'Pt 4', availability: [{ startTime: '0700', endTime: '1715'}] },
    { name: 'Pt 5', availability: [{ startTime: '0700', endTime: '1715'}] },
    { name: 'Pt 6', availability: [{ startTime: '0700', endTime: '1715'}] },
  ],
  therapists: [
    { name: 'Brian', primary: true, availability: [{ startTime: '0700', endTime: '1530'}]},
    { name: 'Shay', primary: false, availability: [{ startTime: '0930', endTime: '1715'}]},
    { name: 'Raul', primary: false, availability: [{ startTime: '0930', endTime: '1715'}]},
    { name: 'Ari', primary: true, availability: []},
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
