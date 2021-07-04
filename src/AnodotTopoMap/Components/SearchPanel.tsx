// @ts-nocheck
import React, { useCallback, useContext } from 'react';
import { css } from 'emotion';
import { Spinner, useTheme } from '@grafana/ui';
import AnodotTimeline from './AnodotTimeline';
import { ReducerContext } from '../reducer_context';
import TimeLineIcon from '../../Components/TimeLineLogoComponent';

const wrapperStyles = css`
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 365px;
  overflow-y: auto;
  max-height: 100%;
`;

const tabsIcons = css`
  display: flex;
  margin-bottom: 5px;
  padding: 5px;
  width: 70px;
  justify-content: space-between;

  button {
    opacity: 0.5;
  }

  button.active {
    opacity: 1;
  }

  button.hasAnomalies {
    svg {
      fill: red;
    }
  }
`;

interface SearchPanelProps extends HTMLProps<HTMLDivElement> {
  timeFormat: string;
  onInvestigateClick: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = (props) => {
  const { isDark } = useTheme();
  const [{ anomalyData, isAnomaliesLoading, selectedEdge, events, isTimeLineOpened }, dispatch] =
    useContext(ReducerContext);

  const setSelectedEdge = useCallback(
    (selectedEdge) => dispatch({ type: 'setSelectedEdge', selectedEdge }),
    [dispatch]
  );
  return (
    <div className={wrapperStyles}>
      <div className={tabsIcons}>
        <div
          className={css`
            cursor: pointer;
            opacity: ${isTimeLineOpened ? '1' : '0.6'};
          `}
          onClick={() => dispatch({ type: 'setOpenTimeLine', value: !isTimeLineOpened })}
        >
          <TimeLineIcon isDark={isDark} />
        </div>
      </div>
      {isTimeLineOpened &&
        (isAnomaliesLoading ? (
          <Spinner />
        ) : (
          <AnodotTimeline
            anomalies={anomalyData.legendAnomalyData}
            selectedEdge={selectedEdge}
            setSelectedEdge={setSelectedEdge}
            events={events}
            onInvestigateClick={props.onInvestigateClick}
            timeFormat={props.timeFormat}
          />
        ))}
    </div>
  );
};

export default SearchPanel;
