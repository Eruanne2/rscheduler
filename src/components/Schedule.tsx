import { useState } from "react";
import { Mode, TimeRange, Appointment, State, Person } from "../typing/types";
import { TIME_SLOTS } from "../constants";
import { calcHeight, hasAvailable, isLC } from "../helpers/timeHelpers";

const Schedule = (props: { scheduleState: State, buildSchedule: () => void, error: string }): JSX.Element => {
  const { scheduleState, buildSchedule, error } = props;
  const [scheduleMode, setScheduleMode] = useState<Mode>('therapist');
  const persons = scheduleState[`${scheduleMode}s`];

  const handleModeChange = (newMode: Mode): void => setScheduleMode(newMode);
  const findAppointment = (person: Person, slot: TimeRange): Appointment | undefined =>
    scheduleState.appointments.find((appt: Appointment) => appt.time === slot.startTime && appt[scheduleMode] === person.name);

  return <div className="schedule">
    <div className='schedule-header'>
      <div className='schedule-controls'>
        <button className='generate-schedule-btn' onClick={buildSchedule}>Generate Schedule</button>
        <label>
          <input
            type="radio"
            value="therapist"
            name="schedule-mode"
            checked={scheduleMode === 'therapist'}
            onChange={() =>handleModeChange('therapist')}
          />
          Therapist
        </label>
        <label>
          <input
            type="radio"
            value="patient"
            name="schedule-mode"
            checked={scheduleMode === 'patient'}
            onChange={() => handleModeChange('patient')}
          />
          Patient
        </label>
      </div>
      <div className="error">{error}</div>
    </div>
    <table>
      <thead>
        <tr className='table-header-row'>
          <th/>
          {persons.map((person: Person, idx: number) => 
            <th key={person.name} className={`col-${idx}}`}>{person.name}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {TIME_SLOTS.map((slot: TimeRange, idx: number) => 
          <tr key={slot.endTime} className={slot.break ? 'block-off' : ''} style={{ height: `${calcHeight(slot)}%` }}>
            <td><span className='y-labels'>{slot.startTime}</span></td>
            {persons.map((person: Person, idx: number) => {
              const appointment = findAppointment(person, slot)
              let text;
              if (scheduleMode === 'therapist') text = appointment ? appointment.patient : '';
              else text = appointment ? appointment.therapist : '';
              return <td key={person.name} className={`col-${idx} ${hasAvailable(person, slot) ? '' : 'block-off'} ${isLC(person, slot) ? 'lc' : ''}`}>{text}</td>
            })}
          </tr>
        )}
        <tr><td className='last-time-label'>{TIME_SLOTS[TIME_SLOTS.length - 1].endTime}</td></tr>
      </tbody>
    </table>
  </div>;
};

export default Schedule;