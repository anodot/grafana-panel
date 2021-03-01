// @ts-nocheck
export const getPluoral = (n, base, suffix = 's') => base + (n === 1 ? '' : suffix);
export const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
export const formatDate = (secs, format = 'MM/DD/YYYY') => {
  const addZero = v => ('0' + v).slice(-2);
  let d = new Date(secs * 1000);
  const hours = `${addZero(d.getHours())}:${addZero(d.getMinutes())}`;
  const date = format
    .replace('DD', addZero(d.getDate()))
    .replace('MM', addZero(d.getMonth() + 1))
    .replace('YYYY', addZero(d.getYear() - 100));
  return (checkIsToday(secs * 1000) ? 'Today ' : `${date} `) + hours;
};

export const checkIsToday = mSeconds => {
  return new Date().getTime() - mSeconds < 86400000 && new Date().getDate() === new Date(mSeconds).getDate();
};

export const formatDuration = seconds => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} ${getPluoral(minutes, 'minute')}`;
  }
  const roundedHours = Math.round(minutes / 30) / 2;
  return `${roundedHours} ${getPluoral(roundedHours, 'hour')}`;
};

export function b64EncodeUnicode(str) {
  // first we use encodeURIComponent to get percent-encoded UTF-8,
  // then we convert the percent encodings into raw bytes which
  // can be fed into btoa.
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode('0x' + p1);
    })
  );
}
