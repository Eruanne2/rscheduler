import React, { Dispatch, SetStateAction, useState } from "react";
import { Patient, Therapist, TimeRange, State } from "../typing/types";
import TimeSelect from "./TimeSelect";
import { checkIsTherapist, checkIsValidTime } from '../typing/typeGuards'
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'

const ListItem = (props: { 
  person: Patient | Therapist,
  selectedPerson: string,
  setSelectedPerson: Dispatch<SetStateAction<string>>,
  listState: State,
  setListState: Dispatch<SetStateAction<State>>,
}): JSX.Element => {
  const { person, selectedPerson, setSelectedPerson, listState, setListState } = props;
  const isTherapist = checkIsTherapist(person);
  const isSelected = selectedPerson === person.name;
  const [editing, setEditing] = useState(false);
  const [personState, setPersonState] = useState<Patient | Therapist>({...person});
  const [editingErrors, setEditingErrors] = useState<string>('');

  const toggleDropdown = () => {
    if (isSelected) setSelectedPerson('');
    else setSelectedPerson(person.name); 
  };
  const startEditing = () => {
    if (!isSelected) setSelectedPerson(person.name);
    setEditing(true);
  };
  const stopEditing = () => {
    setPersonState({ ...person});
    setEditing(false);
  };
  const cancelEdits = () => {
    setPersonState(person);
    stopEditing();
  }
  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => setPersonState({ ...personState, name: e.target.value });
  const changePrimary = (e: React.ChangeEvent<HTMLSelectElement>) => setPersonState({ ...personState, primary: e.target.value === 'primary' })
  const changeAvailability = (e: React.ChangeEvent<HTMLSelectElement>, idx: number, startTime: boolean) => {
    const time = e.target.value;
    if (checkIsValidTime(time)) {
      const newAvailability = personState.availability;
      newAvailability[idx][startTime ? 'startTime' : 'endTime'] = time;
      setPersonState({ ...personState, availability: newAvailability})
    };
  };

  const updatePerson = () => {
    const newListState = { ...listState };
    if (isTherapist) {
      if (!checkIsTherapist(personState)) {
        setEditingErrors('Invalid or missing data. Please ensure therapist has a name, type (primary/float), and availability');
        return;
      }
      const idx = newListState.therapists.findIndex((therapist: Therapist) => therapist.name === person.name);
      (idx === -1) ? newListState.therapists.push(personState) : newListState.therapists[idx] = personState;
    }
    else {
      if (checkIsTherapist(personState)) {
        setEditingErrors('Invalid or missing data. Please ensure patient has a name and availability');
        return;
      }
      const idx = newListState.patients.findIndex((patient: Patient) => patient.name === person.name);
      (idx === -1) ? newListState.patients.push(personState) : newListState.patients[idx] = personState;
    }
    setListState(newListState);
    stopEditing();
  };
  const deletePerson = () => {
    const newListState = { ...listState };
    newListState[isTherapist ? 'therapists' : 'patients'].filter((pers: Therapist | Patient) => pers.name === person.name);
  };

  const icon = (iconType: string, tooltipText: string, clickHandler: () => void) => {
    return <>
      <span
        id={`${iconType}-btn-${person.name}`}
        data-tooltip-content={tooltipText}
        className={`glyphicon glyphicon-${iconType} ${iconType}`}
        onClick={clickHandler}
      ></span>
      {iconType !== 'star' && <Tooltip anchorId={`${iconType}-btn-${person.name}`}></Tooltip>}
    </>
  };

  let defaultTherapistTypeSelection;
  if (isTherapist) {
    switch(person.primary) {
      case undefined: defaultTherapistTypeSelection = ''; break;
      case true: defaultTherapistTypeSelection = 'primary'; break;
      case false: defaultTherapistTypeSelection = 'float'; break;
    }
  }

  return <li className={isSelected ? 'selected-li' : ''}>
    <div className='li-header'>
      <span>
        {editing ? <input type='text' value={personState.name} onChange={changeName}></input> : person.name}
        {isTherapist && person.primary && icon('star', '', () => undefined)}
      </span>
      <div className={`list-item-icons ${editing ? '' : 'hidden'}`}>
        {icon('ok', 'save', updatePerson)}{icon('remove', 'cancel', cancelEdits)}
      </div>
      <div className={`list-item-icons ${editing ? 'hidden' : ''}`}>
        {icon('edit', 'edit', startEditing)}{icon('trash', 'delete', deletePerson)}
      </div>
      <span className={`glyphicon glyphicon-menu-${isSelected ? 'up' : 'down'}`} onClick={toggleDropdown}></span>
    </div>
    {isSelected &&
      <div className='li-edit-options'>
        {isTherapist && 
          <select defaultValue={defaultTherapistTypeSelection} disabled={!editing} onChange={changePrimary}>
            <option value='' disabled hidden>--Please select--</option>
            <option value='primary'>Primary</option>
            <option value='float'>Float</option>
          </select>
        }
        <div>
          <span>Availability:</span>
          {person.availability.map((timeRange: TimeRange, idx: number) =>
            <div key={timeRange.startTime}>
              <TimeSelect startTime={true} defaultVal={timeRange.startTime} disabled={!editing} idx={idx} changeAvailability={changeAvailability} />
              to 
              <TimeSelect startTime={false} defaultVal={timeRange.endTime} disabled={!editing} idx={idx} changeAvailability={changeAvailability} />
            </div>
          )}
          <span className='add-new-availability'>Add New Availability +</span>
        </div>
        <div className='error'>{editingErrors}</div>
      </div>
    }
  </li>;
};

export default ListItem;