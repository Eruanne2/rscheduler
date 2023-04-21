import { Appointment, Mode, Patient, Person, ReducerAction, Therapist, TimeRange, ValidTime } from "../typing/types";

export const addAppointment = (appt: Appointment): ReducerAction => {
  return { type: 'ADD_APPT', payload: { appt } }
};

export const changeAppointmentTime = (appt: Appointment, newTime: ValidTime): ReducerAction => {
  return { type: 'CHANGE_APPT_TIME', payload: { appt, newTime } }
};

export const removeAppointment = (appt: Appointment): ReducerAction => {
  return { type: 'REMOVE_APPT', payload: { appt } }
};

export const addTherapist = (therapist: Therapist): ReducerAction => {
  return { type: 'ADD_THERAPIST', payload: { therapist } }
};

export const editTherapist = (therapistName: string, newData: Therapist): ReducerAction => {
  return { type: 'ADD_THERAPIST', payload: { therapistName, newData,  } }
};

export const removeTherapist = (therapistName: string): ReducerAction => {
  return { type: 'ADD_THERAPIST', payload: { therapistName } }
};

export const addPatient = (patient: Patient): ReducerAction => {
  return { type: 'ADD_PATIENT', payload: { patient } }
};

export const editPatient = (patientName: string, newData: Patient): ReducerAction => {
  return { type: 'ADD_PATIENT', payload: { patientName, newData } }
};

export const removePatient = (patientName: string): ReducerAction => {
  return { type: 'ADD_PATIENT', payload: { patientName } }
};

export const addLC = (therapistName: string, lcTime: TimeRange[]): ReducerAction => {
  return { type: 'ADD_LC', payload: { therapistName, lcTime } }
};

export const setMode = (component: string, mode: Mode): ReducerAction => {
  return { type: 'SET_MODE', payload: { component }}
};

export const setSelectedName = (name: string): ReducerAction => {
  return { type: 'SET_SELECTED_NAME', payload: { name }};
};

export const setEditing = (val: boolean): ReducerAction => {
  return { type: 'SET_EDITING', payload: { val } };
};

export const setEditingError = (error: string): ReducerAction => {
  return { type: 'SET_EDITING_ERROR', payload: { error } };
};
