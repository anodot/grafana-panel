// @ts-nocheck
import React, {useMemo} from 'react';
import { VisOptions } from 'types';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import { getChartsOptions, multiplyX } from '../getChartsOption';
import { useTheme } from '@grafana/ui';
import SummaryHeader from './ChartsSummaryHeader';

highchartsMore(Highcharts);

const AnomaliesCharts: React.FC<VisOptions> = ({ serie, height, width, options: { timeFormat, tooltipFormat } }) => {
  const { isDark } = useTheme();
  const { anomaliesCharts: anomalies, timeInterval } = serie.anodotPayload;

  if (!anomalies || anomalies.length === 0) {
    return <div>No data for Anomalies charts</div>;
  }

  return (
    <div style={{ height: height, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {anomalies.map(
        ({ baseline, dataPoints = [], tags = [], anomalies, otherAnomalyIntervals, properties, what, metricsCount }, i) => {
          const options = useMemo(() => getChartsOptions({
            areaData: multiplyX(baseline),
            lineData: multiplyX(dataPoints),
            anomaly: anomalies[0],
            otherAnomalies: otherAnomalyIntervals,
            chartClassNames: isDark ? 'isDark' : '',
            timeInterval,
            isDark,
            width,
            timeFormat,
            tooltipFormat,
            dimensions: { properties, what}
          }), [baseline, dataPoints, anomalies,otherAnomalyIntervals, isDark, timeInterval, width, timeFormat, tooltipFormat, properties, what])
          return dataPoints.length > 0 && (
            <div key={i} style={{ marginTop: 30 }}>
              <SummaryHeader
                properties={properties}
                tags={tags}
                metricName={what}
                prefix={
                  <span>
                    1/{metricsCount.total} [Of {metricsCount.anomalyTotal}]{' '}
                  </span>
                }
              />
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
              />
            </div>
          )
        }
      )}
    </div>
  );
};

export default AnomaliesCharts;
