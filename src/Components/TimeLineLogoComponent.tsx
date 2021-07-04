import React from 'react';

const TimeLineLogoComponent = ({ isDark, width = 24, height = 24, active }) => {
  const fillColor = isDark ? '#3D4C59' : '#FFF';
  const strokeColor = isDark ? '#FFF' : '#3D4C59';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g fill="none" fillRule="evenodd">
        <g>
          <g transform="translate(-43 -63) translate(43 63)">
            <path d="M0 0H24V24H0z" />
            <rect width={width - 1} height={height - 1} x=".5" y=".5" fill={fillColor} stroke={strokeColor} rx="6" />
            <g fill={strokeColor} transform="translate(5 5)">
              <path
                fillRule="nonzero"
                stroke={strokeColor}
                strokeWidth=".5"
                d="M2.523 6.948h8.204v.504H2.523C1.358 7.452.509 8.486.509 9.763c0 1.216.916 2.323 1.977 2.348h9.71v.504H2.523C1.143 12.615 0 11.253 0 9.763c0-1.52 1.03-2.79 2.479-2.814h.044zm8.422-5.163c1.472 0 2.524 1.28 2.524 2.815 0 1.475-1.12 2.825-2.482 2.851h-.042v-.503c1.077 0 2.014-1.118 2.014-2.348 0-1.263-.83-2.287-1.974-2.31l-.04-.001H1.613v-.504h9.332z"
              />
              <ellipse cx="1.632" cy="2.037" rx="1.572" ry="1.556" />
              <ellipse cx="12.097" cy="12.643" rx="1.556" ry="1.539" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default TimeLineLogoComponent;
