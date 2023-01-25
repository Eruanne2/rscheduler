import { useState } from "react";
import { Mode, TimeRange, Appointment, State, Therapist, Patient } from "../types";
import { TIME_SLOTS } from "../constants";

const Schedule = (props: { scheduleState: State, generateSchedule: () => void, error: string }): JSX.Element => {
  const { scheduleState, generateSchedule, error } = props;
  const [scheduleMode, setScheduleMode] = useState<Mode>('therapist');
  const names = scheduleState[`${scheduleMode}s`].map((person: Therapist | Patient) => person.name)

  const handleModeChange = (newMode: Mode) => setScheduleMode(newMode);
  const findAppointment = (name: string, slot: TimeRange): Appointment | undefined =>
    scheduleState.appointments.find((appt: Appointment) => appt.time === slot.startTime && appt[scheduleMode] === name);

  return <div className="schedule">
    <div className='schedule-header'>
      <div className='schedule-controls'>
        <button className='generate-schedule-btn' onClick={generateSchedule}>Generate Schedule</button>
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
          {names.map((name: string, idx: number) => 
            <th key={name} className={`col-${idx}}`}>{name}</th>
          )}
        </tr>
      </thead>
      <tbody>
        {TIME_SLOTS.map((slot: TimeRange) => 
          <tr key={slot.endTime}>
            <td><span className='y-labels'>{slot.startTime}</span></td>
            {names.map((name: string, idx: number) => {
              const appointment = findAppointment(name, slot)
              let text;
              if (scheduleMode === 'therapist') text = appointment ? appointment.patient : '';
              else text = appointment ? appointment.therapist : '';
              return <td key={name} className={`col-${idx}`}>{text}</td>
            })}
          </tr>
        )}
      </tbody>
    </table>
  </div>;
};

export default Schedule;