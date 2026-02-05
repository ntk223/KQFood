export interface DailySchedule {
  open: string;  // "08:00"
  close: string; // "22:00"
  isClosed: boolean;
}

export interface OpeningHours {
  [day: string]: DailySchedule; // Key là thứ (monday, tuesday...)
}