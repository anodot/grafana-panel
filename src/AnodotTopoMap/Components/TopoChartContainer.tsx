// @ts-nocheck
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Spinner } from '@grafana/ui';
import { AutoSizer } from 'react-virtualized';
import TopologyMap from './TopoChart';
import { ReducerContext } from '../reducer_context';
import { getMetricsData, loadAnomalyData } from '../api';
import CustomModal from './CustomModal';
import { convertAnomaliesToEdges, convertMetricsDataToSubTopology, manageLinksInCluster, mixEdges } from '../helpers';
import AnodotLogoSvg from '../../Components/AnodotLogoComponent';

const ChartContainer = ({ onClickEdge }) => {
  const [
    {
      isSubAnomalyLoading,
      isMetricsLoading,
      metricsData,
      anomalyData,
      selectedEdge,
      selectedNode = {},
      searchParams = {}, // query
      subTopologyAnomalyData,
      clusterMetricsData,
      isClusterMetricsLoading,
      // context = [],
      // source,
      // destination,
      // clusterBy,
      urlBase,
    },
    dispatch,
  ] = useContext(ReducerContext);

  const [showModal, setShowModal] = useState(false);
  const [currentDatasetKey, setDatasetKey] = useState('0');
  const { context = [], source, destination, clusterBy } = searchParams;
  const setSelectedEdge = useCallback(
    (selectedEdge) => dispatch({ type: 'setSelectedEdge', selectedEdge }),
    [dispatch]
  );
  const setSelectedNode = useCallback(
    (selectedNode) => {
      dispatch({ type: 'setSelectedNode', selectedNode });
      setTimeout(() => setShowModal(true), 0);
    },
    [dispatch]
  );

  useEffect(() => {
    const { metrics, score, timeInterval, timeScales, sortAnomaly, duration } = searchParams; // query

    if (selectedNode) {
      /* Manage data for subcluster */
      const callId = Math.floor(Math.random() * 100000);
      const { activeSource, activeDest, name, ...contextFields } = selectedNode;
      const filters = Object.keys(contextFields).map((key) => ({
        type: 'property',
        key,
        value: contextFields[key] || '*',
        isExact: true,
      }));
      const filtersSource = filters.concat([
        {
          type: 'property',
          key: activeSource,
          value: name,
          isExact: true,
        },
      ]);
      const filtersDest = filters.concat([
        {
          type: 'property',
          key: activeDest,
          value: name || '*',
          isExact: true,
        },
      ]);
      if (source && destination && clusterBy) {
        /* Case when we split the Same metric data
       const context = Object.keys(contextFields);
       context.push(clusterby);
       const clusterMetricsData = convertServerDataToTopology(metricsServerData, source, destination, context, { filters: contextFields });
       dispatch({ type: 'setClusterMetricsData', clusterMetricsData });
       */
        /* Case when we request new pre-filtered data */
        dispatch({ type: 'setIsClusterMetricsLoading', isClusterMetricsLoading: true });
        const metricDataPromisesSource = metrics.map((metric) => getMetricsData(metric, filtersSource, urlBase));
        const metricDataPromisesDest = metrics.map((metric) => getMetricsData(metric, filtersDest, urlBase));
        const promises = metricDataPromisesSource.concat(metricDataPromisesDest);

        Promise.all(promises).then((results) => {
          dispatch({ type: 'setIsClusterMetricsLoading', isClusterMetricsLoading: false });
          const clusterMetricsData = convertMetricsDataToSubTopology(results, selectedNode, clusterBy); // returns { node, edges }
          clusterMetricsData.callId = callId;
          dispatch({ type: 'setClusterMetricsData', clusterMetricsData });
        });
      }

      if (score !== undefined && timeInterval !== undefined && timeScales !== undefined) {
        const resolution = timeScales?.map((t) => t?.meta[2]).join(',');
        const durationUnit = timeScales[0]?.meta?.slice(0, 2);
        const params = {
          score: score / 100,
          timeInterval,
          duration,
          resolution,
          durationUnit: durationUnit[1],
          sort: sortAnomaly,
        };
        const anomalyDataPromisesSource = metrics.map((metric) => {
          const sourceParams = {
            ...params,
            filters: [
              ...filters,
              {
                type: 'property',
                key: activeSource,
                value: name,
                isExact: true,
              },
            ],
            metric,
          };
          return loadAnomalyData(sourceParams, urlBase);
        });
        const anomalyDataPromisesDest = metrics.map((metric) => {
          const destParams = {
            ...params,
            filters: [
              ...filters,
              {
                type: 'property',
                key: activeDest,
                value: name,
                isExact: true,
              },
            ],
            metric,
          };
          return loadAnomalyData(destParams, urlBase);
        });
        dispatch({ type: 'isSubAnomalyLoading', value: true });
        Promise.all(anomalyDataPromisesDest.concat(anomalyDataPromisesSource)).then((results) => {
          const activeDatasets = metrics.map((metric, i) => ({ metric, dataSet: results[i] || [] }));
          const subAnomalyData = convertAnomaliesToEdges(activeDatasets, source, destination, [...context, clusterBy]); // returns { node, edges }
          subAnomalyData.topologyAnomalyData.edgesCollection = manageLinksInCluster(
            subAnomalyData.topologyAnomalyData.edgesCollection,
            { ...contextFields, name },
            clusterBy
          );
          subAnomalyData.topologyAnomalyData.callId = callId;
          dispatch({
            type: 'bulk',
            actions: [
              { type: 'setSubAnomalyData', subAnomalyData },
              { type: 'isSubAnomalyLoading', value: false },
            ],
          });
        });
      }
    }
  }, [selectedNode, clusterBy, context, destination, dispatch, searchParams, source, urlBase]);

  useEffect(() => {
    /* Update the Key which identify the unique combination of data and Panel's filters */
    setDatasetKey(String(Math.random() * 10000));
    /* optimization: compare anomaly and metricsData just by timestamp + callId string */
    /* eslint-disable  react-hooks/exhaustive-deps */
  }, [
    metricsData?.callId + metricsData?.timeStamp,
    anomalyData?.topologyAnomalyData?.callId + anomalyData?.topologyAnomalyData?.timeStamp,
    source,
    destination,
    JSON.stringify(context),
  ]);

  const mixedMainData = useMemo(() => {
    return prepareMixedData(metricsData, anomalyData?.topologyAnomalyData);
  }, [currentDatasetKey]);

  const mixedSubData = useMemo(() => {
    return (
      !isClusterMetricsLoading &&
      !isSubAnomalyLoading &&
      prepareMixedData(clusterMetricsData, subTopologyAnomalyData, true)
    );
  }, [
    clusterMetricsData,
    isClusterMetricsLoading,
    isSubAnomalyLoading,
    subTopologyAnomalyData,
    currentDatasetKey,
    isClusterMetricsLoading && isSubAnomalyLoading,
  ]);

  if (!metricsData || metricsData?.length === 0) {
    return <AnodotLogoSvg />;
  }
  const { activeSource, activeDest, name, ...contextFields } = selectedNode || {};

  const modal = (
    <CustomModal
      key={selectedNode?.name || ''}
      title={selectedNode?.name || 'Node is not selected'}
      visible={showModal && !!selectedNode}
      onCancel={() => setShowModal(false)}
      destroyOnClose
      footer={null}
      width={500}
      mask={false}
      maskClosable={false}
      maskStyle={{ pointerEvents: 'none' }}
      zIndex={80}
    >
      <div>
        [<span className="green">{activeSource}</span> or <span className="green">{activeDest}</span>]:{' '}
        <b>{selectedNode?.name}</b>
      </div>
      {Object.keys(contextFields || {}).map((key) => (
        <div key={key}>
          <span className="green">{key}</span>: {selectedNode?.[key]}
        </div>
      ))}
      <div>
        Cluster by: <b>{clusterBy || 'Not selected'}</b>
      </div>
      <div style={{ height: 400 }}>
        {isClusterMetricsLoading ? (
          <Spinner />
        ) : (
          !!mixedSubData && (
            <AutoSizer>
              {({ width, height }) => (
                <div style={{ width, height, position: 'relative' }}>
                  <TopologyMap
                    key={`subChart-${selectedNode.name}-${mixedSubData.callId}`}
                    data={mixedSubData}
                    selectedEdge={selectedEdge} //{formatSelectedAnomalyData(selectedEdge, anomalyData)}
                    onClickEdge={onClickEdge}
                    onHoverEdge={setSelectedEdge}
                    onClickNode={setSelectedNode}
                    displayName={clusterBy}
                    isSubchart
                  />
                </div>
              )}
            </AutoSizer>
          )
        )}
      </div>
    </CustomModal>
  );

  return (
    <>
      {modal}
      {isMetricsLoading ? (
        <Spinner size="large" />
      ) : (
        !!mixedMainData && (
          <AutoSizer>
            {({ width, height }) => (
              <div style={{ width, height, position: 'relative' }}>
                <TopologyMap
                  key={`mainChart-${currentDatasetKey}`}
                  data={mixedMainData}
                  selectedEdge={selectedEdge} //{formatSelectedAnomalyData(selectedEdge, anomalyData)}
                  onClickEdge={onClickEdge}
                  onHoverEdge={setSelectedEdge}
                  // onClickNode={setSelectedNode}
                />
              </div>
            )}
          </AutoSizer>
        )
      )}
    </>
  );
};

export default ChartContainer;

function prepareMixedData(metricsData, topologyAnomalyData, isSubchart) {
  if (topologyAnomalyData && metricsData && topologyAnomalyData.callId === metricsData.callId) {
    let { links, ...data } = metricsData;
    data.links = mixEdges(metricsData.links, topologyAnomalyData, isSubchart);
    return data;
  } else {
    return metricsData;
  }
}
