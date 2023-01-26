import React from "react";
import { TIME_SLOTS } from "../constants";
import { TimeRange, ValidTime } from "../typing/types";

const TimeSelect = (props: {
  startTime: boolean,
  defaultVal: ValidTime | '',
  disabled: boolean,
  idx: number,
  changeAvailability: (e: React.ChangeEvent<HTMLSelectElement>, idx: number, startTime: boolean) => void,
}) => {
  const { startTime, defaultVal, disabled, idx, changeAvailability } = props;
  const emptyVal = '';
  return <select
    className={`time-select ${startTime ? 'start' : 'end'}`}
    disabled={disabled}
    defaultValue={defaultVal}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => changeAvailability(e, idx, startTime)}
  >
    <option value={emptyVal} disabled hidden>--Please select--</option>
    {TIME_SLOTS.map((ts: TimeRange) => {
      const val = startTime ? ts.startTime : ts.endTime;
      return <option key={val} value={val}>{val}</option>
    })}
  </select>;
};

export default TimeSelect;