// @ts-nocheck
import React from 'react';
import { css, cx } from 'emotion';
import { useTheme } from '@grafana/ui';

const modalBoxStyles = css`
  position: absolute;
  top: 11px;
  border-radius: 3px;
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14),
    0px 1px 8px 0px rgba(0, 0, 0, 0.12);
  padding: 30px 20px;
`;

const closeIconStyles = css`
  position: absolute;
  z-index: 900;
  top: 0px;
  right: 5px;
  cursor: pointer;
  opacity: 0.5;

  &:before {
    content: '+';
    display: inline-block;
    transform: rotate(45deg);
    font-size: 30px;
  }
`;

const CustomModal = ({ visible, children, width = 300, height = 300, zIndex, onCancel }) => {
  const theme = useTheme();
  return !visible ? null : (
    <div
      className={cx(
        'anodot-modal',
        modalBoxStyles,
        css`
          width: ${width}px;
          min-height: ${height}px;
          left: 340px; //calc(50% - ${width / 2}px);
          z-index: ${zIndex || 9999};
          background: ${theme.isDark ? '#202226' : '#fff'};
        `
      )}
    >
      <div className={closeIconStyles} onClick={onCancel} />
      {children}
    </div>
  );
};

export default CustomModal;
