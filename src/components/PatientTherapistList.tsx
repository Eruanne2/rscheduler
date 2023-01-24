import { Dispatch, SetStateAction } from "react";
import { ListData } from "../types";

const PatientTherapistList = (props: { data: ListData, updateListData: Dispatch<SetStateAction<ListData>>}): JSX.Element => {
  return <div className="pt-list"></div>;
};

export default PatientTherapistList;