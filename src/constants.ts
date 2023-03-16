import { TimeRange } from "./typing/types";

export const TIME_SLOTS: TimeRange[] = [
  { startTime: '0700', endTime: '0745'},
  { startTime: '0745', endTime: '0830'},
  { startTime: '0830', endTime: '0845', break: true },
  { startTime: '0845', endTime: '0930'},
  { startTime: '0930', endTime: '1015'},
  { startTime: '1015', endTime: '1030', break: true },
  { startTime: '1030', endTime: '1115'},
  { startTime: '1115', endTime: '1200'},
  { startTime: '1200', endTime: '1300', break: true},
  { startTime: '1300', endTime: '1345'},
  { startTime: '1345', endTime: '1430'},
  { startTime: '1430', endTime: '1445', break: true},
  { startTime: '1445', endTime: '1530'},
  { startTime: '1530', endTime: '1615'},
  { startTime: '1615', endTime: '1630', break: true},
  { startTime: '1630', endTime: '1715'},
];

export const TIME_SLOTS_NO_BREAKS = TIME_SLOTS.filter((ts: TimeRange) => !ts.break);