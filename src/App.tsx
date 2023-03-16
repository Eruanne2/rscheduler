import { useEffect, useState } from 'react';
import Schedule from './components/Schedule'
import PatientTherapistList from './components/PatientTherapistList';
import './styling/reset.css';
import './styling/App.css';
import { testState } from './testData';
import { State, Appointment } from './typing/types';
import { deepCopyState  } from './helpers/deepCopy';
import { generateSchedule } from './helpers/generateSchedule';

const App = (): JSX.Element => {
  const [scheduleState, setScheduleState] = useState<State>(deepCopyState(testState));
  const [listState, setListState] = useState<State>(deepCopyState(testState));
  const [scheduleError, setScheduleError] = useState<string>('');

  useEffect(() => {
    const patientsMismatch = JSON.stringify(listState.patients) !== JSON.stringify(scheduleState.patients);
    const therapistsMismatch = JSON.stringify(listState.therapists) !== JSON.stringify(scheduleState.therapists);
    if (patientsMismatch || therapistsMismatch) {
      setScheduleError('A patient or therapist has been edited. Please regenerate schedule.');
    }
  }, [scheduleState, listState])

  const buildSchedule = () => {
    const [appts, error] = generateSchedule(structuredClone(listState.patients), structuredClone(listState.therapists));
    const listStateCopy = deepCopyState(listState);
    setScheduleState({
      patients: listStateCopy.patients,
      therapists: listStateCopy.therapists,
      appointments: appts
    });
    setScheduleError(error);
  }
  
  return (
    <div className="app">
      <header className='main-header'>RScheduler</header>
      <div className='main-container'>
        <Schedule
          scheduleState={scheduleState}
          buildSchedule={buildSchedule}
          error={scheduleError}
        />
        <PatientTherapistList listState={listState} setListState={setListState} />
      </div>
    </div>
  );
}

export default App;
