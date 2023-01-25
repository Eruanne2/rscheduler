import { Dispatch, SetStateAction } from "react";
import { Patient, Therapist } from "../types";

const ListItem = (props: { person: Patient | Therapist, selectedPerson: string, setSelectedPerson: Dispatch<SetStateAction<string>>}): JSX.Element => {
  const { person, selectedPerson, setSelectedPerson } = props;
  const isTherapist = (person: Patient | Therapist): person is Therapist => {
    return (person as Therapist).primary !== undefined;
  }
  const isSelected = selectedPerson === person.name;

  const toggleDropdown = () => {
    if (isSelected) setSelectedPerson('');
    else setSelectedPerson(person.name); 
  }

  const star = isTherapist(person) && person.primary && <span className="glyphicon glyphicon-star star"></span>;

  return <li className={isSelected ? 'selected-li' : ''}>
    <div className='li-header'>
      <div>{person.name}{star}</div>
      <span className={`glyphicon glyphicon-menu-${isSelected ? 'up' : 'down'}`} onClick={toggleDropdown}></span>
    </div>
    {isSelected &&
      <div className='li-edit-options'>
        {isTherapist(person) && 
          <select>
            <option selected={person.primary === undefined} disabled hidden>--Please select--</option>
            <option selected={person.primary} value='primary'>Primary</option>
            <option selected={person.primary === false} value='float'>Float</option>
          </select>
        }
      </div>
    }
  </li>;
};

export default ListItem;