// @ts-nocheck
import React from 'react';
import { VisOptions } from 'types';
import { css, cx } from 'emotion';
import { useTheme } from '@grafana/ui';
// import { getDataSourceSrv } from '@grafana/runtime';
import { getAlertsAnodotLink, getAnalytics } from '../helpers';
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

  const getAlertNameCell = (alert) => {
    const postfix = alert.type === 'static' ? ' (Static)' : alert.type === 'noData' ? ' (No Data)' : '';
    const anomalyInvestigateLink = getAlertsAnodotLink(alert, urlBase);
    const onAlertClickSegmentClb = getAnalytics({
      category: 'Alerts: Investigate click',
      link: anomalyInvestigateLink,
    });
    const alertsConsoleUrl = `${urlBase}/#!/r/alerts-console`;
    const href = alert.type === 'anomaly' ? anomalyInvestigateLink : alertsConsoleUrl;
    return (
      <a target="_blank" onClick={onAlertClickSegmentClb} rel="noreferrer" href={href}>
        {alert.title + postfix}
      </a>
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
        <td className="name">{getAlertNameCell(alert)}</td>
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
