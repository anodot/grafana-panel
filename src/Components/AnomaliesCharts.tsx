// @ts-nocheck
import React from 'react';
import { VisOptions } from 'types';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import { getChartsOptions, multiplyX } from '../getChartsOption';
import { useTheme } from '@grafana/ui';
import SummaryHeader from './ChartsSummaryHeader';

highchartsMore(Highcharts);

const AnomaliesCharts: React.FC<VisOptions> = ({ serie, height, width }) => {
  const { isDark } = useTheme();
  const { anomaliesCharts, timeInterval } = serie.anodotPayload;
  const anomalies = anomaliesCharts;

  if (!anomalies || anomalies.length === 0) {
    return <div>No data for Anomalies charts</div>;
  }
  return (
    <div style={{ height: height, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {anomalies.map(
        ({ baseline, dataPoints = [], tags = [], anomalies, otherAnomalyIntervals, properties, what }) =>
          dataPoints.length > 0 && (
            <div key={name} style={{ marginTop: 30 }}>
              <SummaryHeader properties={properties} tags={tags} metricName={what} />
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartsOptions({
                  areaData: multiplyX(baseline),
                  lineData: multiplyX(dataPoints),
                  anomaly: anomalies[0],
                  otherAnomalies: otherAnomalyIntervals,
                  chartClassNames: isDark ? 'isDark' : '',
                  timeInterval,
                  isDark,
                  width,
                })}
              />
            </div>
          )
      )}
    </div>
  );
};

export default AnomaliesCharts;
