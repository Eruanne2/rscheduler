export type Appointment = {
  time: string,
  patient?: string | undefined,
  therapist?: string | undefined,
};

export type Mode = 'patient' | 'therapist';

export type ScheduleData = {
  mode: Mode,
  headers: string[],
  appointments: Record<string, Appointment[]>,
};

export type TimeRange = {
  startTime: string,
  endTime: string,
};

export type Patient = {
  name: string,
  unavailability: TimeRange[],
};

export type Therapist = {
  name: string,
  primary: boolean,
  availability: TimeRange[],
}

export type ListData = {
  patients: Patient[],
  therapists: Therapist[],
};