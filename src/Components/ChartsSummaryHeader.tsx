//ts-nocheck
import React from 'react';
import { css } from 'emotion';
import { Tooltip, useTheme } from '@grafana/ui';

const lightMagenta = '#efceff';
const darkMagenta = '#6826ab';
const lightGreen = '#d3ffea';
const darkGreen = '#1a896a';

const chartInfoS = css`
  padding-left: 40px;
  font-size: 14px;
  line-height: 14px
  color: #8995a0;
  font-weight: 500;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  & > span { cursor: pointer;}

  &.isDark {
    color: #8995a0;
  }
`;

const keyS = css`
  max-width: 114px;
  min-width: 56px;
  color: #8995a0;
`;

// TODO: is Grafana Tooltip able to display the light theme? It's always black.
const SummaryHeader = ({ properties, tags, metricName, origin }) => {
  const theme = useTheme();
  const propertiesTable = (
    <div>
      <span
        className={css`
          color: ${theme.isDark ? lightMagenta : darkMagenta};
          font-weight: bold;
        `}
      >
        {metricName}
      </span>
      <table>
        <tbody>
          {properties.map(({ key, value }) => (
            <tr key={key}>
              <td className={keyS}>{key}</td>
              <td
                className={css`
                  max-width: 348px;
                  min-width: 56px;
                `}
              >
                <span
                  className={css`
                    color: ${theme.isDark ? lightGreen : darkGreen};
                    padding-left: 8px;
                  `}
                >
                  {value}
                </span>
              </td>
            </tr>
          ))}
          {tags.map(({ key, value }) => (
            <tr key={key}>
              <td className={keyS}>{key}</td>
              <td
                className={css`
                  max-width: 348px;
                  min-width: 56px;
                `}
              >
                <span
                  className={css`
                    color: ${theme.isDark ? lightGreen : darkGreen};
                    padding-left: 8px;
                  `}
                >
                  {value}
                </span>
              </td>
            </tr>
          ))}
          {origin?.type}
        </tbody>
      </table>
    </div>
  );
  return (
    <div className={chartInfoS}>
      <Tooltip content={propertiesTable} theme="info">
        <span
          className={css`
            color: ${theme.isDark ? lightMagenta : darkMagenta};
            font-weight: bold;
          `}
        >
          {metricName}
        </span>
      </Tooltip>{' '}
      for{' '}
      {properties.map(({ key, value }, i) => (
        <Tooltip key={key} content={key} theme="info">
          <span
            className={css`
              color: ${theme.isDark ? lightGreen : darkGreen};
            `}
          >
            {i > 0 && ', '}
            {value}
          </span>
        </Tooltip>
      ))}
      {tags.map(({ key, value }) => (
        <Tooltip key={key} content={key} theme="info">
          <span>, #{value}</span>
        </Tooltip>
      ))}
      {origin?.type && (
        <Tooltip content={origin.title} theme="info">
          <span>, @{origin.type.toLowerCase()}</span>
        </Tooltip>
      )}
    </div>
  );
};

export default SummaryHeader;
