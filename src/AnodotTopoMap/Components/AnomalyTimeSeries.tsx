// @ts-nocheck
import React, { useContext, useEffect, useState } from 'react';
import { Button, Spinner, Tooltip, useTheme } from '@grafana/ui';
import { css, cx } from 'emotion';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import { loadAnomaliesTimeSeries } from '../api';
import { formatDate, formatDuration } from '../helpers';
import { ReducerContext } from '../reducer_context';
import { getChartsOptions } from '../../getChartsOption';

highchartsMore(Highcharts);

const contentStyles = css`
  display: flex;
  justify-content: space-between;
`;

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

export const AnomalyTSList = () => {
  const [shift, setShift] = useState(3);

  const [{ investigateAnomalies, urlBase }] = useContext(ReducerContext);

  return (
    <div>
      {investigateAnomalies.slice(0, shift).map(anomaly => (
        <AnomalyDetailsTile urlBase={urlBase} key={anomaly.id + anomaly.metricName} anomaly={anomaly} />
      ))}
      {shift < investigateAnomalies.length && (
        <Button onClick={() => setShift(shift + Math.min(3, investigateAnomalies.length - shift))}>
          Show +{Math.min(3, investigateAnomalies.length - shift)} charts more of {investigateAnomalies.length - shift}
        </Button>
      )}
    </div>
  );
};

const AnomalyDetailsTile = ({ anomaly, urlBase }) => {
  const [timeSeriesData, setTimeSeriesData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();
  const { baseline, dataPoints, anomalies, otherAnomalyIntervals } = timeSeriesData;
  const properties = anomaly.metrics[0].properties.map(({ value }) => value).join(', ');
  const propertiesTable = (
    <table>
      <tbody>
        {anomaly.metrics[0].properties.map(({ key, value }) => (
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

  const infoLine = (
    <div className={contentStyles}>
      <i style={{ color: 'darkred' }}>{Math.round(anomaly.score * 100)}</i>
      <span>{formatDate(anomaly.startDate)}</span>
      <span>{formatDuration(anomaly.endDate - anomaly.startDate)}</span>
    </div>
  );

  useEffect(() => {
    setIsLoading(true);
    loadAnomaliesTimeSeries(anomaly, urlBase).then(data => {
      setTimeSeriesData(data);
      setIsLoading(false);
    });
    /* optimization: compare anomaly just by id + metricName string */
    /* eslint-disable-next-line  react-hooks/exhaustive-deps */
  }, [`${anomaly?.id} ${anomaly?.metricName}`, urlBase]); //

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
        <Tooltip content={propertiesTable} title={`Measure: ${anomaly.metricName}`} trigger="hover">
          <i className="green">
            <b>{anomaly.metricName}</b>, {properties}
          </i>
        </Tooltip>
      </div>
      <br />
      {infoLine}
      {isLoading ? (
        <Spinner />
      ) : (
        dataPoints && (
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartsOptions({
              areaData: multiplyX(baseline),
              lineData: multiplyX(dataPoints),
              anomaly: anomalies[0],
              otherAnomalys: otherAnomalyIntervals,
              chartClassNames: isDark ? 'isDark' : '',
              isDark,
            })}
          />
        )
      )}
    </div>
  );
};
