import { deepCopyState } from "../helpers/generalHelpers";
import { State, ReducerAction } from "../typing/types";

const reducer = (state: State, action: ReducerAction) => {
  const newState = deepCopyState(state);
  switch(action.type) {
    case 'ADD_APPT': {
        const therapist = newState.therapists.find((therapist) => therapist.name === action.payload.appt.therapist);
        const patient = newState.patients.find((patient) => patient.name === action.payload.appt.patient);
        if (therapist && patient) {
          therapist.appointments.push(action.payload.appt);
          patient.appointments.push(action.payload.appt);
          newState.appointments.push(action.payload.appt);
        } else throw new Error('cannot add appointment - therapist or patient missing')
        return newState;
      }
    case 'CHANGE_APPT_TIME': {
        const therapist = newState.therapists.find((therapist) => therapist.name === action.payload.appt.therapist);
        const patient = newState.patients.find((patient) => patient.name === action.payload.appt.patient);
        const appt = newState.appointments.find((appt) => appt.time === action.payload.appt);
        const therapistAppt = therapist?.appointments.find((appt) => appt.time === action.payload.appt);
        const patientAppt = patient?.appointments.find((appt) => appt.time === action.payload.appt);
        if (appt && therapistAppt && patientAppt) {
          appt.time = action.payload.newTime;
          therapistAppt.time = action.payload.newTime;
          patientAppt.time = action.payload.newTime;
        } else throw new Error('cannot change appointment - appointment missing')
        return newState;
      }
    case 'REMOVE_APPT': {
      const therapist = newState.therapists.find((therapist) => therapist.name === action.payload.appt.therapist);
      const patient = newState.patients.find((patient) => patient.name === action.payload.appt.patient);
      if (therapist && patient) {
        therapist.appointments = therapist.appointments.filter((appt) => appt.time !== action.payload.appt.time);
        patient.appointments = patient.appointments.filter((appt) => appt.time !== action.payload.appt.time);
        newState.appointments = newState.appointments.filter((appt) => appt.time !== action.payload.appt.time);
      } else throw new Error('cannot remove appointment - therapist or patient missing')
      return newState;
    }
    case 'ADD_THERAPIST': {
      newState.therapists.push(action.payload.therapist);
      newState.scheduleError = 'A patient or therapist has been edited. Please regenerate schedule.';
      return newState;
    }
    case 'EDIT_THERAPIST': {
      const therapist = newState.therapists.find((therapist) => therapist.name === action.payload.therapistName);
      if (!therapist) throw new Error('cannot edit therapist - therapist missing');
      Object.assign(therapist, action.payload.newData);
      newState.scheduleError = 'A patient or therapist has been edited. Please regenerate schedule.';
      newState.editing = false;
      newState.editingError = '';
      return newState;
    }
    case 'REMOVE_THERAPIST': {
      newState.therapists = newState.therapists.filter((therapist) => therapist.name !== action.payload.therapistName);
      newState.scheduleError = 'A patient or therapist has been edited. Please regenerate schedule.';
      return newState;
    }
    case 'ADD_PATIENT': {
      newState.patients.push(action.payload.patient);
      newState.scheduleError = 'A patient or therapist has been edited. Please regenerate schedule.';
      return newState;
    }
    case 'EDIT_PATIENT': {
      const patient = newState.patients.find((patient) => patient.name === action.payload.patientName);
      if (!patient) throw new Error('cannot edit patient - patient missing');
      Object.assign(patient, action.payload.newData);
      newState.scheduleError = 'A patient or therapist has been edited. Please regenerate schedule.';
      newState.editing = false;
      newState.editingError = '';
      return newState;
    }
    case 'REMOVE_PATIENT': {
      newState.patients = newState.patients.filter((patient) => patient.name !== action.payload.patientName);
      newState.scheduleError = 'A patient or therapist has been edited. Please regenerate schedule.';
      return newState;
    }
    case 'ADD_LC': {
      newState.lc[action.payload.therapistName] = action.payload.lcTime;
      return newState;
    }
    case 'CLEAR_LC': {
      newState.lc = {};
      return newState;
    }
    case 'SET_MODE': {
      if (action.payload.component === 'schedule') {
        const currMode = newState.scheduleMode;
        newState.scheduleMode = (currMode === 'therapist' ? 'patient' : 'therapist');
      }
      if (action.payload.component === 'list') {
        const currMode = newState.listMode;
        newState.listMode = (currMode === 'therapist' ? 'patient' : 'therapist');
      }
      newState.editing = false;
      newState.selectedName = null;
      return newState;
    }
    case 'SET_SELECTED_NAME': {
      newState.selectedName = action.payload.name;
      return newState;
    }
    case 'SET_EDITING': {
      newState.editing = action.payload.val;
      return newState;
    }
    case 'SET_EDITING_ERROR': {
      newState.editingError = action.payload.error;
      return newState;
    }
    default: {
      return newState;
    }
  }
};

export default reducer;