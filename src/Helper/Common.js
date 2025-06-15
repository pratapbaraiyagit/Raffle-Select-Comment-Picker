import { toast } from 'react-toastify';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * @desc Return error msg
 */
export const renderMsg = e => {
  console.error('e', e);
  return e?.response?.status === 401 ||
    e?.response?.status === 404 ||
    e?.response?.status === 400
    ? e?.response?.data?.message
    : 'Something went wrong, please try again later!';
};

/**
 * @desc Get short number
 */
export const getShortNumber = number => {
  if (number >= 1000000) return (number / 1000000)?.toFixed(1) + 'M';
  else if (number >= 1000) return (number / 1000)?.toFixed(1) + 'K';
  else return number?.toString();
};

/**
 * @desc toast config
 */
export const toastCongig = {
  position: toast.POSITION.TOP_CENTER,
  theme: 'light',
};

export const formattedDate = date => {
  if (!date) return;
  const [y, m, d] = date?.split('T')?.[0]?.split('-');
  if (y && m && d) return `${d}-${m}-${y}`;
  else return date;
};

/**
 * @desc Create date with month in word
 * @param {*} input
 * @returns date in string
 */
export const formatDateWithMonth = input => {
  if (!input) return;
  const date = new Date(input);
  const day = date?.getDate();
  const month = monthNames[date?.getMonth()];
  const year = date?.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const time = `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;

  return time;
};
