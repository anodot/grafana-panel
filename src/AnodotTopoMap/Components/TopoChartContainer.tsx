// @ts-nocheck
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Spinner } from '@grafana/ui';
import { AutoSizer } from 'react-virtualized';
import TopologyMap from './TopoChart';
import { ReducerContext } from '../reducer_context';
import CustomModal from './CustomModal';
import { mixEdges } from '../helpers';
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
      searchParams = {},
      subTopologyAnomalyData,
      clusterMetricsData,
      isClusterMetricsLoading,
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
