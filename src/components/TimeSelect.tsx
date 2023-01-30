import dayjs from "dayjs";
import React from "react";
import { TIME_SLOTS } from "../constants";
import { TimeRange, ValidTime } from "../typing/types";
import { isBefore, isAfter } from '../helpers/timeHelpers';

const TimeSelect = (props: {
  startTime: boolean,
  disabled: boolean,
  idx: number,
  availabilityState: TimeRange,
  changeAvailability: (e: React.ChangeEvent<HTMLSelectElement>, idx: number, startTime: boolean) => void,
}) => {
  const { startTime, disabled, idx, availabilityState, changeAvailability } = props;
  const value = startTime ? availabilityState.startTime : availabilityState.endTime;
  const timeOptions = TIME_SLOTS
    .map((slot: TimeRange) => startTime ? slot.startTime : slot.endTime)
    .filter((time: ValidTime) => {
      return (startTime) ? isBefore(time, availabilityState.endTime) : isAfter(time, availabilityState.startTime)
    });

  return <select
    className={`time-select ${startTime ? 'start' : 'end'}`}
    disabled={disabled}
    value={value}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeAvailability(e, idx, startTime)}
  >
    <option value={''} disabled hidden>--Please select--</option>
    {timeOptions.map((time: ValidTime) => <option key={time} value={time}>{time}</option>)}
  </select>;
};

export default TimeSelect;