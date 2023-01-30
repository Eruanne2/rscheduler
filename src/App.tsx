import { useEffect, useState } from 'react';
import Schedule from './components/Schedule'
import PatientTherapistList from './components/PatientTherapistList';
import './styling/reset.css';
import './styling/App.css';
import { testState } from './testData';
import { State } from './typing/types';
import { deepCopyState  } from './helpers/deepCopy';

const App = (): JSX.Element => {
  const [scheduleState, setScheduleState] = useState<State>(deepCopyState(testState));
  const [listState, setListState] = useState<State>(deepCopyState(testState));
  const [scheduleError, setScheduleError] = useState<string>('');

  useEffect(() => {
    if (JSON.stringify(listState) !== JSON.stringify(scheduleState)) {
      setScheduleError('A patient or therapist has been edited. Please regenerate schedule.');
    }
  }, [scheduleState, listState])

  const generateSchedule = () => setScheduleState(deepCopyState(listState)); // this triggers the useEffect below
  useEffect(() => {
    // generate schedule here
    setScheduleError('');
  }, [scheduleState]);
  
  return (
    <div className="app">
      <header className='main-header'>RScheduler</header>
      <div className='main-container'>
        <Schedule
          scheduleState={scheduleState}
          generateSchedule={generateSchedule}
          error={scheduleError}
        />
        <PatientTherapistList listState={listState} setListState={setListState} />
      </div>
    </div>
  );
}

export default App;
