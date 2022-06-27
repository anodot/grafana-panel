import { urlBase } from './constants';
import { getDateRange, getQueryParamsUrl, getQ } from './helpers';
import {
  makeAnomaliesParams,
  makeAnomalyTimeSeriesParams,
  makeMetricTimeSeriesParams,
  makeMetricsPayload,
} from './makeParams';

const tokenKey = 'andt-token';
const currentToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNWNiNDZhZGJhNWE0YWE2MmZkOTY3ZGQ4OWZmMzQ0NDA4ZTFmMGQ5OWZmNGFiMTgzY2E4MjlkZjMzOWZjMTQ3ZDgwNzEyZDYwZWIiLCJpYXQiOjE1OTg4NjA5NDcsImV4cCI6MTYwMTQ1Mjk0N30.-NCqM2Eo2Gh61qCA4QXG_8Qbk7vYixBQqqHcshcPRFI';

export const getMetricsData = (metricName, filters = []) => {
  const params = {
    ...getDateRange(365),
    maxDataPoints: 500,
    index: 0,
    size: 10000,
  };
  const url = getQueryParamsUrl(params, '/metrics/composite/names');
  const payload = makeMetricsPayload(metricName, filters);
  return makeRequest(url, payload).then((data) => data && data.metrics);
  // .then(data => metricsResponse) //data && data.metrics);
};

export const getPropertiesDict = (metric) => {
  const url = `${urlBase}/search/metrics/propandval`;
  const payload = {
    expression: '',
    filter: [
      {
        type: 'property',
        key: 'what',
        value: metric,
        isExact: true,
      },
    ],
    size: 10000,
  };
  return makeRequest(url, payload).then(({ properties, propertyValues }) => ({
    properties: properties?.properties,
    propertyValues: propertyValues?.propertyValues?.reduce((res, { key, value }) => {
      res[key] = res[key] || [];
      res[key].push(value);
      return res;
    }, {}),
  }));
};

export const getMetricsOptions = () => {
  const url = `${urlBase}/search/metrics/props`;
  const payload = {
    properties: ['what'],
    expression: '',
    filter: [],
    size: 10000,
  };
  return makeRequest(url, payload).then((data) =>
    data && data.propertyValues ? data.propertyValues.map((el) => el.value) : []
  );
};

export const getPropertyOptions = (metric, property) => {
  const url = `${urlBase}/search/metrics/props`;
  const payload = {
    properties: [property],
    expression: '',
    filter: [
      {
        type: 'property',
        key: 'what',
        value: metric,
        isExact: true,
      },
    ],
    size: 10000,
  };
  return makeRequest(url, payload);
};

/** ----------------- anomalies ------------------- */
//
export const loadAnomalyData = (params) => {
  const url = makeAnomaliesParams(params, 0, 1000);
  return makeRequest(url).then((data = {}) => data.anomalies || []);
  // .then((data = {}) => anomalyResponse) //data.anomalies || [])
};

/** -------------- Events ------------------ */
export const loadEventsData = ({ timeInterval, filters, metric }) => {
  const params = {
    ...getDateRange(timeInterval),
    index: 0,
    size: 15,
    startBucketMode: false,
  };
  const payload = {
    filter: {
      categories: [],
      q: getQ(null, filters), //{"expression":[]}
    },
    aggregation: null,
  };
  const url = getQueryParamsUrl(params, '/user-events/execute'); //formatAnomaliesUrl(params, 0, 1000);
  return makeRequest(url, payload).then((data = {}) =>
    data.events?.map((e) => ({ ...e, startDate: e.date, isEvent: true, measure: metric }))
  );
};

/** --------- Timeseries -------------- */

export const loadMetricsTimeSeries = (metricParams, timeParams) => {
  const url = '/metrics/composite/execute';

  return makeRequest(...makeMetricTimeSeriesParams(metricParams, timeParams, url)).then((data = {}) => {
    const meta = {
      resolution: data.resolution,
      from: metricParams.from,
      to: metricParams.to,
    };

    return data.metrics?.map((m) => ({ ...m, meta }));
  });
};

export const loadAnomaliesTimeSeries = (anomaly) => {
  const url = `/anomalies/${anomaly.id}/metric/`;

  return makeRequest(makeAnomalyTimeSeriesParams(anomaly, url)).then((data = {}) => data);
};

/**   --------- HELPERS -------------------  */
export async function makeRequest(url, payload = null) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
    'Content-Type': 'application/json',
  };

  const options = payload
    ? {
        method: 'POST',
        body: JSON.stringify(payload),
        headers,
      }
    : {
        method: 'GET',
        headers,
      };

  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 401) {
        return login().then(() => makeRequest(url, payload));
      } else if (data.status === 500) {
        throw new Error('Internal Server Error');
      } else {
        return data || {};
      }
    })
    .catch((error) => {
      console.error('Request ERROR: ', url, error);
    });
}

function login() {
  localStorage.setItem(tokenKey, currentToken);
  // const answer = prompt('Login/password', 'your.email@anodot.com/******')
  // if (!answer) {
  //     alert('Reload the page and enter your login/password');
  //     return
  // }
  // const [email, password] = answer.split('/');
  const [email, password] = ['andrii.ulianenko@anodot.com', 'Anodotpractica1']; // TODO: never commit it
  const url = `${urlBase}/signin`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  };

  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem(tokenKey, data.token);
      } else {
        alert('Reload the page and enter your login/password');
        return login();
      }
    })
    .catch((error) => {
      alert('Reload the page and enter your login/password');
    });
}
