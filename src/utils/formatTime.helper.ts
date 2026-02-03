import moment from "moment";
const MAX_UTC_OFFSET = 14;
export function formatTime(date: Date, utcOffset: number = MAX_UTC_OFFSET): string {
    return moment(date).utcOffset(utcOffset).format('HH:mm:ss DD-MM-YYYY');
}