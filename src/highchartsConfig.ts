// // @ts-nocheck
// const blackGradient = [
//   [0, 'rgb(32, 34, 38)'],
//   [1, 'rgb(32, 34, 38)'],
// ];
//
// const whiteGradient = [
//   [0, 'rgb(255, 255, 255)'],
//   [1, 'rgb(240, 240, 255)'],
// ];
//
// const ac = {
//   // Anodot Colors
//   darkBlue: '#1f2c9c',
//   blue: '#2671FF',
//   lightBlue: '#7798BF',
//   lightBlue2: '#A6C7ED',
//   lazur: '#aaeeee',
//   red: '#ff0066',
//   orange: '#f45b5b',
//   orange2: '#DF5353',
//   pink: '#eeaaee',
//   green: '#55BF3B',
//   lightGray: '#E0E0E3',
//   darkGray: '#515153',
//   gray: '#707073',
//   white: '#fff',
//   black: '#000',
// };
//
// export default isDark => ({
//   colors: [
//     ac.darkBlue,
//     ac.blue,
//     ac.orange,
//     ac.lightBlue,
//     ac.lazur,
//     ac.red,
//     ac.pink,
//     ac.green,
//     ac.orange2,
//     ac.lightBlue,
//     ac.lazur,
//   ],
//   chart: {
//     backgroundColor: {
//       // linearGradient: [0, 0, 500, 500],
//       stops: isDark ? blackGradient : whiteGradient,
//     },
//     style: {
//       fontFamily: "'Unica One', sans-serif",
//     },
//     plotBorderColor: ac.gray,
//   },
//   title: {
//     style: {
//       color: isDark ? ac.lightGray : ac.darkGray,
//       textTransform: 'uppercase',
//       fontSize: '20px',
//     },
//   },
//   subtitle: {
//     style: {
//       color: isDark ? ac.lightGray : ac.darkGray,
//       textTransform: 'uppercase',
//     },
//   },
//   xAxis: {
//     gridLineColor: ac.gray,
//     labels: {
//       style: {
//         color: isDark ? ac.lightGray : ac.darkGray,
//       },
//     },
//     lineColor: ac.gray,
//     minorGridLineColor: ac.darkGray,
//     tickColor: ac.gray,
//     title: {
//       style: {
//         color: '#A0A0A3',
//       },
//     },
//   },
//   yAxis: {
//     gridLineColor: ac.gray,
//     labels: {
//       style: {
//         color: isDark ? ac.lightGray : ac.darkGray,
//       },
//     },
//     lineColor: ac.gray,
//     minorGridLineColor: ac.darkGray,
//     tickColor: ac.gray,
//     tickWidth: 1,
//     title: {
//       style: {
//         color: '#A0A0A3',
//       },
//     },
//   },
//   tooltip: {
//     backgroundColor: isDark ? ac.black : ac.white,
//     style: {
//       color: !isDark ? ac.black : ac.white,
//     },
//   },
//   plotOptions: {
//     series: {
//       dataLabels: {
//         color: isDark ? '#F0F0F3' : ac.darkGray,
//         style: {
//           fontSize: '13px',
//         },
//       },
//       marker: {
//         lineColor: '#333',
//       },
//     },
//     boxplot: {
//       fillColor: !isDark ? '#F0F0F3' : ac.darkGray,
//     },
//     candlestick: {
//       lineColor: ac.white,
//     },
//     errorbar: {
//       color: ac.white,
//     },
//   },
//   legend: {
//     backgroundColor: isDark ? ac.black : ac.white,
//     itemStyle: {
//       color: !isDark ? ac.black : ac.white,
//     },
//     itemHoverStyle: {
//       color: !isDark ? ac.black : ac.white,
//     },
//     itemHiddenStyle: {
//       color: ac.gray,
//     },
//     title: {
//       style: {
//         color: !isDark ? ac.black : ac.white,
//       },
//     },
//   },
//   credits: {
//     style: {
//       color: '#666',
//     },
//   },
//   labels: {
//     style: {
//       color: ac.gray,
//     },
//   },
//   drilldown: {
//     activeAxisLabelStyle: {
//       color: '#F0F0F3',
//     },
//     activeDataLabelStyle: {
//       color: '#F0F0F3',
//     },
//   },
//   navigation: {
//     buttonOptions: {
//       symbolStroke: '#DDDDDD',
//       theme: {
//         fill: !isDark ? '#F0F0F3' : ac.darkGray,
//       },
//     },
//   },
//   // scroll charts
//   rangeSelector: {
//     buttonTheme: {
//       fill: ac.darkGray,
//       stroke: isDark ? ac.black : ac.white,
//       style: {
//         color: '#CCC',
//       },
//       states: {
//         hover: {
//           fill: ac.gray,
//           stroke: ac.black,
//           style: {
//             color: ac.white,
//           },
//         },
//         select: {
//           fill: '#000003',
//           stroke: ac.black,
//           style: {
//             color: ac.white,
//           },
//         },
//       },
//     },
//     inputBoxBorderColor: ac.darkGray,
//     inputStyle: {
//       backgroundColor: '#333',
//       color: 'silver',
//     },
//     labelStyle: {
//       color: 'silver',
//     },
//   },
//   navigator: {
//     handles: {
//       backgroundColor: '#666',
//       borderColor: '#AAA',
//     },
//     outlineColor: '#CCC',
//     maskFill: 'rgba(255,255,255,0.1)',
//     series: {
//       color: ac.lightBlue,
//       lineColor: ac.lightBlue2,
//     },
//     // xAxis: {
//     //   gridLineWidth: 1,
//     //   gridLineColor: ac.darkGray,
//     // },
//     // yAxis: {
//     //   gridLineWidth: 1,
//     //   gridLineColor: ac.darkGray,
//     // },
//   },
//   scrollbar: {
//     barBackgroundColor: '#808083',
//     barBorderColor: '#808083',
//     buttonArrowColor: '#CCC',
//     buttonBackgroundColor: ac.gray,
//     buttonBorderColor: ac.gray,
//     rifleColor: ac.white,
//     trackBackgroundColor: '#404043',
//     trackBorderColor: '#404043',
//   },
// });
