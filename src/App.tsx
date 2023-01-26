import { useEffect, useState } from 'react';
import Schedule from './components/Schedule'
import PatientTherapistList from './components/PatientTherapistList';
import './reset.css'
import './App.css';
import { testState } from './testData';
import { State } from './typing/types';

const App = (): JSX.Element => {
  const [scheduleState, setScheduleState] = useState(JSON.parse(JSON.stringify(testState)) as State);
  const [listState, setListState] = useState(JSON.parse(JSON.stringify(testState)) as State);
  const [scheduleError, setScheduleError] = useState<string>('');

  useEffect(() => {
    // const ts = testState; // why is testState getting updated???
    // debugger
    if (JSON.stringify(listState) !== JSON.stringify(scheduleState)) {
      setScheduleError('A patient or therapist has been edited. Please regenerate schedule.');
    }
  }, [scheduleState, listState])

  const generateSchedule = () => {
    console.log('generate schedule here');
    // also update scheduleState to match listState
  };
  
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
