//@ts-nocheck
import React from 'react';

const AnodotLogoComponent = ({ height = 250 }) => (
  <svg
    height={height}
    style={{ margin: '50px auto', opacity: 0.3 }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 34 34"
  >
    <defs>
      <style>{'.cls-1{fill:#84aff1;}.cls-2{fill:#3865ab;}.cls-3{fill:url(#linear-gradient);}'}</style>
      <linearGradient id="linear-gradient" x1="42.95" y1="16.88" x2="81.9" y2="16.88" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f2cc0c" />
        <stop offset="1" stopColor="#ff9830" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#083893"
        d="M16.927 0c5.01 0 9.083 1.655 12.346 4.902 3.106 3.28 4.677 7.253 4.708 11.982v15.828a.783.783 0 01-.04.252.761.761 0 01-.95.487l-.022-.008-6.369-2.226c-2.683 1.78-5.9 2.71-9.673 2.71-4.883 0-8.956-1.654-12.218-4.903C1.573 25.77 0 21.753 0 17.028c0-4.793 1.573-8.812 4.71-12.126C7.97 1.655 12.043 0 16.926 0zm.128 7.74c-4.991 0-9.037 4.1-9.037 9.159 0 5.058 4.046 9.158 9.037 9.158 4.99 0 9.036-4.1 9.036-9.158 0-5.059-4.046-9.16-9.036-9.16z"
      ></path>
      <ellipse cx="17.055" cy="16.899" fill="#FF8F24" rx="5.855" ry="5.934"></ellipse>
    </g>
  </svg>
);

export default AnodotLogoComponent;
