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

const palette = [
  '#7cb5ec',
  '#90ed7d',
  '#f7a35c',
  '#8085e9',
  '#f15c80',
  '#e4d354',
  '#2b908f',
  '#f45b5b',
  '#91e8e1',
  '#4572A7',
  '#AA4643',
  '#89A54E',
  '#80699B',
  '#3D96AE',
  '#DB843D',
  '#92A8CD',
  '#A47D7C',
  '#B5CA92',
];

const ColorLabel = ({ color }) => (
  <div
    className={css`
      background-color: ${color};
      width: 5px;
      height: 5px;
      display: inline-block;
      margin: 0 5px 2px 0;
    `}
  />
);

const CompositeMetricsCharts: React.FC<VisOptions> = ({ serie, height, width, options }) => {
  const { isDark } = useTheme();
  const { meta, metricsComposite, showMultiline, timeInterval } = serie.anodotPayload;
  let metrics = metricsComposite;
  const lengthsCheck = metrics?.reduce((sum, { dataPoints }) => sum + dataPoints.length, 0);

  if (!metrics || metrics.length === 0 || lengthsCheck < 2) {
    return <div>No data for Metrics Composite charts</div>;
  }
  if (showMultiline) {
    metrics = metricsComposite.map((m, i) => {
      m.color = palette[i];
      return m;
    });
  }
  return (
    <div
      className={cx(
        { isDark },
        css`
          width: ${width}px;
          height: ${height}px;
          overflow: auto;
          display: flex;
          flex-direction: column;
        `
      )}
    >
      <h5>{meta.metricName}</h5>
      {meta.dimensions.map((d) => (
        <h6 key={d.key}>
          <b>{d.key}</b>: <i>{d.value}</i>
        </h6>
      ))}

      {!showMultiline &&
        metrics.map(
          ({ baseline = [], dataPoints = [], tags = [], properties = [], meta, origin }) =>
            dataPoints.length > 0 && (
              <div
                key={meta.metricName}
                className={css`
                  margin-top: 18px;
                `}
              >
                <SummaryHeader properties={properties} tags={tags} metricName={meta.metricName} origin={origin} />
                <HighchartsReact
                  highcharts={Highcharts}
                  options={getChartsOptions({
                    width,
                    areaData: multiplyX(baseline),
                    lineData: multiplyX(dataPoints),
                    chartClassNames: isDark ? 'isDark' : '',
                    isDark,
                    timeInterval,
                    timeFormat: options.timeFormat,
                  })}
                />
              </div>
            )
        )}
      {showMultiline && (
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            options={getMultipleOptions(metrics, {
              chartClassNames: isDark ? 'isDark' : '',
              isDark,
              isMulti: true,
              timeInterval,
              timeFormat: options.timeFormat,
            })}
          />
          <div>
            {metrics.map(({ tags = [], properties = [], meta, color }, i) => (
              <SummaryHeader
                prefix={<ColorLabel color={color} />}
                key={i}
                tags={tags}
                properties={properties}
                metricName={meta.metricName}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getMultipleOptions = (metrics, otherOptions = {}) => {
  const multilinesData = metrics.map(({ dataPoints, color }) => {
    const d = multiplyX(dataPoints);
    d.color = color;
    return d;
  });

  return getChartsOptions({ multilinesData, ...otherOptions });
};

export default CompositeMetricsCharts;
