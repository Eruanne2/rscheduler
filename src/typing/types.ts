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
  availability: TimeRange[],
};

export type Therapist = {
  name: string,
  primary: boolean,
  availability: TimeRange[],
}

export type Person = Patient | Therapist;

export type State = {
  patients: Patient[],
  therapists: Therapist[],
  appointments: Appointment[],
}