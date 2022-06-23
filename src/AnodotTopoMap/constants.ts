export const urlBase = (process.env.REACT_APP_ANODOT_API_URL || 'https://app.anodot.com') + '/api/v1';
export const timeFormat = 'MM/DD/YYYY h:mm a';
export const splitSign = '] + [';
export const durations = {
  '1 minute': 1,
  '5 minutes': 5,
  '15 minutes': 15,
  '30 minutes': 30,
  '1 hour': 60,
  '2 hours': 120,
  '5 hours': 300,
};

export const timeIntervals = {
  'Last 15 mins': 0.01,
  'Last 30 mins': 0.021,
  'Last Hour': 0.0417,
  'Last Day': 1,
  'Last Week': 7,
  'Last Month': 30,
  'Last Year': 365,
  Custom: 'Custom',
};

export const timeScaleOptions = [
  // [ duration value, duration units, resolution, sorting order ]
  { label: '1 Minute', value: [1, 'minutes', 'short', 0] },
  { label: '5 Minutes', value: [5, 'minutes', 'medium', 1] },
  { label: '1 Hour', value: [1, 'hours', 'long', 2] },
  { label: '1 Day', value: [1, 'days', 'longlong', 3] },
  { label: '1 Week', value: [7, 'days', 'weekly', 4] },
];

export const directionsOptions = [
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' },
];

export const deltaTypesOptions = [
  { label: 'Absolute', value: 'absolute' },
  { label: 'Percentage', value: 'percentage' },
];

export const sortAnomalyOptions = [
  { label: 'Score', value: 'score' },
  { label: 'Start Date', value: 'startDate' },
  { label: 'Absolute Delta', value: 'delta' },
];
