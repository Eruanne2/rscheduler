export type ValidTime = '0700' | '0745' | '0830' | '0845' | '0930' | '1015' | '1030' | '1115' | '1200' | '1300' | '1345' | '1430' | '1445' | '1530' | '1615' | '1630' | '1715';

export type Appointment = {
  time: ValidTime,
  patient: string,
  therapist: string,
};

export type Mode = 'patient' | 'therapist';

export type TimeRange = {
  startTime: ValidTime,
  endTime: ValidTime,
  break?: boolean,
};

export type Patient = {
  name: string,
  genAvailability: TimeRange[],
  type: 'patient',
  appointments: Appointment[],
};

export type Therapist = {
  name: string,
  primary: boolean,
  genAvailability: TimeRange[],
  type: 'therapist',
  appointments: Appointment[],
}

export type Person = Patient | Therapist;

export type LC = { therapist: string, lcTime: TimeRange[]}

export type State = {
  patients: Patient[],
  therapists: Therapist[],
  appointments: Appointment[],
  lc: Record<string, TimeRange[]>,
  scheduleError: string,
  scheduleMode: Mode,
  listMode: Mode,
  selectedName: string | null,
  editing: boolean,
  editingError: '',
}

export type ReducerActionType = 'ADD_APPT' | 
  'REMOVE_APPT'| 
  'CHANGE_APPT_TIME' | 
  'ADD_THERAPIST' |
  'EDIT_THERAPIST' |
  'REMOVE_THERAPIST' |
  'ADD_PATIENT' |
  'EDIT_PATIENT' |
  'REMOVE_PATIENT' |
  'ADD_LC' |
  'CLEAR_LC' |
  'SET_MODE' |
  'SET_SELECTED_NAME' |
  'SET_EDITING' |
  'SET_EDITING_ERROR';

export type ReducerAction = {
  type: ReducerActionType,
  payload: any,
}