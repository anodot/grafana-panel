// @ts-nocheck
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ReducerContext, ReducerContextProvider } from './reducer_context';
import { uniqBy } from 'lodash';
import { css } from 'emotion';
import SearchPanel from './Components/SearchPanel';
import TopologyMapContainer from './Components/TopoChartContainer';
import TimeSeriesPanel from './Components/TimeSeriesPanel';
import { convertAnomaliesToEdges, convertServerDataToTopology } from './helpers';
import { VisOptions } from 'types';

import './topomap.css';

const TopoMapContainer: React.FC<VisOptions> = ({ width, height, serie }) => {
  const [drawId, setDrawId] = useState(0);
  const [metricsTimeSeriesParams, setMetricsTimeSeriesParams] = useState([]);
  const [{ drawerContent }, dispatch] = useContext(ReducerContext);
  const { metrics = [], anomalies = [], query = {}, callId, urlBase, propertiesOptions, events } =
    serie?.anodotPayload || {};
  const { source, destination, context } = query;

  useEffect(() => {
    /* Just store dataSource params in the Panel's state reducer */
    dispatch({
      type: 'bulk',
      actions: [
        { type: 'setSearchParams', searchParams: query },
        { type: 'setUrlBase', urlBase },
        { type: 'setAvailableOptions', availableOptions: propertiesOptions },
        { type: 'setEvents', events },
      ],
    });
  }, [query, urlBase, propertiesOptions]);

  useEffect(() => {
    /* Convert server data to topology data locally */
    if (source && destination && metrics) {
      const metricsData = convertServerDataToTopology(metrics, source, destination, context);
      metricsData.callId = callId;
      const anomalyData = convertAnomaliesToEdges(anomalies, source, destination, context);
      anomalyData.topologyAnomalyData.callId = callId;
      dispatch({
        type: 'bulk',
        actions: [
          { type: 'setMetricsData', metricsData, callId },
          { type: 'setAnomalyData', anomalyData, callId },
        ],
      });
    }
  }, [callId, metrics, anomalies, source, destination]);

  const resetTopology = useCallback(() => {
    setDrawId(Math.random());
    dispatch({ type: 'setSelectedEdge', selectedEdge: null });
  }, []);

  // useEffect(() => {
  //   /* Force Chart to redraw when data is changed */
  //   resetTopology();
  // }, [metricsData, anomalyData]);

  const onClickEdge = useCallback(edge => {
    if (!edge) {
      dispatch({ type: 'setSelectedEdge', selectedEdge: null });
      return;
    }

    const actions = [
      { type: 'setSelectedEdge', selectedEdge: edge },
      // { type: 'setIsVisibleTimeSeries', value: true },
      // { type: 'setDrawerContent', value: 'metric' }, // edge.hasAnomaly ? 'anomaly' : 'metric' },
    ];
    if (edge.hasAnomaly) {
      actions.push({ type: 'setOpenTimeLine', value: true });
      // actions.push({ type: 'setInvestigateAnomalies', value: edge.anomalies })
    }
    dispatch({
      type: 'bulk',
      actions,
    });

    const uniqueRecordsParams = uniqBy(edge.duplicates, d => d.metric + d.from + d.to).map(d => {
      const from = { key: edge.activeSource, value: JSON.parse(d.from)[edge.activeSource] };
      const to = { key: edge.activeDest, value: JSON.parse(d.to)[edge.activeDest] };
      return { metric: d.metric, from, to };
    });
    uniqueRecordsParams.id = JSON.stringify(uniqueRecordsParams);
    // const win = window.open('google.com', '_blank');
    // win.focus();
    // setMetricsTimeSeriesParams(uniqueRecordsParams);
  }, []);

  const getTimeSeries = useCallback(edge => {}, []);

  const onInvestigateClick = useCallback(anomalies => {
    dispatch({
      type: 'bulk',
      actions: [
        { type: 'setInvestigateAnomalies', value: anomalies },
        { type: 'setIsVisibleTimeSeries', value: true },
        { type: 'setDrawerContent', value: 'anomaly' },
      ],
    });
  });

  return (
    <div
      id="anodot-topo-map"
      className={css`
        display: flex;
        flex-direction: row;
        width: ${width}px;
        height: ${height}px;
        position: relative;
      `}
    >
      <SearchPanel resetTopology={resetTopology} onInvestigateClick={onInvestigateClick} />
      <div
        className={css`
          display: flex;
          flex: 1;
          height: 100%;
        `}
        key={drawId}
      >
        <TopologyMapContainer width={width} height={height} onClickEdge={onClickEdge} />
      </div>
      <TimeSeriesPanel isAnomaly={drawerContent === 'anomaly'} metricsParams={metricsTimeSeriesParams} />
    </div>
  );
};

export default props => (
  <ReducerContextProvider>
    <TopoMapContainer {...props} />
  </ReducerContextProvider>
);
