import { Dispatch, SetStateAction, useState } from "react";
import { ListData, Patient, Therapist } from "../types";
import ListItem from "./ListItem";

const PatientTherapistList = (props: { data: ListData, updateListData: Dispatch<SetStateAction<ListData>>}): JSX.Element => {
  const { data } = props;
  const [selectedTab, setSelectedTab] = useState<'therapists' | 'patients'>('therapists');
  return <div className="pt-list">
    <ul className="list-tabs">
      <li className="tab">Therapist</li>
      <li className="tab">Patients</li>
    </ul>
    <ul className='main-list'>
      {data[selectedTab].map((item: Patient | Therapist) => 
        <ListItem person={item}  />
      )}
    </ul>
  </div>;
};

export default PatientTherapistList;