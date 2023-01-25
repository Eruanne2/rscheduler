import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { State, Patient, Therapist } from "../types";
import ListItem from "./ListItem";

const PatientTherapistList = (props: { listState: State, setListState: Dispatch<SetStateAction<State>>}): JSX.Element => {
  const { listState, setListState } = props;
  const [selectedTab, setSelectedTab] = useState<'therapists' | 'patients'>('therapists');
  const [selectedPerson, setSelectedPerson] = useState<string>('');

  useEffect(() => {
    setSelectedPerson('');
  }, [selectedTab])

  return <div className="pt-list">
    <ul className="list-tabs">
      <li className="tab" onClick={() => setSelectedTab('therapists')}>Therapists</li>
      <li className="tab" onClick={() => setSelectedTab('patients')}>Patients</li>
    </ul>
    <ul className='main-list'>
      {listState[selectedTab].map((person: Patient | Therapist) => 
        <ListItem person={person} key={person.name} selectedPerson={selectedPerson} setSelectedPerson={setSelectedPerson}/>
      )}
    </ul>
  </div>;
};

export default PatientTherapistList;