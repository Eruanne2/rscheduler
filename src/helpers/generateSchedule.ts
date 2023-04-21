import { TIME_SLOTS_NO_BREAKS } from '../constants';
import { Patient, Therapist, Person, Appointment, TimeRange, ValidTime, State, ReducerAction } from '../typing/types';
import { randomize } from './generalHelpers';
import { hasAvailable } from './timeHelpers';
import { addAppointment, addLC } from '../state/actionCreators';

const slotsWithinRange = (range: TimeRange): TimeRange[] => (
  TIME_SLOTS_NO_BREAKS.filter((slot: TimeRange) => range.startTime <= slot.startTime && range.endTime >= slot.endTime)
);

const listAvailableStartTimes = (person: Person): ValidTime[] => {
  const startTimes: ValidTime[] = [];
  return person.genAvailability.reduce((startTimes: ValidTime[], range: TimeRange) => {
    return startTimes.concat(slotsWithinRange(range).map((slot: TimeRange) => slot.startTime));
  }, startTimes);
};

export const generateSchedule = (state: State, dispatch: React.Dispatch<ReducerAction>): void => {
  let primaries = state.therapists.filter((therapist) => therapist.primary);
  let floats = state.therapists.filter((therapist) => !therapist.primary);
  let lcTherapists: Therapist[] = [];

  const availability = Object.fromEntries(
    TIME_SLOTS_NO_BREAKS.map((ts: TimeRange) => {
      const peopleAvailability: { patients: Record<string, boolean | string>, therapists: Record<string, boolean | string>} = { patients: {}, therapists: {} };
      [...state.patients, ...state.therapists].forEach((person: Person) => {
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
    const checkAndAddAppointment = (therapistName: string, patientName: string, time: ValidTime) => {
      const patientFree = availability[time].patients[patientName] === true;
      const therapistFree = availability[time].therapists[therapistName] === true;

      availability[time].therapists[therapistName] = patientName;
      availability[time].patients[patientName] = therapistName;
      const appointment: Appointment = { patient: patientName, therapist: therapistName, time: time};
      appointments.push(appointment);
      dispatch(addAppointment(appointment))
      console.log(`appointment added for ${therapistName} and ${patientName} at ${time}`);
    };
    const checkAndRemoveAppointment = (therapistName: string, patientName: string, time: ValidTime) => {
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
    const patientNeedsMoreSessions = (patientName: string) => appointments.filter((appt) => appt.patient === patientName).length < 4;
    let errorMessage = '';

    // schedule primaries or floats first?

    // scheduling floats first could make more sense for tricky LC situations. 
    // in that case, we'd just have to make sure each time that we schedule a float
    // that both primaries still have availability to see the patient in question.
    // this ignores a small edge case tho (primaries can see each patient individually, but not all of them)
    
    // scheduling primaries first means we're safe on primary coverage, but we might not be
    // able to get the floats in place to go home for LC

    // I'm leaning towards first option since it is most optimal and ignores a (hopefully rare?) edge case. 


    const handleLowCensus = () => {
      const patientSessionsNeeded = state.patients.length * 4;
      const therapistsSlots = state.therapists.map((therapist: Therapist) => listAvailableStartTimes(therapist).length); 
      let numTherapistSlots = therapistsSlots.reduce((acc, numSlots) => acc + numSlots); // adjust this to actually count slots in each therapists' availability

      const floatCanGoHome = (numTherapistSlots - patientSessionsNeeded) >= 8;
      // should this be a while loop so that if multiple floats can go home, they will? for now I'm assuming only 1 will ever need to go home
      if (floatCanGoHome) {
        const floatGoingHome: Therapist = randomize(floats);
        dispatch(addLC(floatGoingHome.name, floatGoingHome.genAvailability));
        
        const lcFloat = floats.shift();
        if (lcFloat) lcTherapists.push(lcFloat);
        numTherapistSlots -= 8;
      }
      const floatShouldTakeHalfDay = (numTherapistSlots - patientSessionsNeeded) >= 4;
      if (floatShouldTakeHalfDay) {
        const floatTakingHalfDay = randomize(floats);
  
        // If TS - PSN > 4, we need to do a half day for a float. Go ahead and schedule this float (morning) and add a
        // time range called "LC" for their half day.
        
        // assume the float has full availability (8 slots)
        const floatSlots = listAvailableStartTimes(floatTakingHalfDay)
        floatSlots.slice(0, 4).forEach((slot: ValidTime) => {
          const possiblePatients = Object.keys(availability[slot].patients).filter((ptName: string) => availability[slot].patients[ptName] === true && patientNeedsMoreSessions(ptName));
          const patientName = randomize(possiblePatients);
          checkAndAddAppointment(floatTakingHalfDay.name, patientName, slot);
        });
        const floatEndOfDay = floatTakingHalfDay.genAvailability[floatTakingHalfDay.genAvailability.length - 1].endTime;
        dispatch(addLC(floatTakingHalfDay.name, [{ startTime: floatSlots[4], endTime: floatEndOfDay}]));
      }
    };


    const scheduleSessions = () => {
      // 1. first send any floats home and/or schedule any floats that are taking a half day.
      handleLowCensus();
      
      // 2. then schedule the primaries.
      primaries.forEach((primary) => {
        // first make sure each primary sees each patient
        state.patients.forEach((patient) => {
          const slot: ValidTime = randomize(overlappingAvailability(patient, primary));
          checkAndAddAppointment(primary.name, patient.name, slot);
        });

        // then fill in the gaps in the primaries' schedules
        const emptySlots = Object.keys(availability).filter((time) => availability[time].therapists[primary.name] === true) as ValidTime[];
        emptySlots.forEach((slot) => {
          const possiblePatients = Object.keys(availability[slot].patients).filter((ptName: string) => availability[slot].patients[ptName] === true && patientNeedsMoreSessions(ptName));
          const patientName = randomize(possiblePatients);
          checkAndAddAppointment(primary.name, patientName, slot);
        });
      });


      // 3. then schedule the patient's remaining sessions using floats.
      state.patients.forEach((patient) => {
        while (patientNeedsMoreSessions(patient.name)) {
          const float = randomize(floats);
          const slot = randomize(overlappingAvailability(patient, float));
          checkAndAddAppointment(float.name, patient.name, slot);
        }
      });


      // we'll ignore all edge cases at first. once this is working, I'll have Raul play with it and see if he can find any more.
      // then I'll decide how to handle them. 

    };

    const optimizeAppts = () => { // hint for testing this - lengthen a parimary's day so that they have 9 or 10 slots
      // in the remaining availability (minus LC), optimize by:
      // - moving appointments earlier so that therapists can go home early if possible
      // - creating as much space between appointments as possible for patients. thankfully, the randomization does this pretty well!
      // - avoiding too many appointments with the same therapist (?)
      
      // 1. move therapists' empty slots as late as possible
      const therapistsWithEmptySlots = state.therapists.filter((therapist) => !lcTherapists.includes(therapist) && appointments.filter((appt) => appt.therapist === therapist.name).length < 8);
      therapistsWithEmptySlots.forEach((therapist) => {
        const therapistAppts = appointments.filter((appt) => appt.therapist === therapist.name);
        const apptsLastToFirst: Appointment[] = JSON.parse(JSON.stringify(therapistAppts)).sort((a: Appointment, b: Appointment) => b.time.localeCompare(a.time));
        const startTimes = listAvailableStartTimes(therapist);
        const lastSlot = startTimes[startTimes.length - 1] // update this! if there's already an empty slot at the end of day, lastSlot will be the second to last, not the last
        const emptySlots = startTimes.filter((time) => !therapistAppts.map((appt) => appt.time).includes(time)); // only find ones that have appointments after them (see note above ^)
        emptySlots.forEach((emptySlot) => {
          // const apptsToMove: Appointment[] = [];
          const swapAppts = (slotToFill: ValidTime): boolean => { 
            console.log('slotToFill', slotToFill);
            console.log('apptsLastToFirst', apptsLastToFirst);
            // debugger
            if (slotToFill === lastSlot) return true;

            for (let i = 1; i < apptsLastToFirst.length; i++) {
              let appointment = apptsLastToFirst[i];
              if (availability[slotToFill].patients[appointment.patient] === true) {
                // apptsToMove.push(appointment);
                const nextSlotToFill = appointment.time;
                appointment.time = slotToFill;
                apptsLastToFirst.sort((a: Appointment, b: Appointment) => b.time.localeCompare(a.time));
                console.log(`moved ${nextSlotToFill} to ${slotToFill}`);
                return swapAppts(nextSlotToFill);
              }
            }
            return false;
          };
          if (swapAppts(emptySlot)) {
            // now update the moved appointments in the appointments array
            // debugger
            // let slotToFill = emptySlot;
            // while (apptsToMove.length > 0) {
            //   const appt = apptsToMove.shift();
            //   if (appt) {
            //     const prevTime = appt.time;
            //     appt.time = slotToFill;
            //     slotToFill = prevTime;
            //   }
            // }
          }
        });
        // this is a recursive problem. We want to rearrange a therapist's appointments such that the empty slot(s) is at the end of the day.
        // if this fails, it might be possible to trade appointments with other therapists and make it work that way...but for now, I'm going to ignore that case.
        // I think this should work most of the time.

        // until their last slot is empty (success base case)
          // starting with the latest appointments, try moving each appointment into the empty slot.
          // once we successfully move one, check for success. if not, move one level down and start the process over, keeping the moved appointment. 
          // failure base case - we can't move anyone into the empty slot. if this happens, bump up to the next level and try the next appointment.
      })

      // 2. create as much space between appointments as possible for patients. thankfully, the randomization does this pretty well!

      // 3. avoiding too many appointments with the same therapist (?)
    };

    scheduleSessions();
    // optimizeAppts();


  // ---------------
  return;
};