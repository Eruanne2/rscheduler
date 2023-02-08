import React, { Dispatch, SetStateAction, useState } from "react";
import { Patient, Therapist, Person, TimeRange, State } from "../typing/types";
import TimeSelect from "./TimeSelect";
import { checkIsTherapist, checkIsValidTime } from '../typing/typeGuards'
import { deepCopyState, deepCopyPerson } from '../helpers/deepCopy';
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'

const ListItem = (props: { 
  person: Person,
  selectedPerson: string,
  setSelectedPerson: Dispatch<SetStateAction<string>>,
  listState: State,
  setListState: Dispatch<SetStateAction<State>>,
}): JSX.Element => {
  const { person, selectedPerson, setSelectedPerson, listState, setListState } = props;
  const [editing, setEditing] = useState(false);
  const [personState, setPersonState] = useState<Person>(deepCopyPerson(person));
  const [editingErrors, setEditingErrors] = useState<string>('');

  const isTherapist = checkIsTherapist(person) && checkIsTherapist(personState);
  const isSelected = selectedPerson === person.name;

  const toggleDropdown = () => {
    if (isSelected) {
      if (editing) cancelEdits();
      setSelectedPerson('');
    }
    else setSelectedPerson(person.name); 
  };
  const startEditing = () => {
    if (!isSelected) setSelectedPerson(person.name);
    setEditing(true);
  };
  const stopEditing = () => {
    setPersonState(person);
    setEditing(false);
  };
  const cancelEdits = () => {
    setPersonState(person);
    setEditingErrors('');
    stopEditing();
  }
  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => setPersonState({ ...deepCopyPerson(personState), name: e.target.value });
  const changePrimary = (e: React.ChangeEvent<HTMLSelectElement>) => setPersonState({ ...deepCopyPerson(personState), primary: e.target.value === 'primary' })
  const changeAvailability = (e: React.ChangeEvent<HTMLSelectElement>, idx: number, startTime: boolean) => {
    const time = e.target.value;
    if (checkIsValidTime(time)) {
      const newAvailability = [...deepCopyPerson(personState).genAvailability];
      newAvailability[idx][startTime ? 'startTime' : 'endTime'] = time;
      setPersonState({ ...deepCopyPerson(personState), genAvailability: newAvailability})
    };
  };

  const saveEdits = () => {
    const newListState = deepCopyState(listState);
    if (isTherapist) {
      if (!checkIsTherapist(personState) || personState.name.length < 1 || personState.genAvailability.length < 1) {
        setEditingErrors('Invalid or missing data. Please ensure therapist has a name, type (primary/float), and availability');
        return;
      }
      const idx = newListState.therapists.findIndex((therapist: Therapist) => therapist.name === person.name);
      (idx === -1) ? newListState.therapists.push(personState) : newListState.therapists[idx] = personState;
    }
    else {
      if (checkIsTherapist(personState) || personState.name.length < 1 || personState.genAvailability.length < 1) {
        setEditingErrors('Invalid or missing data. Please ensure patient has a name and availability');
        return;
      }
      const idx = newListState.patients.findIndex((patient: Patient) => patient.name === person.name);
      (idx === -1) ? newListState.patients.push(personState) : newListState.patients[idx] = personState;
    }
    setEditingErrors('');
    setListState(newListState);
    stopEditing();
  };
  const deletePerson = () => {
    const newListState = deepCopyState(listState);
    if (isTherapist) {
      const filteredTherapists = newListState.therapists.filter((pers: Person) => pers.name !== person.name);
      newListState.therapists = filteredTherapists;
    } else {
      const filteredPatients = newListState.patients.filter((pers: Person) => pers.name !== person.name);
      newListState.patients = filteredPatients;
    }
    setListState(newListState);
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

  let therapistTypeSelection;
  if (isTherapist) {
    switch(personState.primary) {
      case undefined: therapistTypeSelection = ''; break;
      case true: therapistTypeSelection = 'primary'; break;
      case false: therapistTypeSelection = 'float'; break;
    }
  }

  return <li className={isSelected ? 'selected-li' : ''}>
    <div className='li-header'>
      <span>
        {editing ? <input className='name-input' type='text' value={personState.name} onChange={changeName}></input> : person.name}
        {isTherapist && person.primary && icon('star', '', () => undefined)}
      </span>
      <div className='list-item-icons'>
        {editing
          ? <>{icon('ok', 'save', saveEdits)}{icon('remove', 'cancel', cancelEdits)}</>
          :<>{icon('edit', 'edit', startEditing)}{icon('trash', 'delete', deletePerson)}</>
        }
        <span className={`glyphicon glyphicon-menu-${isSelected ? 'up' : 'down'}`} onClick={toggleDropdown}></span>
      </div>
    </div>
    {isSelected &&
      <div className='li-edit-options'>
        {isTherapist && 
          <select value={therapistTypeSelection} disabled={!editing} onChange={changePrimary}>
            <option value='' disabled hidden>--Please select--</option>
            <option value='primary'>Primary</option>
            <option value='float'>Float</option>
          </select>
        }
        <div>
          <span>Availability:</span>
          {person.genAvailability.map((timeRange: TimeRange, idx: number) =>
            <div key={timeRange.startTime}>
              <TimeSelect startTime={true} disabled={!editing} idx={idx} availabilityState={personState.genAvailability[idx]} changeAvailability={changeAvailability} />
              to 
              <TimeSelect startTime={false} disabled={!editing} idx={idx} availabilityState={personState.genAvailability[idx]} changeAvailability={changeAvailability} />
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