// @ts-nocheck
import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions } from 'types';
import { css, cx, injectGlobal } from 'emotion';
import { stylesFactory, Spinner } from '@grafana/ui';
import CompositeMetricsCharts from './Components/CompositeMetricsCharts';
import AnomaliesCharts from './Components/AnomaliesCharts';
import AnomaliesList from './Components/AnomaliesList';
import Alerts from './Components/Alerts';
import AnodotTopoMap from './AnodotTopoMap/index.tsx';
import ErrorBoundary from './Components/ErrorBoundary.tsx';
import { useTheme } from '@grafana/ui';
import AnodotLogoSvg from './img/AnodotLogoComponent';

import './common.css';

interface Props extends PanelProps<PanelOptions> {}

export const Panel: React.FC<Props> = props => {
  const { width, height, data, options, replaceVariables } = props;
  const styles = getStyles();
  const theme = useTheme();
  const isLoading = props?.data.state === 'Loading';

  if (!theme.isDark) {
    /* Fix Grafana Tooltip's bug - it is indifferent to the light theme */
    /* eslint-disable  @typescript-eslint/no-unused-expressions */
    injectGlobal`
      .popper__background {
        background-color: white !important;
        color: #464C54 !important;
      }
      `;
  }

  const defaultVisProps = {
    className: styles.svg,
    width,
    height,
    options,
  };
  return (
    <div
      className={cx(
        { isDark: theme.isDark },
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          overflow: hidden;
        `
      )}
    >
      {isLoading ? (
        <div className={styles.anodotPlaceholderS}>
          <AnodotLogoSvg height={height * 0.7} />
          <p>
            <small>Waiting for Data</small>
          </p>
        </div>
      ) : (
        <ErrorBoundary>
          {data.series.map(serie => {
            switch (serie.serieName) {
              case 'metricsComposite':
                return <CompositeMetricsCharts serie={serie} {...defaultVisProps} />;
              case 'anomalies':
                const { anomaliesCharts, showCharts } = serie.anodotPayload;
                return showCharts && anomaliesCharts ? (
                  <AnomaliesCharts serie={serie} {...defaultVisProps} />
                ) : (
                  <AnomaliesList serie={serie} {...defaultVisProps} />
                );
              case 'alerts':
                return <Alerts serie={serie} {...defaultVisProps} />;
              case 'topology':
                return <AnodotTopoMap serie={serie} {...defaultVisProps} />;
              default:
                return <div>No data to display</div>;
            }
          })}
        </ErrorBoundary>
      )}
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
    spinner: css`
      text-align: center;
      padding-top: 25%;
    `,
    anodotPlaceholderS: css`
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      flex-direction: column;
    `,
  };
});
