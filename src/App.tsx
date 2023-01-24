import { useState } from 'react';
import Schedule from './components/Schedule'
import PatientTherapistList from './components/PatientTherapistList';
import './App.css';
import { ListData, ScheduleData } from './types';

// test data
const testScheduleData: ScheduleData = {
  mode: 'therapist', // or 'patient'
  headers: ['Brian', 'Shay', 'Raul', 'Ari'],
  appointments: {
    'Brian': [
      { time: '0700', patient: 'Pt 1' }, // this is 'therapist' when in patient mode
      { time: '0745', patient: 'Pt 2' },
      { time: '0845', patient: 'Pt 3' },
      { time: '0930', patient: 'Pt 4' },
    ],
    'Shay': [
      { time: '1425', patient: 'Pt 4' },
      { time: '1530', patient: 'Pt 5' },
      { time: '1715', patient: 'Pt 6' },
    ],
    'Raul': [
      { time: '0930', patient: 'Pt 1' },
      { time: '1030', patient: 'Pt 2' },
      { time: '1115', patient: 'Pt 3' },
    ],
  }
};

const testListData: ListData = {
  patients: [
    { name: 'Pt 1', unavailability: [] },
    { name: 'Pt 2', unavailability: [{ startTime: '1300', endTime: '1430'}] },
    { name: 'Pt 3', unavailability: [] },
    { name: 'Pt 4', unavailability: [] },
    { name: 'Pt 5', unavailability: [] },
    { name: 'Pt 6', unavailability: [] },
  ],
  therapists: [
    { name: 'Brian', primary: true, availability: [{ startTime: '0700', endTime: '1530'}]},
    { name: 'Shay', primary: false, availability: [{ startTime: '0930', endTime: '1715'}]},
    { name: 'Raul', primary: false, availability: [{ startTime: '0930', endTime: '1715'}]},
    { name: 'Ari', primary: true, availability: [{ startTime: '0700', endTime: '1530'}]},
  ],
};

const App = (): JSX.Element => {
  const [state, setState] = useState({});
  const [scheduleData, setScheduleData] = useState(testScheduleData);
  const [listData, setListData] = useState(testListData);
  const [error, setError] = useState('');

  const generateSchedule = () => {
    console.log('generate schedule here');
    // update scheduleData
  };
  
  return (
    <div className="App">
      <header className='main-header'>RScheduler</header>
      <button onClick={generateSchedule}>Generate Schedule</button>
      <div className="errors">{error}</div>

      <div className='main-container'>
        <Schedule data={scheduleData} />
        <PatientTherapistList data={listData} updateListData={setListData}/>
      </div>
    </div>
  );
}

export default App;
