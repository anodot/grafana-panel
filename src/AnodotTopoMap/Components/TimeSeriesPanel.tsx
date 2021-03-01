// @ts-nocheck
import React, { useContext } from 'react';
import { Drawer } from '@grafana/ui';
import Highcharts from 'highcharts';
import highchartsMore from 'highcharts/highcharts-more';
import { ReducerContext } from '../reducer_context';
import { MetricsTSList } from './MetricsTimeSeries';
import { AnomalyTSList } from './AnomalyTimeSeries';

highchartsMore(Highcharts);

const TimeSeriesPanel = ({ isAnomaly, metricsParams }) => {
  const [{ isVisibleTimeSeries }, dispatch] = useContext(ReducerContext);

  return (
    !!isVisibleTimeSeries && (
      <Drawer
        scrollableContent
        inline
        title={`${isAnomaly ? 'Anomaly' : 'Metric'} TimeSeries`}
        placement="right"
        width={400}
        closable
        onClose={() => dispatch({ type: 'setIsVisibleTimeSeries', value: false })}
        visible={isVisibleTimeSeries}
        bodyStyle={{ padding: '5px' }}
        mask={false}
      >
        {isVisibleTimeSeries && isAnomaly ? <AnomalyTSList /> : <MetricsTSList metricsParams={metricsParams} />}
      </Drawer>
    )
  );
};

export default TimeSeriesPanel;
