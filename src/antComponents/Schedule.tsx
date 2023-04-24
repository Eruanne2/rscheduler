import { useContext } from "react";
import { Mode, TimeRange, Appointment, Person, State } from "../typing/types";
import { TIME_SLOTS } from "../constants";
import { calcHeight, hasAvailable, isLC } from "../helpers/timeHelpers";
import { AppContext } from "../state/context";
import { generateSchedule } from "../helpers/generateSchedule";
import { setMode } from "../state/actionCreators";
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayjs from 'dayjs';

type Event = { title: string, start: Date, end: Date }

const Schedule = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const persons = state[`${state.scheduleMode}s`];

  const handleModeChange = (newMode: Mode): void => dispatch(setMode('schedule', newMode));
  const findAppointment = (person: Person, slot: TimeRange): Appointment | undefined =>
    state.appointments.find((appt: Appointment) => appt.time === slot.startTime && appt[state.scheduleMode] === person.name);

    const parseEventsFromAppts = (state: State): Event[] => {
      return state.appointments.map((appt) => {
        const title = state.scheduleMode === 'therapist' ? appt.patient : appt.therapist;
        const start = dayjs(appt.time, 'HHmm');
        const end = start.add(45, 'minutes');
        const event: Event = { title, start: start.toDate(), end: end.toDate() };
        return event;
      });
    };
    
    const calendar = <FullCalendar
      plugins={[timeGridPlugin]}
      initialView='timeGridDay'
      dayHeaders={false}
      weekends={false}
      allDaySlot={false}
      events={parseEventsFromAppts(state)}
      slotMinTime={'07:00:00'}
      slotMaxTime={'17:15:00'}
      headerToolbar={{ start: '', center: '', end: ''}}
      // eventContent={renderEventContent}
    />
    
    // a custom render function
    // function renderEventContent(appointment: Appointment) {
    //   return (
    //     <>
    //       <b>{appointment.therapist}</b>
    //       <i>{appointment.patient}</i>
    //     </>
    //   )
    // }



  return <div className="schedule ">
    
    {calendar}
  </div>








  // return <div className="schedule">
  //   <div className='schedule-header'>
  //     <div className='schedule-controls'>
  //       <button className='generate-schedule-btn' onClick={() => generateSchedule(state, dispatch)}>Generate Schedule</button>
  //       <label>
  //         <input
  //           type="radio"
  //           value="therapist"
  //           name="schedule-mode"
  //           checked={state.scheduleMode === 'therapist'}
  //           onChange={() =>handleModeChange('therapist')}
  //         />
  //         Therapist
  //       </label>
  //       <label>
  //         <input
  //           type="radio"
  //           value="patient"
  //           name="schedule-mode"
  //           checked={state.scheduleMode === 'patient'}
  //           onChange={() => handleModeChange('patient')}
  //         />
  //         Patient
  //       </label>
  //     </div>
  //     <div className="error">{state.scheduleError}</div>
  //   </div>
  //   <table>
  //     <thead>
  //       <tr className='table-header-row'>
  //         <th/>
  //         {persons.map((person: Person, idx: number) => 
  //           <th key={person.name} className={`col-${idx}}`}>{person.name}</th>
  //         )}
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {TIME_SLOTS.map((slot: TimeRange, idx: number) => 
  //         <tr key={slot.endTime} className={slot.break ? 'block-off' : ''} style={{ height: `${calcHeight(slot)}%` }}>
  //           <td><span className='y-labels'>{slot.startTime}</span></td>
  //           {persons.map((person: Person, idx: number) => {
  //             const appointment = findAppointment(person, slot)
  //             let text;
  //             if (state.scheduleMode === 'therapist') text = appointment ? appointment.patient : '';
  //             else text = appointment ? appointment.therapist : '';
  //             return <td key={person.name} className={`col-${idx} ${hasAvailable(person, slot) ? '' : 'block-off'} ${isLC(person, slot, state) ? 'lc' : ''}`}>{text}</td>
  //           })}
  //         </tr>
  //       )}
  //       <tr><td className='last-time-label'>{TIME_SLOTS[TIME_SLOTS.length - 1].endTime}</td></tr>
  //     </tbody>
  //   </table>
  // </div>;
};

export default Schedule;