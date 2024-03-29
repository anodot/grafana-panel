// @ts-nocheck
import { urlBase } from './constants';
import { getDateRange, getQ, getQueryParamsUrl } from './helpers';
import { b64EncodeUnicode } from '../helpers';

export const makeMetricsPayload = (metricName, filters = []) => ({
  name: {
    auto: true,

    prefix: null,
  },
  displayOnly: true,
  filter: {
    function: 'alphanumeric',
    parameters: [
      {
        name: 'Top N',
        value: 10,
      },
    ],
    children: [],
    id: '6fbf-1c1c5f022de7',
    type: 'function',
  },
  expressionTree: {
    root: {
      searchObject: getQ(metricName, filters),
      children: [],
      type: 'metric',
      id: '5800-25645814655e',
      uiIndex: 0,
    },
  },
  context: '',
});

export const makeAnomaliesParams = (
  {
    delta = 0,
    deltaType = 'absolute',
    timeInterval,
    state = 'both',
    durationUnit,
    sort = 'delta',
    duration,
    score,
    metric,
    filters = [],
    resolution,
    valueDirection = 'both',
  },
  index,
  size
) => {
  const params = {
    ...getDateRange(timeInterval, true),
    index,
    size,
    score,
    durationUnit,
    durationValue: duration,
    resolution,
    anomalyType: 'all',
    bookmark: '',
    correlation: '',
    delta,
    deltaType,
    order: 'desc',
    q: getQ(metric, filters, true),
    sort,
    startBucketMode: true,
    state,
    valueDirection,
  };
  return getQueryParamsUrl(params, '/anomalies');
};
export function makeAnomalyTimeSeriesParams(anomaly, url) {
  const { resolution, startDate, endDate, id, metricName, metrics = [] } = anomaly;
  const metricId = metrics[0]?.properties.reduce((res, p) => `${res}.${p.key}=${p.value}`, `what=${metricName}`);
  const anomalyDuration = endDate - startDate;
  const now = Math.floor(Date.now() / 1000);
  const sinceAnomaly = now - endDate;

  const params = {
    anomalyId: id,
    startDate: startDate - Math.max(anomalyDuration * 11, sinceAnomaly * 3), // TODO: Define exactly
    endDate: now,
    resolution,
    metricId,
    startBucketMode: false,
    baseline: true,
    datapoints: true,
  };
  return getQueryParamsUrl(params, url + encodeURI(metricId));
}

export function makeMetricTimeSeriesParams(
  { metric, from, to },
  { timeInterval: { startDate, endDate }, resolution = '' },
  url
) {
  const params = {
    fromDate: startDate,
    toDate: endDate,
    includeBaseline: true,
    index: 0,
    maxDataPoints: 500,
    resolution,
    size: 10,
    startBucketMode: true,
  };

  const payload = {
    composite: {
      name: {
        auto: true,
        prefix: null,
      },
      displayOnly: true,
      filter: {
        function: 'alphanumeric',
        parameters: [
          {
            name: 'Top N',
            value: 10,
          },
        ],
        children: [],
        id: '05c6-ae07c72815ca',
        type: 'function',
      },
      expressionTree: {
        root: {
          searchObject: {
            expression: [
              {
                type: 'property',
                key: 'what',
                value: metric,
                isExact: true,
              },
              {
                type: 'property',
                key: from.key,
                value: from.value,
                isExact: true,
              },
              {
                type: 'property',
                key: to.key,
                value: to.value,
                isExact: true,
              },
            ],
          },
          children: [],
          type: 'metric',
          id: 'eca1-20ff8e3d1c13',
          uiIndex: 0,
        },
      },
      scalarTransforms: [
        {
          function: 'current',
          children: [],
          id: '29bb-80728792db0f',
          parameters: [],
          type: 'function',
        },
      ],
      context: '',
    },
    selectors: [],
  };

  return [getQueryParamsUrl(params, url), payload];
}

export function getAnodotLink(query, anomalyId, metric, urlBase) {
  const {
    timeScales,
    timeInterval,
    // score,
    // filters,
    // duration,
    // deltaValue,
    // deltaType,
    // showEvents,
    // sortBy,
    // direction,
    //constRange, // TODO: add from datasource ? E.g: '1w(1w)'
  } = query;

  // const encodedExpression = encodeURIComponent(b64EncodeUnicode(JSON.stringify(getQ(metric, filters)?.expression)));
  const toLiteral = (value) => `${value || ''}(${value || ''})`;
  const params = {
    anomalies: `0(${anomalyId})`,
    duration: '1(1)', // toLiteral(duration),
    durationScale: toLiteral(timeScales[0]?.meta?.[1]),
    delta: '0(0)', // toLiteral(deltaValue),
    deltaType: 'percentage(percentage)', //toLiteral(deltaType),
    resolution: toLiteral(timeScales[0]?.meta?.[2]),
    score: '0(0)', // toLiteral(score[0]),
    state: 'both(both)',
    direction: 'both(both)', // toLiteral(direction.length === 1 ? direction[0]?.value : 'both'),
    alertId: '()',
    sort: 'significance(significance)', // toLiteral(sortBy),
    q: '()', //toLiteral(encodedExpression),
    constRange: '1h(c)', //'1w(1w)',
    startDate: `${timeInterval.startDate}(0)`,
    endDate: `${timeInterval.endDate}(0)`,
    bookmark: '()',
    anomalyType: 'all(all)',
    correlation: '()',
    showEvents: 'false(false)', // toLiteral(String(showEvents)),
    eventsQuery: '()',
    order: 'desc(desc)',
  };

  const format = (str, key) => {
    const a = `&${key}=;${params[key]}`;
    return str + a;
  };

  const url = urlBase + '#!/anomalies?ref=grafana&tabs=main;0&activeTab=1';
  const link = Object.keys(params).reduce(format, '');
  return url + link;
}
