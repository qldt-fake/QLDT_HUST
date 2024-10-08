import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import vi from 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(customParseFormat);

dayjs.extend(relativeTime);
dayjs.locale(vi);

export const coverTimeToNow = (date: string) => dayjs(date).fromNow(true);
export const coverTimeToNowAgo = (date: string) => dayjs(date).fromNow();

export default dayjs;
