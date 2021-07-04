// @ts-nocheck
import { getQ } from './AnodotTopoMap/helpers';

export const getPluoral = (n, base, suffix = 's') => base + (n === 1 ? '' : suffix);
export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const formatDate = (secs, format = 'MM/DD/YYYY') => {
  const addZero = (v) => ('0' + v).slice(-2);
  let d = new Date(secs * 1000);
  const hours = `${addZero(d.getHours())}:${addZero(d.getMinutes())}`;
  const date = format
    .replace('DD', addZero(d.getDate()))
    .replace('MM', addZero(d.getMonth() + 1))
    .replace('YYYY', addZero(d.getYear() - 100));
  return (checkIsToday(secs * 1000) ? 'Today ' : `${date} `) + hours;
};

export const checkIsToday = (mSeconds) => {
  return new Date().getTime() - mSeconds < 86400000 && new Date().getDate() === new Date(mSeconds).getDate();
};

export const formatDuration = (seconds) => {
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

const timescaleToResolutionMap = {
  '1m': 'short',
  '5m': 'medium',
  '1h': 'long',
  '1d': 'longlong',
  '1w': 'weekly',
};

const timescaleToDurationScaleMap = {
  '1m': 'minutes',
  '5m': 'minutes',
  '1h': 'hours',
  '1d': 'days',
  '1w': 'weeks',
};

export function getAlertsAnodotLink(alert, urlBase) {
  const {
    groupId,
    startTime,
    endTime,
    duration,
    timeScale,
    alertConfigurationId, // Alert for the group containing anomaly
    id, // Alert for the specific anomaly
    formatted: { score },
  } = alert;
  const durationScale = timescaleToDurationScaleMap[timeScale];
  const resolution = timescaleToResolutionMap[timeScale];
  const toLiteral = (value) => `${value}(${value})`;
  const params = {
    anomalies: `0(${groupId})`,
    duration: '1(1)', // should be always 1
    durationScale: durationScale && toLiteral(durationScale),
    delta: '0(0)',
    deltaType: 'percentage(percentage)',
    resolution: resolution && toLiteral(resolution),
    score: toLiteral(score),
    state: 'both(both)',
    direction: 'both(both)',
    alertId: `(${alertConfigurationId})`,
    sort: 'significance(significance)',
    q: '()',
    constRange: '1h(c)',
    startDate: `${startTime}(0)`,
    endDate: `${endTime}(0)`,
    bookmark: '()',
    anomalyType: 'all(all)',
    correlation: '()',
    showEvents: 'false(false)',
    eventsQuery: '()',
    order: 'desc(desc)',
  };
  const format = (str, key) => {
    const a = `&${key}=;${params[key]}`;
    return str + a;
  };

  const url = urlBase + '/#!/anomalies?ref=grafana&analytics=5000&tabs=main;0&activeTab=1';
  const link = Object.keys(params).reduce(format, '');
  return url + link;
}
