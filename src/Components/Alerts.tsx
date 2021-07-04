// @ts-nocheck
import React from 'react';
import { VisOptions } from 'types';
import { css, cx } from 'emotion';
import { useTheme } from '@grafana/ui';
// import { getDataSourceSrv } from '@grafana/runtime';
import { getAlertsAnodotLink } from '../helpers';
import isToday from 'date-fns/isToday';
import { defaultTimeFormat, safeFormat } from '../safeFormat';

const wrapperS = css`
  overflow: auto;
`;
const tableStyles = css`
  width: 100%;
  border: none;

  th {
    color: #3fa7e6;
    text-align: center;
    padding: 6px;
  }

  td {
    text-align: center;
  }

  .severity {
    width: 20px;

    &.critical {
      background-color: #d10f37;
    }

    &.high {
      background-color: #f9771f;
    }

    &.medium {
      background-color: #ffbe2f;
    }

    &.low {
      background-color: #41ca5a;
    }

    &.info {
      background-color: #00b7f1;
    }
  }

  .name {
    text-align: left;
    padding: 6px 20px;

    a:hover {
      color: #2671ff;
      text-decoration: underline;
    }
  }
`;

const Alerts: React.FC<VisOptions> = ({ serie, height, options }) => {
  const { colors, isDark } = useTheme();
  const {
    anodotPayload: { alerts, urlBase, testCallback },
  } = serie;

  // useEffect(() => {
  //   const an = getDataSourceSrv();
  //   an.get('bc-test-Anodot-28-06').then(dataSource => {
  //     const me = dataSource.getMe(); //
  //     console.log('66|Then: ', me, '#');
  //     me.then(m => console.log('69|Alerts: ', m, '#'));
  //   });
  // }, []);

  const getAlertNode = (alert) => {
    const postfix = alert.type === 'static' ? ' (Static)' : alert.type === 'noData' ? ' (No Data)' : '';
    return alert.type === 'anomaly' ? (
      <a target="_blank" rel="noreferrer" href={getAlertsAnodotLink(alert, urlBase)}>
        {alert.title + postfix}
      </a>
    ) : (
      alert.title + postfix
    );
  };

  const getAlertCells = (alert) => {
    const formattedStartDateFull = safeFormat(alert.startTime, defaultTimeFormat);
    const isTodayFormat = isToday(alert.startTime * 1000) ? 'HH:mm' : 'MMM dd';
    const formattedStartDateShort = safeFormat(
      alert.startTime,
      options.timeFormat || isTodayFormat,
      undefined,
      isTodayFormat
    );

    return (
      <>
        <td className={`severity ${alert.severity}`} />
        <td className="name">{getAlertNode(alert)}</td>
        <td className="started" title={formattedStartDateFull}>
          {formattedStartDateShort}
        </td>
        <td className="duration">{alert.formatted.duration}</td>
        <td className="score">{alert.formatted.score || '–'}</td>
      </>
    );
  };

  return (
    <>
      <div
        className={cx(
          wrapperS,
          css`
            height: ${height}px;

            th {
              background-color: ${colors.bg2};
              border-color: ${colors.bg1};
            }

            td {
              border-color: ${isDark ? colors.bg1 : colors.bg3};
            }
          `
        )}
      >
        <table border="1" className={tableStyles}>
          <thead>
            <tr>
              <th className="severity" />
              <th className="name">Name</th>
              <th className="started">Started</th>
              <th className="duration">Duration</th>
              <th className="score">Score</th>
            </tr>
          </thead>
          <tbody>
            {alerts?.map((alert) => (
              <tr key={alert.id}>{getAlertCells(alert)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Alerts;
// // https://app.anodot.com/#!/anomalies?ref=email
// &analytics=5000
// &tabs=main;0
// &activeTab=1
// &anomalies=;0(516281fed3594033b1d4d60a64dce03e)
// &duration=;1(1)
// &durationScale=;minutes(minutes)
// &delta=;0(0)
// &deltaType=;percentage(percentage)
// &resolution=;medium(medium)
// &score=;0(0)
// &state=;both(both)
// &direction=;both(both)
// &alertId=;(5ab98e02-ea41-448f-8cfe-86ab48f2c6c5)
// &sort=;significance(significance)
// &q=;W10%253D(W10%253D)
// &constRange=;1h(c)
// &startDate=;1613943155(0)
// &endDate=;1613946755(0)
// &bookmark=;()
// &anomalyType=;all(all)
// &correlation=;()
// &showEvents=;false(false)
// &eventsQuery=;eyJleHByZXNzaW9uIjpbXX0%253D(eyJleHByZXNzaW9uIjpbXX0%253D)
// &order=;desc(desc)
