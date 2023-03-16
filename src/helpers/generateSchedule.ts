
import { start } from 'repl';
import { TIME_SLOTS_NO_BREAKS } from '../constants';
import { Patient, Therapist, Person, Appointment, TimeRange, ValidTime } from '../typing/types';
import { deepCopyPerson } from './deepCopy';
import { hasAvailable } from './timeHelpers';

const slotsWithinRange = (range: TimeRange): TimeRange[] => (
  TIME_SLOTS_NO_BREAKS.filter((slot: TimeRange) => range.startTime <= slot.startTime && range.endTime >= slot.endTime)
);

const listAvailableStartTimes = (person: Person) => {
  const startTimes: ValidTime[] = [];
  return person.genAvailability.reduce((startTimes: ValidTime[], range: TimeRange) => {
    return startTimes.concat(slotsWithinRange(range).map((slot: TimeRange) => slot.startTime));
  }, startTimes);
};

export const generateSchedule = (patients: Patient[], therapists: Therapist[]): [appts: Appointment[], errors: string] => {
  const primaries = therapists.filter((therapist) => therapist.primary);
  const floats = therapists.filter((therapist) => !therapist.primary);


  // two main rules to consider: 
  // 1. each patient must be seen 4 times per day
  // 2. each patient must be seen by each therapist at least once

  // other considerations:
  // - must stay within patients' and therapists' availability.
  // - fill therapists' schedules first, then floats.
  // - avoid scheduling patients with back to back sessions if possible.


  // with these considerations, let's start processing.
  // start by iterating through each patients in order of least availability. for each primary, find two appointments and try to spread them out
  // with gaps in between. 


  // start scheduling the patients with the least availability.
  // fill primaries' schedules before beginning to schedule float.


  // ok, here's the thing. we need to go through all possible combinations. you can't just guess the optimal path. how to do this? I have no clue. 


  // if there are not enough slots, return an error that patients will need to be grouped (along with recommendations - ?)
  // if there are extra slots, suggest that a float go home for every 8 extra slots, or that a float take a half day for every 4 extra slots. 

  // const orderedPatients = patients; // will implement ordering later
  // const orderedTherapists = therapists.sort((a: Therapist, b: Therapist) => (+b.primary - +a.primary));
  // const startTimes = TIME_SLOTS.filter((ts: TimeRange) => !ts.break);



  // // ---------- array soln
  // const scheduleArr = startTimes.map((time: TimeRange) => {
  //   return orderedPatients.map((patient: Patient) => patient.name);
  // });
  // // 



  // // --------------- object soln
  // const scheduleObj = {};
  // startTimes.forEach((ts: TimeRange) => {
  //   scheduleObj[ts.startTime] = {};
  //   orderedPatients.forEach((pt: Patient) => scheduleObj[ts.startTime][pt] = hasAvailable(pt, ts); // therapist here?
  // });
  // // { '0700': {
  // //   'Pt 1': true, // later a therapist's name will go here
  // //   'Pt 2': true,
  // //   'Pt 3': true,
  // // }}

  // Object.keys(scheduleObj).forEach((startTime: ValidTime) => {
    
  // });



  // -------------- brute force solution


  // we have three dimensions we're working with. patients, therapists, and time slots. 
  // to find every possible outcome, we need to set one of them as static (ex. patients) and
  // then test out every possible combination of other other two. It will be O(n*m), where 
  // n = patients and m = therapists. 

  // -------------------





  // ---------------- test 1 (2/7/23)
  // Algorithm:
  // 1. create a mapping of time slots to a list of who is available 
  // during that slot (patients and primary therapists).
  // 2. start by filling in the appointments where there is only one 
  // primary available. Prioritize patients who do not have availability
  // in other parts of the day. (if there are multiple options of 
  //   patients, keep track of them in a tree. Start following one 
  //   path and see if it works - if not, come back and try the other.)
  // 3. Now, for each primary, find the patients which have not been 
  // seen by them and schedule according to their availability. 


  // see, this way we're breaking it down. we only have two primary therapists.
  // for the first one, we need to a reliable way to get all possibilities (bipartate graph?),
  // so that if it's impossible to schedule the second therapist, we can just try a different
  // possibility on the first one until we've confirmed that none of them work. 

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
      availability[time].patients[patientName[0]] = therapistName;
    };
    const removeAppointment = (therapistName: string, patientName: string, time: ValidTime) => {
      availability[time].therapists[therapistName] = true;
      availability[time].patients[patientName[0]] = true;
    };
    const overlappingAvailability = (patient: Patient, therapist: Therapist): ValidTime[] => {
      return (Object.keys(availability) as ValidTime[]).filter((time) => {
        const patientFree = availability[time].patients[patient.name] === true;
        const therapistFree = availability[time].therapists[therapist.name] === true;
        return patientFree && therapistFree;
      });
    };
    let errorMessage = '';

    // primaries.forEach((primary, idx) => { // there will be 2 primaries max
    //   const otherPrimary = (primaries.length === 2 && idx === 0) ? primaries[1]: undefined;
    //   // we have one primary, 8(usually) slots and x patients (which can only match with certain slots).
    //   // focus on the 8 slots. how many available patients do we have per slot? if we only have one, schedule it.
    //   // if we have multiple, just pick the first one (which will be the one with the least overall availability). 
    //   // if it doesn't work, we will circle back and choose the next. (somehow? use an "until" loop?)
    //   const startTimes = listAvailableStartTimes(primary);
    //   const patientsToSee = patients.map((patient) => patient.name);
    //   startTimes.every((time) => {
    //     const availablePatients = Object.entries(availability[time].patients).filter((patient) => {
    //       const [ptName, ptAvailable] = patient;
    //       return patientsToSee.includes(ptName) && ptAvailable;
    //     }).map((entry) => entry[0]); // confirm this is updated every iteration (with results from last iteration)
    //     const patientToSchedule = otherPrimary ? availablePatients.find((pt) => hasOVerlappingAvailabilityWithOtherPrimary) : availablePatients[0];
    //     // need to define hasOVerlappingAvailabilityWithOtherPrimary
    //     addAppointment(primary.name, patientToSchedule, time); // choose the first (currently)
    //     patientsToSee.shift();
    //     return (patientsToSee.length > 0); // stop iterating once all patients have been seen
    //   });
    //   if (patientsToSee.length > 0) console.log(`Error:  ${primary.name} is not able to see ${patientsToSee}.`);
    // });



    // ------------------------------
    // Test 2 - using DFS to brute force! (this uses the methods/constants defined above in Test 1)

    const schedulePtWithPrimaries = (patient: Patient, patientsLeftToSchedule: Patient[]) => {
      if (primaries.length === 2) {
        const [primary1, primary2] = primaries;
        const slotsWithPrimary1 = overlappingAvailability(patient, primary1);
        const slotsWithPrimary2 = overlappingAvailability(patient, primary2);
        const sameSlot = slotsWithPrimary1.length === 1 && slotsWithPrimary2.length === 1 && slotsWithPrimary1[0] === slotsWithPrimary2[0];
        if (slotsWithPrimary1.length < 1 || slotsWithPrimary2.length < 1 || sameSlot) return false; // failure base case

        addAppointment(primary1.name, patient.name, slotsWithPrimary1[0]);
        const updatedSlots2 = overlappingAvailability(patient, primary2);
        addAppointment(primary2.name, patient.name, updatedSlots2[0]);
        
      } else if (primaries.length === 1) {
        const primary = primaries[0];
        const possibleSlots = overlappingAvailability(patient, primary);
        if (possibleSlots.length < 1) return false; // failure base case

        addAppointment(primary.name, patient.name, possibleSlots[0]);

      } else {
        errorMessage = 'there must be either 1 or 2 primaries';
      }

      const finished = patientsLeftToSchedule.length < 1;
      if (finished) return true; // success baes case
      
      const nextPatient = patientsLeftToSchedule.shift();
      if (nextPatient /* always true */) {
        schedulePtWithPrimaries(nextPatient, patientsLeftToSchedule);  
      }
    };


  // ---------------
  return [appointments, errorMessage];
};


/*
alternative way to think - instead of iterating through slots, iterate through patients.

essentially, for the first primary:
1. we have x slots and y patients, which gives us x*y possible solutions. (we can brute force these if necessary.)
2. find an solution where, for each patient that we see, that patient still has overlapping availability with the other therapist.

the only place that this will break down (I think) is if more than one patient is confirmed to have overlapping availability with the 
other therapist, but only 1 slot, and it's the same slot for both/all of them. We have to find a way to catch this case. 

for the first primary:
  for each patient (ordered by least avilability):
    for each overlapping slot (earliest to latest):
      if we schedule this, will the patient have any overlapping avilability with the other primary? 
        if yes, then schedule
        if no, next slot
      end
    end
  end
*/


/*
ok, I just thought of a way to use DFS to brute force this. we write a recursive method that takes in the schedule and makes ONE appointment,
then calls itself to make the next appointment. if the appointment doesn't work, we return false, undo the appointment, and try the next 
time slot(or patient). we only return true once the whole schedule is finished. 
*/