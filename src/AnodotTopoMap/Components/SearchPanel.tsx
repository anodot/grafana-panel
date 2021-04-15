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

const SearchPanel = props => {
  const { isDark } = useTheme();
  const [{ anomalyData, isAnomaliesLoading, selectedEdge, events, isTimeLineOpened }, dispatch] = useContext(
    ReducerContext
  );
  // const hasAnomalies = anomalyData?.legendAnomalyData?.length > 0;
  // const [activeTab, setTab] = useState('null');
  const setSelectedEdge = useCallback(selectedEdge => dispatch({ type: 'setSelectedEdge', selectedEdge }), [dispatch]);

  return (
    <div className={wrapperStyles}>
      <div className={tabsIcons}>
        {/*<IconButton*/}
        {/*  className={activeTab === 'filters' ? 'active' : ''}*/}
        {/*  onClick={() => setTab(activeTab === 'filters' ? 'none' : 'filters')}*/}
        {/*  tooltip={'Filters'}*/}
        {/*  name={'bolt'}*/}
        {/*  size={'xl'}*/}
        {/*  surface={'header'}*/}
        {/*/>*/}
        <div
          className={css`
            cursor: pointer;
            opacity: ${isTimeLineOpened ? '1' : '0.6'};
          `}
          onClick={() => dispatch({ type: 'setOpenTimeLine', value: !isTimeLineOpened })}
        >
          <TimeLineIcon isDark={isDark} />
        </div>
        {/*<IconButton*/}
        {/*  className={cx({ hasAnomalies, active: activeTab === 'timeline' })}*/}
        {/*  onClick={() => setTab(activeTab === 'timeline' ? 'none' : 'timeline')}*/}
        {/*  tooltip={'Timeline'}*/}
        {/*  name={'clock-nine'}*/}
        {/*  size={'xl'}*/}
        {/*  surface={'header'}*/}
        {/*/>*/}
      </div>
      {/*{activeTab === 'filters' && (*/}
      {/*  <>*/}
      {/*    <h5>Fast Filters (not persisting)</h5>*/}
      {/*    <div className="gf-form gf-form--grow">*/}
      {/*      <FormSelect*/}
      {/*        options={availableOptions}*/}
      {/*        inputWidth={0}*/}
      {/*        labelWidth={5}*/}
      {/*        label={'Source'}*/}
      {/*        tooltip={'Select a Source.'}*/}
      {/*        value={source}*/}
      {/*        onChange={({ value }) => {*/}
      {/*          dispatch({ type: 'setSource', value });*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="gf-form gf-form--grow">*/}
      {/*      <FormSelect*/}
      {/*        options={availableOptions}*/}
      {/*        inputWidth={0}*/}
      {/*        labelWidth={6}*/}
      {/*        label={'Destination'}*/}
      {/*        tooltip={'Select a Destination.'}*/}
      {/*        value={destination}*/}
      {/*        onChange={({ value }) => {*/}
      {/*          dispatch({ type: 'setDestination', value });*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="gf-form gf-form--grow">*/}
      {/*      <FormSelect*/}
      {/*        isClearable*/}
      {/*        isMulti*/}
      {/*        inputWidth={0}*/}
      {/*        labelWidth={6}*/}
      {/*        label={'Context'}*/}
      {/*        tooltip={'Select Context'}*/}
      {/*        value={context}*/}
      {/*        options={availableOptions}*/}
      {/*        onChange={value => {*/}
      {/*          dispatch({ type: 'setContext', value });*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*    <div className="gf-form gf-form--grow">*/}
      {/*      <FormSelect*/}
      {/*        options={availableOptions}*/}
      {/*        inputWidth={0}*/}
      {/*        labelWidth={6}*/}
      {/*        label={'Cluster By'}*/}
      {/*        tooltip={'Select Cluster By.'}*/}
      {/*        value={clusterBy}*/}
      {/*        onChange={({ value }) => {*/}
      {/*          dispatch({ type: 'setClusterBy', value });*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*)}*/}
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
          />
        ))}
    </div>
  );
};

export default SearchPanel;
