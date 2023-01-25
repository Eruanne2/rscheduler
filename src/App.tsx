import { useState } from 'react';
import Schedule from './components/Schedule'
import PatientTherapistList from './components/PatientTherapistList';
import './reset.css'
import './App.css';
import { testState, testError } from './testData';

const App = (): JSX.Element => {
  const [state, setState] = useState({});
  const [scheduleState, setScheduleState] = useState(testState);
  const [listState, setListState] = useState(testState);
  const [error, setError] = useState<string>(testError);

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
          error={error}
        />
        <PatientTherapistList listState={listState} setListState={setListState} />
      </div>
    </div>
  );
}

export default App;
