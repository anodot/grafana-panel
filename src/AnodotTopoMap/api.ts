// @ts-nocheck
import { getDateRange, getQueryParamsUrl, getQ } from './helpers';
import {
  makeAnomaliesParams,
  makeAnomalyTimeSeriesParams,
  makeMetricTimeSeriesParams,
  makeMetricsPayload,
} from './makeParams';

const urlBaseHardcoded = 'https://app.anodot.com/api/v1';

const tokenKey = 'andt-token';

export const getMetricsData = (metricName, filters = [], urlBase) => {
  const params = {
    ...getDateRange(365),
    maxDataPoints: 500,
    index: 0,
    size: 10000,
  };
  const url = urlBase + getQueryParamsUrl(params, '/metrics/composite/names');
  const payload = makeMetricsPayload(metricName, filters);
  return makeRequest(url, payload).then((data) => data && data.metrics);
  // .then(data => metricsResponse) //data && data.metrics);
};

export const getPropertiesDict = (metric) => {
  const url = `${urlBaseHardcoded}/search/metrics/propandval`;
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

export const getMetricsOptions = (loginCallback) => {
  const url = `${urlBaseHardcoded}/search/metrics/props`;
  const payload = {
    properties: ['what'],
    expression: '',
    filter: [],
    size: 10000,
  };
  return makeRequest(url, payload, loginCallback).then((data) =>
    data && data.propertyValues ? data.propertyValues.map((el) => el.value) : []
  );
};

export const getPropertyOptions = (metric, property) => {
  const url = `${urlBaseHardcoded}/search/metrics/props`;
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
export const loadAnomalyData = (params, urlBase) => {
  const url = urlBase + makeAnomaliesParams(params, 0, 1000);
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

export const loadMetricsTimeSeries = (metricParams, timeParams, urlBase) => {
  const url = urlBase + '/metrics/composite/execute';

  return makeRequest(...makeMetricTimeSeriesParams(metricParams, timeParams, url)).then((data = {}) => {
    const meta = {
      resolution: data.resolution,
      from: metricParams.from,
      to: metricParams.to,
    };

    return data.metrics?.map((m) => ({ ...m, meta }));
  });
};

export const loadAnomaliesTimeSeries = (anomaly, urlBase) => {
  const url = urlBase + `/anomalies/${anomaly.id}/metric/`;

  return makeRequest(makeAnomalyTimeSeriesParams(anomaly, url)).then((data = {}) => data);
};

/**   --------- HELPERS -------------------  */
export async function makeRequest(url, payload = null, loginCallback) {
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
        return login(loginCallback).then(() => makeRequest(url, payload, loginCallback));
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
