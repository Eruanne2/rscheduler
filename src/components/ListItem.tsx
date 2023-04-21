import React, { useState, useContext } from "react";
import { Person, TimeRange } from "../typing/types";
import TimeSelect from "./TimeSelect";
import { checkIsTherapist, checkIsValidTime } from '../typing/typeGuards'
import { deepCopyPerson } from '../helpers/generalHelpers';
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'
import { AppContext } from "../state/context";
import { editPatient, editTherapist, removePatient, removeTherapist, setEditing, setEditingError, setSelectedName } from "../state/actionCreators";

const ListItem = (props: { person: Person }): JSX.Element => {
  const { state, dispatch } = useContext(AppContext);
  const { person } = props;
  const [personState, setPersonState] = useState<Person>(deepCopyPerson(person));

  const isTherapist = checkIsTherapist(person) && checkIsTherapist(personState);
  const isSelected = state.selectedName === person.name;

  const toggleDropdown = () => {
    if (isSelected) {
      if (state.editing) cancelEdits();
      dispatch(setSelectedName(''));
    }
    else dispatch(setSelectedName(person.name)); 
  };
  const startEditing = () => {
    if (!isSelected) dispatch(setSelectedName(person.name));
    dispatch(setEditing(true));
  };
  const cancelEdits = () => {
    setPersonState(person);
    dispatch(setEditingError(''));
  }
  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => setPersonState({ ...deepCopyPerson(personState), name: e.target.value });
  const changePrimary = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (checkIsTherapist(personState)) {
      const therapistState = { ...deepCopyPerson(personState), primary: e.target.value === 'primary' };
      setPersonState(therapistState);
    }
  }
  const changeAvailability = (e: React.ChangeEvent<HTMLSelectElement>, idx: number, startTime: boolean) => {
    const time = e.target.value;
    if (checkIsValidTime(time)) {
      const newAvailability = [...deepCopyPerson(personState).genAvailability];
      newAvailability[idx][startTime ? 'startTime' : 'endTime'] = time;
      setPersonState({ ...deepCopyPerson(personState), genAvailability: newAvailability})
    };
  };

  const saveEdits = () => {
    if (isTherapist) {
      if (!checkIsTherapist(personState) || personState.name.length < 1 || personState.genAvailability.length < 1) {
        dispatch(setEditingError('Invalid or missing data. Please ensure therapist has a name, type (primary/float), and availability'));
        return;
      }
      if (state.selectedName) dispatch(editTherapist(state.selectedName, personState));
    }
    else {
      if (checkIsTherapist(personState) || personState.name.length < 1 || personState.genAvailability.length < 1) {
        dispatch(setEditingError('Invalid or missing data. Please ensure patient has a name and availability'));
        return;
      }
      if (state.selectedName) dispatch(editPatient(state.selectedName, personState));
    }
    setPersonState(person);
  };
  const deletePerson = () => {
    dispatch(isTherapist ? removeTherapist(person.name) : removePatient(person.name));
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
        {state.editing ? <input className='name-input' type='text' value={personState.name} onChange={changeName}></input> : person.name}
        {isTherapist && person.primary && icon('star', '', () => undefined)}
      </span>
      <div className='list-item-icons'>
        {state.editing
          ? <>{icon('ok', 'save', saveEdits)}{icon('remove', 'cancel', cancelEdits)}</>
          :<>{icon('edit', 'edit', startEditing)}{icon('trash', 'delete', deletePerson)}</>
        }
        <span className={`glyphicon glyphicon-menu-${isSelected ? 'up' : 'down'}`} onClick={toggleDropdown}></span>
      </div>
    </div>
    {isSelected &&
      <div className='li-edit-options'>
        {isTherapist && 
          <select value={therapistTypeSelection} disabled={!state.editing} onChange={changePrimary}>
            <option value='' disabled hidden>--Please select--</option>
            <option value='primary'>Primary</option>
            <option value='float'>Float</option>
          </select>
        }
        <div>
          <span>Availability:</span>
          {person.genAvailability.map((timeRange: TimeRange, idx: number) =>
            <div key={timeRange.startTime}>
              <TimeSelect startTime={true} disabled={!state.editing} idx={idx} availabilityState={personState.genAvailability[idx]} changeAvailability={changeAvailability} />
              to 
              <TimeSelect startTime={false} disabled={!state.editing} idx={idx} availabilityState={personState.genAvailability[idx]} changeAvailability={changeAvailability} />
            </div>
          )}
          <span className='add-new-availability'>Add New Availability +</span>
        </div>
        <div className='error'>{state.editingError}</div>
      </div>
    }
  </li>;
};

export default ListItem;