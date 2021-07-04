// @ts-nocheck
import React from 'react';
import { VisOptions } from 'types';
import { css, cx } from 'emotion';
import { formatDuration } from '../AnodotTopoMap/helpers';
import { useTheme } from '@grafana/ui';

const wrapperStyleClass = css`
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
`;
const anomaliesStyleClass = css`
  padding: 10px;
  margin: 10px;
  fontsize: 0.9em;
  display: block;
  font-size: 14px;
  opacity: 1;
  width: 250px;
  border: 1px solid;
  border-radius: 3px;
`;

const Secondary = ({ children }) => (
  <span
    className={css`
      font-style: italic;
      color: grey;
    `}
  >
    {children}
  </span>
);

const AnomaliesList: React.FC<VisOptions> = ({ serie, height }) => {
  const theme = useTheme();
  const anomaliesDatasets = serie?.anodotPayload?.anomalies?.map((a) => a.dataSet);
  if (!anomaliesDatasets?.length) {
    return <div>No data for anomalies list or chart</div>;
  }

  const anomalies = [].concat(...anomaliesDatasets);

  return (
    <div
      className={cx(
        wrapperStyleClass,
        css`
          max-height: ${height - 50}px;
        `
      )}
    >
      {anomalies?.map((anomaly) => (
        <a
          key={anomaly.id}
          // target="_blank"
          // href={`https://app.anodot.com/#!/anomalies?ref=grafana&tabs=main;0&activeTab=1&alertId=;(${anomaly.id})`}
          className={cx(
            anomaliesStyleClass,
            css`
              background-color: ${theme.colors.bg2};
              border-color: ${theme.colors.bg3};
            `
          )}
        >
          <div className="cardContent" key={anomaly.id}>
            <div>
              <Secondary>Metric name:</Secondary> {anomaly.metricName}
            </div>
            <div>
              <Secondary>Score:</Secondary> {Math.round(anomaly.score * 100)}
            </div>
            <div>
              <Secondary>State:</Secondary> {anomaly.state}
            </div>
            <div>
              <Secondary>Duration:</Secondary> {formatDuration(anomaly.endDate - anomaly.startDate)}
            </div>
            <div>
              <Secondary>Anomaly Id:</Secondary> <small>{anomaly.id}</small>
            </div>
          </div>
        </a>
      )) || 'No data for anomalies list or chart'}
    </div>
  );
};

export default AnomaliesList;
