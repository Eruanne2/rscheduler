import { TIME_SLOTS } from '../constants';
import { Patient, Therapist, Appointment, TimeRange, ValidTime } from '../typing/types';
import { hasAvailable } from './timeHelpers';

export const generateSchedule = (patients: Patient[], therapists: Therapist[]): [appts: Appointment[], errors: string] => {


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





  // ---------------
  return [[], ''];
};