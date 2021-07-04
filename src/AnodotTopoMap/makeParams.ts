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
  const timeSeriesUrl = `${urlBase}/anomalies/5b8b9c2f25e043cda4c685ba531ea42e/metric/what%3Distio_tcp_connections_opened_total.destination_app%3Delasticsearch.destination_canonical_revision%3Dlatest.destination_canonical_service%3Delasticsearch.destination_service%3Delasticsearch-discovery_default_svc_cluster_local.destination_service_name%3Delasticsearch-discovery.destination_service_namespace%3Ddefault.destination_workload%3Delasticsearch-master.destination_workload_namespace%3Ddefault.namespace%3Ddefault.pod_name%3Delasticsearch-master-0.reporter%3Ddestination.request_protocol%3Dtcp.response_flags%3D-.source_app%3Dunknown.source_canonical_revision%3Dlatest.source_canonical_service%3Dunknown.source_workload%3Dunknown.source_workload_namespace%3Dunknown?anomalyId=5b8b9c2f25e043cda4c685ba531ea42e&baseline=true&datapoints=true&endDate=1594291500&metricId=what%3Distio_tcp_connections_opened_total.destination_app%3Delasticsearch.destination_canonical_revision%3Dlatest.destination_canonical_service%3Delasticsearch.destination_service%3Delasticsearch-discovery_default_svc_cluster_local.destination_service_name%3Delasticsearch-discovery.destination_service_namespace%3Ddefault.destination_workload%3Delasticsearch-master.destination_workload_namespace%3Ddefault.namespace%3Ddefault.pod_name%3Delasticsearch-master-0.reporter%3Ddestination.request_protocol%3Dtcp.response_flags%3D-.source_app%3Dunknown.source_canonical_revision%3Dlatest.source_canonical_service%3Dunknown.source_workload%3Dunknown.source_workload_namespace%3Dunknown&resolution=medium&startBucketMode=false&startDate=1594093200`;

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
  const { timeScales, timeInterval, score, duration, filters, deltaValue, deltaType, showEvents, sortBy, direction } =
    query;

  const encodedExpression = encodeURIComponent(b64EncodeUnicode(JSON.stringify(getQ(metric, filters)?.expression)));
  const toLiteral = (value) => `${value}(${value})`;
  const params = {
    anomalies: `0(${anomalyId})`,
    duration: toLiteral(duration),
    durationScale: toLiteral(timeScales[0]?.meta?.[1]),
    delta: toLiteral(deltaValue),
    deltaType: toLiteral(deltaType),
    resolution: toLiteral(timeScales[0]?.meta?.[2]),
    score: toLiteral(score[0]),
    bookmark: '()',
    anomalyType: 'all(all)',
    correlation: '()',
    state: 'both(both)',
    showEvents: toLiteral(showEvents),
    eventsQuery: '()',
    direction: toLiteral(direction.length === 1 ? direction[0]?.value : 'both'),
    alertId: '()',
    sort: toLiteral(sortBy),
    order: 'desc(desc)',
    q: toLiteral(encodedExpression),
    constRange: '1w(1w)', // TODO: add from datasource
    startDate: toLiteral(timeInterval.startDate),
    endDate: toLiteral(timeInterval.endDate),
  };

  const format = (str, key) => {
    const a = `&${key}=;${params[key]}`;
    return str + a;
  };

  const url = urlBase + '/#!/anomalies?tabs=main;0&activeTab=1&';
  const link = Object.keys(params).reduce(format, '');
  return url + link;
}
