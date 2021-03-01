// @ts-nocheck
import React from 'react';
import { VisOptions } from 'types';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more';
import { getChartsOptions, multiplyX } from '../getChartsOption';
import { useTheme } from '@grafana/ui';
import { css, cx } from 'emotion';
import SummaryHeader from './ChartsSummaryHeader';
highchartsMore(Highcharts);

const CompositeMetricsCharts: React.FC<VisOptions> = ({ options, serie, height }) => {
  const theme = useTheme();
  const { meta, metricsComposite, showMultiline } = serie.anodotPayload;
  const metrics = metricsComposite;
  const isDark = theme.isDark;
  const lengthsCheck = metrics.reduce((sum, { dataPoints }) => sum + dataPoints.length, 0);

  if (!metrics || metrics.length === 0 || lengthsCheck < 2) {
    return <div>No data for Metrics Composite charts</div>;
  }
  return (
    <div
      className={cx(
        { isDark },
        css`
          height: ${height}px;
          overflow: auto;
          display: flex;
          flex-direction: column;
        `
      )}
    >
      <h5>{meta.metricName}</h5>
      {meta.dimensions.map(d => (
        <h6 key={d.key}>
          <b>{d.key}</b>: <i>{d.value}</i>
        </h6>
      ))}

      {!showMultiline &&
        metrics.map(
          ({ baseline = [], dataPoints = [], tags = [], properties = [], meta, origin }) =>
            dataPoints.length > 0 && (
              <div
                key={name}
                className={css`
                  margin-top: 18px;
                `}
              >
                <SummaryHeader properties={properties} tags={tags} metricName={meta.metricName} origin={origin} />
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getChartsOptions({
                    areaData: multiplyX(baseline),
                    lineData: multiplyX(dataPoints),
                    chartClassNames: isDark ? 'isDark' : '',
                    isDark,
                  })}
                />
              </div>
            )
        )}
      {showMultiline && (
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={getMultipleOptions(metrics, { chartClassNames: isDark ? 'isDark' : '', isDark, isMulti: true })}
          />
          <div>
            {metrics.map(({ tags = [], properties = [], meta }, i) => (
              <SummaryHeader key={i} tags={tags} properties={properties} metricName={meta.metricName} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getMultipleOptions = (metrics, otherOptions = {}) => {
  const multilinesData = metrics.map(({ dataPoints }) => multiplyX(dataPoints));

  return getChartsOptions({ multilinesData, ...otherOptions });
};

export default CompositeMetricsCharts;
