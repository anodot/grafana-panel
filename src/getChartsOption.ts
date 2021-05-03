// @ts-nocheck
import { formatDuration } from './helpers';
import format from 'date-fns/format';

const timezoneOffset = new Date().getTimezoneOffset();

export function getChartsOptions({
  areaData,
  lineData,
  multilinesData,
  anomaly,
  chartClassNames = '',
  otherAnomalys = [],
  isDark,
  isMulti,
  timeInterval,
  width,
  height = 200,
}) {
  const config = {
    title: {
      text: '',
    },
    chart: {
      height,
      width: width ? width - 16 : undefined,
      zoomType: 'xy',
    },
    xAxis: {
      min: timeInterval?.startDate ? timeInterval?.startDate * 1000 : undefined,
      max: timeInterval?.endDate ? timeInterval?.endDate * 1000 : undefined,
      showFirstLabel: true,
      type: 'datetime',
      tickPosition: 'inside',
      gridLineWidth: 1,
      tickLength: 0,
      crosshair: {
        dashStyle: 'Dash',
        className: 'crosshair-line',
      },
      labels: {
        style: {
          color: isDark ? '#c7d0d9' : '#8995a0',
        },
      },
      dateTimeLabelFormats: {
        hour: '%l:%m %P',
      },
    },
    yAxis: {
      title: '',
      gridLineWidth: 1,
      labels: {
        style: {
          color: isDark ? '#c7d0d9' : '#8995a0',
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      useHTML: true,
      crosshairs: true,
      formatter: function() {
        const {
          zone: { anomaly },
          series,
          color,
          y,
          x,
        } = this.point;
        if ((isMulti && series.name.includes('line')) || series.name === 'line') {
          const anomalyRows =
            anomaly &&
            `
                <div class="anomaly-rows">
                    <div><span>Score:</span> ${Math.round(anomaly[3] * 100)}</div>
                    <div><span>Value:</span> ${Math.round(anomaly[5])}</div>
                    <div><span>Duration:</span> ${formatDuration(anomaly[1] - anomaly[0])}</div>
                </div>
          `;
          const timeStr = format(new Date(x), 'eee, MMM d @ hh:mm a');

          return `
            <div class="anodot-chart-tooltip">
                <div class="timestamp">${timeStr}</div>
                <div class="bage-wrapper ${anomaly ? '' : 'metrics'}">
                    <div class="bage" style="background: ${color}"><b>${Math.round(y)}</b></div>
                </div>
                ${anomalyRows || ''}
            </div>
          `;
        }
        return false;
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      arearange: {
        accessibility: {
          enabled: false,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
        tooltip: {
          enabled: false,
        },
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
    series: [],
    time: {
      timezoneOffset: timezoneOffset,
    },
  };

  if (chartClassNames) {
    config.chart.className = chartClassNames;
  }

  if (areaData) {
    config.series.push({
      type: 'arearange',
      data: areaData,
      zIndex: 0,
      className: 'anodot-area',
      states: {
        hover: {
          enabled: false,
        },
      },
    });
  }
  if (lineData) {
    config.series.push({
      type: 'line',
      zIndex: 1,
      data: lineData,
      className: 'anodot-line',
      name: 'line',
      color: '#2671ff',
      marker: {
        symbol: 'circle',
        enabled: false,
      },
    });
  }

  if (multilinesData) {
    if (chartClassNames) {
      config.chart.className = chartClassNames;
    }
    multilinesData.forEach((d, i) => {
      config.series.push({
        type: 'line',
        color: d.color,
        zIndex: 1,
        data: d,
        className: 'anodot-line',
        name: `line-${i}`,
        marker: {
          enabled: false,
        },
      });
    });
  }

  if (anomaly) {
    const anomalyZone = [
      {
        value: anomaly[0] * 1000,
        className: 'neutral-line',
      },
      {
        value: anomaly[1] * 1000,
        className: 'anomaly-part',
        color: '#ff8f24',
        anomaly,
      },
      { className: 'neutral-line' },
    ];
    const otherZones = [];

    otherAnomalys.forEach(a => {
      otherZones.push({
        value: a.startDate * 1000,
        className: 'neutral-line',
      });
      otherZones.push({
        value: a.endDate * 1000,
        className: 'other-anomaly',
        anomaly: [a.startDate, a.endDate, null, a.score, null, a.peakValue],
      });
    });

    config.plotOptions.series = {
      zoneAxis: 'x',
      zones: otherZones.concat(anomalyZone),
    };
  }
  return config;
}

export const multiplyX = a =>
  a.map(b => {
    const [x, ...rest] = b;
    return [x * 1000, ...rest];
  });
