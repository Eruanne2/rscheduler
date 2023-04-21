import { useReducer } from 'react';
import Schedule from './components/Schedule'
import PatientTherapistList from './components/PatientTherapistList';
import './styling/reset.css';
import './styling/App.css';
import { initState } from './state/initState';
import { AppContext } from './state/context';
import reducer from './state/reducer';

const App = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initState); // or fetch from local storage
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="app">
        <header className='main-header'>RScheduler</header>
        <div className='main-container'>
          <Schedule />
          <PatientTherapistList />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
