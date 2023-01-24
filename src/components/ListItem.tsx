import { Patient, Therapist } from "../types";

const ListItem = (props: { person: Patient | Therapist}): JSX.Element => {
  const { person } = props;
  function isTherapist(person: Patient | Therapist): person is Therapist {
    return (person as Therapist).primary !== undefined;
  }

  return <li>
    <div>
      {isTherapist(person) && person.primary && <span className="glyphicon glyphicon-star star"></span> }
      {person.name}
    </div>
    <span className='glyphicon glyphicon-menu-down'></span>
  </li>;
};

export default ListItem;