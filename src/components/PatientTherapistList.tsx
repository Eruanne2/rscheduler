import { useContext } from "react";
import { Person, Patient, Therapist } from "../typing/types";
import ListItem from "./ListItem";
import { AppContext } from "../state/context";
import { addPatient, addTherapist, setMode } from "../state/actionCreators";

const PatientTherapistList = (): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);

  const addNewPerson = () => {
    if (state.listMode === 'therapist') {
      const newTherapist: Therapist = {
        name: 'New Therapist',
        primary: true,
        genAvailability: [{ startTime: '0700', endTime: '1715'}],
        type: 'therapist',
        appointments: [],
      }
      dispatch(addTherapist(newTherapist));
    } else {

      const newPatient: Patient = {
        name: 'New Patient',
        genAvailability: [{ startTime: '0700', endTime: '1715'}],
        type: 'patient',
        appointments: [],
      }
      dispatch(addPatient(newPatient));
    }

  };

  return <div className="list-container">
    <ul className="list-tabs">
      <li className="tab" onClick={() => dispatch(setMode('list', 'therapist'))}>Therapists</li>
      <li className="tab" onClick={() => dispatch(setMode('list', 'patient'))}>Patients</li>
    </ul>
    <ul className='pt-list'>
      {state[state.listMode === 'therapist' ? 'therapists' : 'patients'].map((person: Person) => 
        <ListItem key={person.name} person={person} />
      )}
    </ul>
    <span className='glyphicon glyphicon-plus' onClick={addNewPerson}></span>
  </div>;
};

export default PatientTherapistList;