// @ts-nocheck
import React, { useCallback, useContext } from 'react';
import { css, cx } from 'emotion';
import { isEqual } from 'lodash';
import { useTheme } from '@grafana/ui';
import { formatDate } from '../helpers';
import { getAnodotLink } from '../makeParams';
import { ReducerContext } from '../reducer_context';
import RadarIcon from '../../img/RadarIcon';

const AnodotTimeline = ({ anomalies, selectedEdge, setSelectedEdge, events = [], onInvestigateClick }) => {
  const activeAnomaliesIds = selectedEdge?.anomalies?.map(obj => obj.anomalyId);
  const alterList = anomalies.concat(events).sort((a, b) => b.startDate - a.startDate);
  const isFiltrationOn = !selectedEdge?.selectedFromPanel && selectedEdge?.hasAnomaly;
  const { isDark, colors } = useTheme();

  if (alterList.length === 0 && events.length === 0) {
    return <div>No Timeline data</div>;
  }

  const renderItem = (item, i) => {
    const isActive = !item?.isEvent && activeAnomaliesIds?.includes(item.anomalyId);

    if (item.isEvent && !isFiltrationOn) {
      return (
        <div className={cx('isEvent', itemStyles, { isDark })} key={i}>
          <div className={cx('card', cardStyles, { isDark })}>
            <div className={leftSection} />
            <div className={centralSection}>
              <div>Event</div>
              <div>
                <span className={secondary}>Started: </span>
                {formatDate(item.startDate)}
              </div>
            </div>
            <div className={rightSection}>
              <div className="metricsNumber">5</div>
              <div className={secondary}>METRICS</div>
            </div>
          </div>
        </div>
      );
    }
    if (!item.isEvent && (!selectedEdge || (isFiltrationOn && isActive) || !isFiltrationOn)) {
      return (
        <div className={cx(itemStyles, { isDark })} key={item.anomalyId}>
          <AnomalyCard
            isActive={isActive}
            setSelectedEdge={setSelectedEdge}
            anomalies={item.records}
            selectedEdge={selectedEdge}
            onInvestigateClick={onInvestigateClick}
            affectedEdges={item.affectedEdges}
            startDate={item.startDate}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={css`
        background-color: ${colors.bg1};
      `}
      onClick={() => setSelectedEdge(null)}
    >
      {alterList.map(renderItem)}
    </div>
  );
};

const AnomalyCard = ({ startDate, anomalies, isActive, setSelectedEdge, selectedEdge }) => {
  const { isDark } = useTheme();
  const [{ searchParams, urlBase }] = useContext(ReducerContext);
  const anomaly = anomalies[0];
  const linkToAnodot = getAnodotLink(searchParams, anomaly.id, anomaly.metricName, urlBase);
  const onClick = useCallback(
    e => {
      e.stopPropagation();
      e.preventDefault();
      const anomalyToSet = {
        selectedFromPanel: true,
        anomalies: [
          {
            anomalyId: anomaly.id,
            affectedEdges: anomaly.edges.map(e => e.connectionId),
          },
        ],
      };
      const isSame = isEqual(selectedEdge, anomalyToSet);
      setSelectedEdge(isSame ? null : anomalyToSet);
    },
    [anomaly, selectedEdge, setSelectedEdge]
  );

  return (
    <div className={cx('card', { active: isActive, isDark }, cardStyles)}>
      <div className={leftSection}>{anomaly.state !== 'closed' && <RadarIcon />}</div>
      <div className={centralSection}>
        <div>{anomaly.metricName}</div>
        <div>
          <span className={secondary}>Started: </span>
          <span>{formatDate(startDate)}</span>
        </div>
        <div className="activeContent">
          <span onClick={onClick}>Show on Map</span>
          <a target={'_blank'} href={linkToAnodot}>
            Investigate
          </a>
        </div>
      </div>
      <div className={rightSection}>
        <div className="metricsNumber">{anomaly?.metricsCount?.anomalyTotal || ''}</div>
        <div className={secondary}>METRICS</div>
      </div>
    </div>
  );
};

export default AnodotTimeline;

const itemStyles = css`
  position: relative;
  padding-left: 15px;
  padding-bottom: 12px;
  margin-left: 8px;
  cursor: pointer;
  border-left: 2px solid #e9e9f0;

  &.isDark {
    border-left: 2px solid #8995a0;
  }

  &:last-child {
    border-color: rgba(0, 0, 0, 0);
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: -9px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ff5653;
    border: 5px solid #fae7eb;
  }

  &.isEvent:before {
    border-color: #e9f0ff;
    background-color: #c9dbff;
  }

  // &:last-child {
  //   border: none;
  // }
`;

const cardStyles = css`
  padding: 12px;
  width: 100%;
  font-size: 10px;
  border-radius: 6px;
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  font-size: 14px;
  color: #3d4c59;
  background-color: #fff;
  border: solid 1px #e9e9f0;

  &.active {
    border: 1px solid #c9dbff;
    background-color: #f7faff;
  }

  &.isDark {
    color: #c7d0d9;
    background-color: #202226;
    border: none;

    &.active {
      border: 1px solid #8995a0;
    }
  }

  &:hover,
  &.active {
    font-size: 14px;

    .activeContent {
      display: block;
      margin-top: 5px;
    }
  }

  .activeContent {
    display: none;
    margin-top: 20px;

    span,
    a {
      color: #33a2e5;
      margin-right: 18px;
    }
  }
`;
const leftSection = css`
  width: 12px;
`;
const centralSection = css`
  display: flex;
  flex-direction: column;
  width: 231px;
`;

const rightSection = css`
  display: flex;
  flex-direction: column;

  .metricsNumber {
    font-size: 26px;
    text-align: center;
  }
`;

const secondary = css`
  font-size: 12px;
  color: #8995a0;
`;
