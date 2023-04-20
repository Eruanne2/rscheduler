import { Mode } from "fs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { deepCopyState } from "../helpers/generalHelpers";
import { State, Person, Patient, Therapist } from "../typing/types";
import ListItem from "./ListItem";

const PatientTherapistList = (props: { listState: State, setListState: Dispatch<SetStateAction<State>>}): JSX.Element => {
  const { listState, setListState } = props;
  const [selectedTab, setSelectedTab] = useState<Mode>('therapist');
  const [selectedPerson, setSelectedPerson] = useState<string>('');

  useEffect(() => {
    setSelectedPerson('');
  }, [selectedTab])

  const addNewPerson = () => {
    const newListState = deepCopyState(listState);
    if (selectedTab === 'therapist') {
      const newTherapist: Therapist = {
        name: 'New Therapist',
        primary: true,
        genAvailability: [{ startTime: '0700', endTime: '1715'}],
        type: 'therapist'
      }
      newListState.therapists.push(newTherapist);
      setSelectedPerson(newTherapist.name);
    } else {

      const newPatient: Patient = {
        name: 'New Patient',
        genAvailability: [{ startTime: '0700', endTime: '1715'}],
        type: 'patient'
      }
      newListState.patients.push(newPatient);
      setSelectedPerson(newPatient.name);
    }
    setListState(newListState);
  };

  return <div className="list-container">
    <ul className="list-tabs">
      <li className="tab" onClick={() => setSelectedTab('therapist')}>Therapists</li>
      <li className="tab" onClick={() => setSelectedTab('patient')}>Patients</li>
    </ul>
    <ul className='pt-list'>
      {listState[selectedTab === 'therapist' ? 'therapists' : 'patients'].map((person: Person) => 
        <ListItem
        key={person.name}
          person={person}
          selectedPerson={selectedPerson}
          setSelectedPerson={setSelectedPerson}
          listState={listState}
          setListState={setListState}
        />
      )}
    </ul>
    <span className='glyphicon glyphicon-plus' onClick={addNewPerson}></span>
  </div>;
};

export default PatientTherapistList;