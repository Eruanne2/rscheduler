
import { start } from 'repl';
import { TIME_SLOTS_NO_BREAKS } from '../constants';
import { Patient, Therapist, Person, Appointment, TimeRange, ValidTime } from '../typing/types';
import { deepCopyPerson } from './deepCopy';
import { hasAvailable } from './timeHelpers';

const slotsWithinRange = (range: TimeRange): TimeRange[] => (
  TIME_SLOTS_NO_BREAKS.filter((slot: TimeRange) => range.startTime <= slot.startTime && range.endTime >= slot.endTime)
);

const listAvailableStartTimes = (person: Person): ValidTime[] => {
  const startTimes: ValidTime[] = [];
  return person.genAvailability.reduce((startTimes: ValidTime[], range: TimeRange) => {
    return startTimes.concat(slotsWithinRange(range).map((slot: TimeRange) => slot.startTime));
  }, startTimes);
};

export const generateSchedule = (patients: Patient[], therapists: Therapist[]): [appts: Appointment[], errors: string] => {
  let primaries = therapists.filter((therapist) => therapist.primary);
  let floats = therapists.filter((therapist) => !therapist.primary);

  const availability = Object.fromEntries(
    TIME_SLOTS_NO_BREAKS.map((ts: TimeRange) => {
      const peopleAvailability: { patients: Record<string, boolean | string>, therapists: Record<string, boolean | string>} = { patients: {}, therapists: {} };
      [...patients, ...primaries].forEach((person: Person) => { // start with primaries only
        peopleAvailability[`${person.type}s`][person.name] = hasAvailable(person, ts);
      })
      return [ts.startTime, peopleAvailability];
    })
  );

    // resulting availability object looks like this:
    // {
    //   '0700': {
    //     patients: {
    //       'Pt 1': true,
    //       'Pt 2': false,
    //     },
    //     therapists: {
    //       'Dave': true,
    //       'Shay': false,
    //     }
    //   }, 
    //   '0745': ...
    // }
    const appointments: Appointment[] = [];
    const addAppointment = (therapistName: string, patientName: string, time: ValidTime) => {
      availability[time].therapists[therapistName] = patientName;
      availability[time].patients[patientName] = therapistName;
      appointments.push({ patient: patientName, therapist: therapistName, time: time});
      console.log(`appointment added for ${therapistName} and ${patientName} at ${time}`);
    };
    const removeAppointment = (therapistName: string, patientName: string, time: ValidTime) => {
      availability[time].therapists[therapistName] = true;
      availability[time].patients[patientName] = true;
      const idx = appointments.findIndex((appt) => appt.therapist === therapistName && appt.patient === patientName && appt.time === time);
      if (idx > 0) appointments.splice(idx, 1);
      console.log(`appointment removed for ${therapistName} and ${patientName} at ${time}`);
    };
    const overlappingAvailability = (patient: Patient, therapist: Therapist): ValidTime[] => {
      return (Object.keys(availability) as ValidTime[]).filter((time) => {
        const patientFree = availability[time].patients[patient.name] === true;
        const therapistFree = availability[time].therapists[therapist.name] === true;
        return patientFree && therapistFree;
      });
    };
    let errorMessage = '';

    // schedule primaries or floats first?

    // scheduling floats first could make more sense for tricky LC situations. 
    // in that case, we'd just have to make sure each time that we schedule a float
    // that both primaries still have availability to see the patient in question.
    // this ignores a small edge case tho (primaries can see each patient individually, but not all of them)
    
    // scheduling primaries first means we're safe on primary coverage, but we might not be
    // able to get the floats in place to go home for LC

    // I'm leaning towards first option since it is most optimal and ignores a (hopefully rare?) edge case. 



    const scheduleSessions = () => {
      const patientSessionsNeeded = patients.length * 4;
      const therapistsSlots = therapists.map((therapist: Therapist) => listAvailableStartTimes(therapist).length); 
      let numTherapistSlots = therapistsSlots.reduce((acc, numSlots) => acc + numSlots); // adjust this to actually count slots in each therapists' availability

      const floatCanGoHome = (numTherapistSlots - patientSessionsNeeded) >= 8;
      // should this be a while loop so that if multiple floats can go home, they will? for now I'm assuming only 1 will ever need to go home
      if (floatCanGoHome) {
        // how to decide which float if there are multiple?
        const floatGoingHome = floats[0]; // just pick the first for now
        if (floatGoingHome) floatGoingHome.lc = floatGoingHome.genAvailability;
        //    (will need to add logic in the Schedule component to display the LC blocks differently.)
        floats = floats.slice(1);
        numTherapistSlots -= 8;
      }
      const floatTakeHalfDay = (numTherapistSlots - patientSessionsNeeded) >= 4; // same note as line 85
      const floatTakingHalfDay = floats[0]; // randomize

      // If TS - PSN > 4, we need to do a half day for a float. Go ahead and schedule this float (morning) and add a
      // time range called "LC" for their half day.
      
      // assume the float has full availability (8 slots)
      listAvailableStartTimes(floatTakingHalfDay).slice(0, 4).forEach((slot: ValidTime) => {
        const possiblePatients = Object.keys(availability[slot].patients).filter((ptName: string) => availability[slot].patients[ptName] === true);
        const patientName = possiblePatients[Math.floor(Math.random() * possiblePatients.length)];
        addAppointment(floatTakingHalfDay.name, patientName, slot);
      });
      
      // 3. then schedule the primaries.
      

      // 4. then schedule the remaining floats.

      // we'll ignore all edge cases at first. once this is working, I'll have Raul play with it and see if he can find any.
      // then I'll decide how to handle them. 



      // if i include some randomization, it may be useful for the user to be able to regenerate the schedule
      // and see different options!
    };

    const spaceOutAppts = () => {
      // in the remaining availability (minus LC), create as much space between appointments as possible for patients
    };


  // ---------------
  return [appointments, errorMessage];
};