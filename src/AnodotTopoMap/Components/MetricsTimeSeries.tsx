// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { Button, Spinner, Tooltip, useTheme } from '@grafana/ui';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import { css, cx } from 'emotion';
import { loadMetricsTimeSeries } from '../api';
import { formatDate, formatDuration } from '../helpers';
import { ReducerContext } from '../reducer_context';
import { getChartsOptions } from '../../getChartsOption';

highchartsMore(Highcharts);

const cardStyles = css`
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid rgb(44, 50, 53);
  border-radius: 3px;
`;

const ellipsedStyles = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 5px;
  cursor: pointer;
`;

const multiplyX = a =>
  a.map(b => {
    const [x, ...rest] = b;
    return [x * 1000, ...rest];
  });

export const MetricsTSList = ({ metricsParams }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shift, setShift] = useState(3);

  const [{ metricsTimeSeries, searchParams, urlBase }, dispatch] = useContext(ReducerContext);
  const { timeInterval, timeScales } = searchParams;

  useEffect(() => {
    setIsLoading(true);
    setShift(3);
    const metricTimeSeriesPromises = metricsParams.map(params =>
      loadMetricsTimeSeries(
        params,
        {
          timeInterval,
          resolution: timeScales[0]?.meta[2],
        },
        urlBase
      )
    );

    Promise.all(metricTimeSeriesPromises).then(results => {
      dispatch({ type: 'setMetricsTimeSeries', value: results });
      setIsLoading(false);
    });
    /* optimization: compare metricsParams just by id string */
    /* eslint-disable-next-line  react-hooks/exhaustive-deps */
  }, [timeScales, timeInterval, metricsParams.id, dispatch]);

  const metricsTimeSeriesJoined = [].concat(...metricsTimeSeries).filter(d => !!d?.dataPoints?.length);

  const dataLength = metricsTimeSeriesJoined.length;

  return isLoading ? (
    <div className="centered">
      <Spinner />
    </div>
  ) : metricsTimeSeriesJoined.length > 0 ? (
    <div>
      {metricsTimeSeriesJoined.slice(0, shift).map(record => (
        <MetricsChartTile key={record?.id} metric={record} metricsParams={metricsParams} />
      ))}
      {shift < dataLength && (
        <Button onClick={() => setShift(shift + Math.min(3, dataLength - shift))}>
          Show +{Math.min(3, dataLength - shift)} charts more of {dataLength - shift}
        </Button>
      )}
    </div>
  ) : (
    <div>No data</div>
  );
};

const MetricsChartTile = ({ metric }) => {
  const { isDark } = useTheme();
  const { baseline, dataPoints, properties, what, meta } = metric;
  if (!dataPoints?.length) {
    return null;
  }
  const propertiesString = properties.map(({ value }) => value).join(', ');
  const propertiesTable = (
    <table>
      <tbody>
        {properties.map(({ key, value }) => (
          <tr key={key}>
            <td>{key}</td>
            <td>
              <i style={{ color: value === 'unknown' ? 'gray' : '#1e865a' }}>{value}</i>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div
      className={cx(
        cardStyles,
        css`
          background: ${isDark ? 'rgb(32, 34, 38)' : '#fff'};
        `
      )}
    >
      <div className={ellipsedStyles}>
        <Tooltip content={propertiesTable} title={`Measure: ${what}`} trigger="hover">
          <i className="green">
            <b>
              {what}, {meta.from.value}, {meta.to.value}
            </b>
            , {propertiesString}
          </i>
        </Tooltip>
      </div>
      <br />
      {dataPoints && (
        <HighchartsReact
          highcharts={Highcharts}
          options={getChartsOptions({
            areaData: multiplyX(baseline),
            lineData: multiplyX(dataPoints),
            chartClassNames: isDark ? 'isDark' : '',
            isDark,
          })}
        />
      )}
    </div>
  );
};
//
// export function getChartsOptions(areaData, lineData, anomaly, otherAnomalys = []) {
//   const config = {
//     title: {
//       text: '',
//     },
//     chart: {
//       height: '200px',
//       zoomType: 'xy',
//     },
//     xAxis: {
//       type: 'datetime',
//       tickPosition: 'inside',
//     },
//     yAxis: {
//       title: '',
//     },
//     credits: {
//       enabled: false,
//     },
//     tooltip: {
//       enabled: true,
//       useHTML: true,
//       formatter: function() {
//         const {
//           zone: { anomaly },
//           series,
//           y,
//           x,
//         } = this.point;
//         if (series.name === 'line') {
//           const anomalyRows = !anomaly
//             ? ''
//             : `
//                       <div class="anomaly-rows">
//                        <div>Score: ${Math.round(anomaly[3] * 100)}</div>
//                        <div>Value: ${Math.round(anomaly[5])}</div>
//                        <div>Duration: ${formatDuration(anomaly[1] - anomaly[0])}</div>
//                        </div>
//                     `;
//
//           return `<div class="investigate-tooltip">
//                                 <div class="timestamp">${formatDate(x / 1000)}</div>
//                                 <div><b>${Math.round(y)}</b></div>
//                                     ${anomalyRows}
//                             </div>`;
//         }
//         return false;
//       },
//     },
//     legend: {
//       enabled: false,
//     },
//     plotOptions: {
//       arearange: {
//         accessibility: {
//           enabled: false,
//         },
//         lineWidth: 1,
//         states: {
//           hover: {
//             lineWidth: 1,
//           },
//         },
//         threshold: null,
//         tooltip: {
//           enabled: false,
//         },
//         marker: {
//           enabled: false,
//           states: {
//             hover: {
//               enabled: false,
//             },
//           },
//         },
//       },
//     },
//     series: [
//       {
//         type: 'arearange',
//         data: areaData,
//         zIndex: 0,
//         className: 'anodot-area',
//         states: {
//           hover: {
//             enabled: false,
//           },
//         },
//       },
//       {
//         type: 'line',
//         zIndex: 1,
//         data: lineData,
//         className: 'anodot-line',
//         name: 'line',
//       },
//     ],
//   };
//
//   if (anomaly) {
//     const anomalyZone = [
//       {
//         value: anomaly[0] * 1000,
//         className: 'neutral-line',
//       },
//       {
//         value: anomaly[1] * 1000,
//         className: 'anomaly-part',
//         anomaly,
//       },
//       { className: 'neutral-line' },
//     ];
//     const otherZones = [];
//
//     otherAnomalys.forEach(a => {
//       otherZones.push({
//         value: a.startDate * 1000,
//         className: 'neutral-line',
//       });
//       otherZones.push({
//         value: a.endDate * 1000,
//         className: 'other-anomaly',
//         anomaly: [a.startDate, a.endDate, null, a.score, null, a.peakValue],
//       });
//     });
//
//     config.plotOptions.series = {
//       zoneAxis: 'x',
//       zones: otherZones.concat(anomalyZone),
//     };
//   }
//
//   return config;
// }
