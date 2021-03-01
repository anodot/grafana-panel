// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import uniq from 'lodash/uniq';
import { useTheme } from '@grafana/ui';

const NODE_RADIUS = 24;
const FONT_OFFSET = 10;
const LABEL_FONT_SIZE = 20;
const SELECTED_WIDTH = 5;
const SELECTED_OPACITY = 1;
const REGULAR_OPACITY = 0.3;
const CLUSTER_SIZE_FACTOR = 0.8;
const MARGIN_FACTOR = 1.5;
const LABELS_MAX_LENGTH = 13;
const NODE_HEIGHT = 40;
const NODE_MIN_WIDTH = 70;
const NODE_MAX_WIDTH = 170;
const NODE_TEXT_PADDING = 8;
const NODE_CORNER_RADIUS = 4;

const MAX_ZOOM_LEVEL = 5;
const MIN_ZOOM_LEVEL = 0.1;
const NODE_ZOOM_LEVEL = 0.1;
const LABEL_ZOOM_LEVEL = 0.1;
const LINKS_MAX_ZOOM_LEVEL = 2;
const TOOLTIP_WIDTH = 120;

const DEFAULT_POSITION = { x: 0, y: -100, k: 0.3 };
const DEFAULT_ZERO_POSITION = { x: -50, y: -50, k: 0.4 };

const lightColors = {
  clusterCenterFill: '#2671ff',
  clusterCenterStroke: '#1f2c9c',
  nodeFill: '#2671ff',
  nodeStroke: '#c9dbff',
  labelFill: '#fff',
  clusterStroke: '#2671FF',
  clusterFill: '#C9DBFF',
  tooltipFill: '#333',
  tooltipText: '#ddd',
  linksRange: [
    '#ff8f24',
    '#EB6F07',
    '#D10F37',
    '#ff8f24',
    '#EB6F07',
    '#D10F37',
    '#ff8f24',
    '#EB6F07',
    '#D10F37',
    '#ff8f24',
    '#EB6F07',
    '#D10F37',
  ],
  linkNeutralStroke: '#c9dbff',
  selectionPathStroke: '#2671ff',
};

const darkColors = {
  clusterCenterFill: '#2671ff',
  clusterCenterStroke: '#1f2c9c',
  nodeFill: '#2671ff',
  nodeStroke: '#c9dbff',
  labelFill: '#fff',
  clusterStroke: '#327a0d',
  clusterFill: '#123',
  tooltipFill: '#123',
  tooltipText: '#fff',
  linksRange: ['#ff8f24', '#EB6F07', '#D10F37'],
  linkNeutralStroke: '#c9dbff',
  selectionPathStroke: '#2671ff',
};

const colorsArr = [
  'red',
  'blue',
  'magenta',
  'orange',
  '#df56aa',
  '#00bbd4',
  '#3e4d5a',
  '#8947cd',
  '#5678fg',
  '#00ff99',
];

const nodeFillByGroup = (d, colorsTheme) => {
  switch (d.data.nodeType) {
    case 'app':
      return '#ddfbff'; // 221,251,255
    case 'workload':
      return '#d5e5f2'; // 213,229,242
    case 'service':
      return '#f0e2ff'; // 240,226,255
    default:
      return '#fff';
  }
};

const nodeStrokeByGroup = (d, colorsTheme) => {
  switch (d.data.nodeType) {
    case 'app':
      return '#00bbd4'; // 0,187,212
    case 'workload':
      return '#3e4d5a'; // 62,77,90
    case 'service':
      return '#8947cd'; // 137,71,205
    default:
      return '#000';
  }
};

const updateView = (container, { x, y, k }) => {
  container.attr('transform', `translate(${x}, ${y}) scale(${k})`);

  const nodes = container.selectAll('.node').filter(d => d.data.type === 'node');
  nodes.style('visibility', k < NODE_ZOOM_LEVEL ? 'hidden' : 'visible');
  nodes.select('text').style('visibility', k < LABEL_ZOOM_LEVEL ? 'hidden' : 'visible');

  container
    .selectAll('.edge-group')
    .style('visibility', k < NODE_ZOOM_LEVEL || k > LINKS_MAX_ZOOM_LEVEL ? 'hidden' : 'visible');
  // container.selectAll('.patch')
  //     .style('visibility', k < 1.2 ? 'hidden' : 'visible');
  // container.selectAll('.aggregated-link,.link-counter')
  //     .style('visibility', k < NODE_ZOOM_LEVEL ? 'visible' : 'hidden');
};

const createPack = (data, size) =>
  d3
    .pack() // TODO: move out of chart
    .size(size)
    .padding(800)(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  );

const getScreenDimentions = svg => ({
  width: parseInt(svg.attr('width'), 10),
  height: parseInt(svg.attr('height'), 10),
});

const getLinkRect = ({ fX, fY, tX, tY }) => ({
  top: Math.min(fY, tY),
  left: Math.min(fX, tX),
  right: Math.max(fX, tX),
  bottom: Math.max(fY, tY),
});

const getRect = ({ x, y, width, height }) => ({
  top: y,
  left: x,
  right: x + width,
  bottom: y + height,
});

const zoomOnRect = ({ svg, svgZoom, rect }) => {
  const { width, height } = getScreenDimentions(svg);
  const xAxisScale = width / (rect.right - rect.left);
  const yAxisScale = height / (rect.bottom - rect.top);
  const scale = Math.min(xAxisScale, yAxisScale) / MARGIN_FACTOR;

  const zoom = Math.min(scale, MAX_ZOOM_LEVEL);
  const xPos = width / 2 - ((rect.left + rect.right) / 2) * zoom;
  const yPos = height / 2 - ((rect.top + rect.bottom) / 2) * zoom;
  const transform = d3.zoomIdentity.translate(xPos, yPos).scale(zoom);

  if (svgZoom && svgZoom.transform && transform) {
    svg.call(svgZoom.transform, transform);
  }
};

const initSvg = (svg, isZoomed) => {
  svg.selectAll('*').remove();
  const container = svg.append('g').classed('container', true);

  container.append('g').classed('cluster-layer', true);
  container.append('g').classed('link-layer', true);
  container.append('g').classed('node-layer', true);

  if (isZoomed) {
    const onZoom = () => updateView(container, d3.event['transform']);

    const svgZoom = d3
      .zoom()
      .scaleExtent([MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL])
      .on('zoom', onZoom);

    const transform = d3.zoomIdentity.scale(0.4);
    svg.call(svgZoom);
    svg.call(svgZoom.transform, transform);

    return svgZoom;
  }
  return null;
};

const highlightNode = (d, svg, colorsTheme) => {
  // showTooltip(d ? d.data.nodeData : null, svg, colorsTheme);

  if (d === null) {
    const selectedNode = svg.selectAll('.node.selected');
    selectedNode.classed('selected', false);
    selectedNode
      .select('path')
      .transition()
      .duration(300)
      .style('fill', d => nodeFillByGroup(d, colorsTheme))
      .style('stroke', d => nodeStrokeByGroup(d, colorsTheme));

    // const selectedLinks = svg.selectAll('.link.selected');
    // selectedLinks.classed('selected', false);
    // selectedLinks.selectAll('path')
    //     .transition()
    //     .duration(300)
    //     .style('stroke-width', 1)
    //     .style('opacity', REGULAR_OPACITY);
    return;
  }

  if (d.data.type !== 'node') {
    return;
  }

  const node = svg.select(`[node-id='${d.data.nodeId}']`);
  node.classed('selected', true);
  node
    .select('path')
    .transition()
    .duration(300)
    .style('fill', d => nodeStrokeByGroup(d, colorsTheme))
    .style('stroke', d => nodeFillByGroup(d, colorsTheme));

  // let links = svg.selectAll(`[from-id='${d.data.nodeId}'],[to-id='${d.data.nodeId}']`);
  //
  // const selected = svg.selectAll('.selected-anomaly');
  // if (selected.node()) {
  //     const sData = selected.datum();
  //     links = links.filter(l => !(l.from === sData.from && l.to === sData.to));
  // }
  // links.classed('selected', true);
  // links.selectAll('.visual-path')
  //     .style('stroke-width', SELECTED_WIDTH)
  //     // .style('stroke', 'grey')
  //     .transition()
  //     .duration(300)
  //     .style('opacity', SELECTED_OPACITY);
};

const renderClusters = ({ svg, nodes, colorsTheme }) => {
  const clusterData = nodes.filter(node => node.data.type === 'cluster');
  const allClusters = svg
    .select('.cluster-layer')
    .selectAll('.clusters')
    .data(clusterData, function(d) {
      return d ? d.data.id : this['cluster-id'];
    });

  const entered = allClusters
    .enter()
    .append('g')
    .attr('cluster-id', d => d.data.id)
    .classed('cluster', true);

  entered
    .append('circle')
    .attr('r', d => d.r * CLUSTER_SIZE_FACTOR)
    .style('stroke-width', 1)
    .style('stroke', colorsTheme.clusterStroke)
    .style('fill', colorsTheme.clusterFill);
  // entered.append('text')
  //     .text(d => JSON.parse(d.data.id)?.name)
  //     .attr('transform', d => `translate(-70, -30)`)
  //     .classed('cluster-label', true);
  // ; // DATA LABEL;

  // entered.filter(d => d.data.type === 'node')
  //     .append('text')
  //     .text('DF') // DATA LABEL
  //     .attr('text-anchor', 'middle')
  //     .style('font-size', LABEL_FONT_SIZE)
  //     .attr('y', NODE_RADIUS + FONT_OFFSET);

  entered
    .merge(allClusters)
    .attr('transform', d => `translate(${d.x},${d.y})`)
    .on('mouseenter', d => showTooltip(d.data.nodeData, svg, colorsTheme, 'cluster-tooltip'))
    .on('mouseleave', d => showTooltip(null, svg, colorsTheme));

  allClusters.exit().remove();
};

function createNode(d, g, displayName = 'name', colorsTheme) {
  const textLabel = (d.data.nodeData[displayName] || d.data.nodeData.name)?.slice(0, LABELS_MAX_LENGTH) || '';
  const calculatedWidth = Math.min(Math.max(textLabel.length * 12, NODE_MIN_WIDTH), NODE_MAX_WIDTH);
  if (d.data.role === 'clusterCenter') {
    g.append('rect')
      .attr('y', -NODE_HEIGHT / 2)
      .attr('height', NODE_HEIGHT)
      .attr('rx', NODE_CORNER_RADIUS)
      .attr('ry', NODE_CORNER_RADIUS)
      .attr('x', -calculatedWidth / 2)
      .attr('width', calculatedWidth)
      .style('fill', colorsTheme.clusterCenterFill) //nodeFillByGrou', `${-size/2},${size}, 100,0 200,170`)
      .style('stroke', colorsTheme.clusterCenterStroke); //nodeStrokeByGroup(d));
  } else {
    g.append('rect')
      .attr('y', -NODE_HEIGHT / 2)
      .attr('height', NODE_HEIGHT)
      .attr('rx', NODE_CORNER_RADIUS)
      .attr('ry', NODE_CORNER_RADIUS)
      .attr('x', -calculatedWidth / 2)
      .attr('width', calculatedWidth)
      .style('fill', colorsTheme.nodeFill) //nodeFillByGroup(d))
      .style('stroke', colorsTheme.nodeStroke) //nodeStrokeByGroup(d));
      .style('stroke-width', 2);
  }
  const label = g
    .append('text')
    .attr('y', -13)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('fill', nodeStrokeByGroup(d))
    .style('cursor', 'default')
    .style('font-size', LABEL_FONT_SIZE);

  label
    .append('tspan')
    .text(textLabel)
    .attr('dy', LABEL_FONT_SIZE)
    .attr('x', 0)
    .style('font-weight', 'bold')
    .style('fill', colorsTheme.labelFill);

  // const box = label.node().getBBox();
  // const width = NODE_MIN_WIDTH; //Math.max(box.width + NODE_TEXT_PADDING * 2, NODE_MIN_WIDTH);
}

const renderNodes = ({ svg, nodes, onClickNode, displayName, colorsTheme }) => {
  const nodeData = nodes.filter(node => node.data.type === 'node');
  const allNodes = svg
    .select('.node-layer')
    .selectAll('.node')
    .data(nodeData, d => d.data.nodeId);

  const entered = allNodes
    .enter()
    .append('g')
    .attr('node-id', d => d.data.nodeId)
    .classed('node', true);
  entered
    .each(function(d) {
      createNode(d, d3.select(this), displayName, colorsTheme);
    })
    .on('mouseenter', d => highlightNode(d, svg, colorsTheme))
    .on('mouseleave', () => highlightNode(null, svg, colorsTheme))
    .on('click', function(d) {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      onClickNode?.(d.data.nodeData);
      svg.selectAll('.node.clicked').classed('clicked', false);
      d3.select(this).classed('clicked', true);
      // addPatchToNode(d, d3.select(this), svg, svgZoom);
    });

  entered.merge(allNodes).attr('transform', d => `translate(${d.x},${d.y})`);

  allNodes.exit().remove();
};

const addPatchToNode = function(d, g, svg, svgZoom) {
  const { width, height, x, y } = g.node().getBBox();
  // const { x, y } = d;
  //  g.append('text')
  //      .text(d => "ADDED");
  g.append('circle')
    .attr('r', 10)
    .classed('patch', true)
    .attr('cx', -25);
  g.append('circle')
    .attr('r', 10)
    .classed('patch', true)
    .attr('cx', 0);
  g.append('circle')
    .attr('r', 10)
    .classed('patch', true)
    .attr('cx', 25);
  g.append('circle')
    .attr('r', 100)
    .classed('patch', true)
    .attr('fill', 'none')
    .attr('stroke', 'darkgreen');

  // zoomOnRect({ svg, svgZoom, rect: getRect({ x, y, width, height })})
};

const linkPath = link => {
  const { fX, fY, tX, tY, fW, tW, endCorrection } = link;
  const dX = tX - fX;
  const dY = tY - fY;

  let cfX, cfY, ctX, ctY;
  const sX = ((NODE_HEIGHT / 2) * dX) / dY;
  if (Math.abs(sX) < fW / 2) {
    cfX = fX - Math.abs(sX) * (fX > tX ? 1 : -1);
    cfY = fY - (NODE_HEIGHT / 2) * (fY > tY ? 1 : -1);
  } else {
    const sY = ((fW / 2) * dY) / dX;
    cfX = fX - (fW / 2) * (fX > tX ? 1 : -1);
    cfY = fY - Math.abs(sY) * (fY > tY ? 1 : -1);
  }

  const DEFAULT_END_CORRECTION = 6;
  const distance = Math.hypot(dX, dY);
  const ec = endCorrection || DEFAULT_END_CORRECTION;
  const ecX = (ec * dX) / distance;
  const ecY = (ec * dY) / distance;
  if (Math.abs(sX) < tW / 2) {
    ctX = tX + Math.abs(sX) * (fX > tX ? 1 : -1) - ecX;
    ctY = tY + (NODE_HEIGHT / 2) * (fY > tY ? 1 : -1) - ecY;
  } else {
    const sY = ((tW / 2) * dY) / dX;
    ctX = tX + (tW / 2) * (fX > tX ? 1 : -1) - ecX;
    ctY = tY + Math.abs(sY) * (fY > tY ? 1 : -1) - ecY;
  }

  return `M ${cfX},${cfY} L ${ctX},${ctY}`;
};

const processLinks = ({ nodes, links, svg }) => {
  const aggregated = {};

  const getWidth = id => {
    const node = svg.select(`[node-id='${id}']`);
    return parseInt(node.select('rect').attr('width'), 10);
  };

  const mapLink = (link, index) => {
    const from = nodes.find(node => node.data.nodeId === link.endPoints[0]);
    const to = nodes.find(node => node.data.nodeId === link.endPoints[1]);
    if (!from || !to) {
      return {};
    }
    if (from.data.cluster !== to.data.cluster) {
      const key = `${from.data.cluster}-${to.data.cluster}`;
      if (aggregated.hasOwnProperty(key)) {
        aggregated[key].count++;
      } else {
        aggregated[key] = { from: from.parent, to: to.parent, count: 1 };
      }
    } else if (link['anomaly']) {
      from.parent.anomalyCounter = (from.parent.anomalyCounter || 0) + 1;
    } else {
      from.parent.regularCounter = (from.parent.regularCounter || 0) + 1;
    }

    const { x: tX, y: tY } = to;
    const { x: fX, y: fY } = from;
    const tW = getWidth(to.data.nodeId);
    const fW = getWidth(from.data.nodeId);
    // const id = `${from.data.id}->${to.data.id}`;
    return { ...link, fX, fY, tX, tY, fW, tW, index };
  };

  const sortLinks = (a, b) => {
    if (a['anomaly']) {
      return 1;
    }
    if (b['anomaly']) {
      return -1;
    }
    return 0;
  };

  links = links.map(mapLink).sort(sortLinks);
  return { links, aggregated };
};

const renderLinks = ({ svg, links, isSubchart, onClickEdge, colorsTheme }) => {
  // const times = links.reduce((res, cur) => (cur.latestAnomalyTime ? [...res, cur.latestAnomalyTime] : res), []).sort();
  // const colorScale = d3
  //   .scaleLinear()
  //   .domain([times[0], times[times.length - 1]])
  //   .range(['orange', 'red']);
  const layer = svg.select('.link-layer');
  const allLinks = layer.selectAll('.link').data(links, d => (isSubchart ? d.subConnectionId : d.connectionId));
  const entered = allLinks
    .enter()
    .append('g')
    .classed('edge-group', true)
    .on('click', d => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      onClickEdge(d);
    })
    .on('mouseenter', ({ anomalies }) =>
      showTooltip(anomalies ? { isAnomaly: true, anomalies } : null, svg, colorsTheme)
    )
    .on('mouseleave', () => showTooltip(null, svg, colorsTheme));

  entered
    .append('path')
    .classed('visual-path', true)
    .classed('neutral-edge', d => !d.hasAnomaly)
    .classed('anomaly-edge', d => d.hasAnomaly)
    .style('stroke', d => (d.latestAnomalyTime ? '#ff7777' : colorsTheme.linkNeutralStroke)) //colorScale(d.latestAnomalyTime)
    .style('stroke-width', 2)
    .attr('connection-id', d => d.connectionId)
    .attr('anomalies', d => d.anomalies?.map(a => a.anomalyId).join('-'))
    .attr('d', linkPath);

  entered
    /* Invisible but thick duplication of the edge for better interaction with the cursor */
    .append('path')
    .classed('selection-path', true)
    .style('stroke', colorsTheme.selectionPathStroke)
    .style('stroke-width', 20)
    .style('opacity', 0)
    .attr('d', linkPath);

  allLinks.exit().remove();
};

const ArrowMarker = ({ name, color, shift = 8 }) => (
  <marker
    id={`${name}-arrow-head`}
    viewBox="0 -8 36 36"
    refX={shift}
    refY="0"
    markerWidth="16"
    markerHeight="16"
    orient="auto"
  >
    <path d="M 8, 0 L 0,-8 L 16,0 L 0,8 Z" fill={color} stroke="none" />
  </marker>
);

const getTooltipPath = (width, height) =>
  `M 0,-5 L -10,-15 H -${width / 2 - 5} Q -${width / 2},-15 -${width / 2},-20
	V -${height - 5} Q -${width / 2},-${height} -${width / 2 - 5},-${height}
	H ${width / 2 - 5} Q ${width / 2},-${height} ${width / 2},-${height - 5}
	V -20 Q ${width / 2},-15 ${width / 2 - 5},-15 H 10 Z`;

const showTooltip = (data, svg, colorsTheme, className = '') => {
  let tooltip = svg.select('.node-tooltip');
  if (!data) {
    tooltip.style('visibility', 'hidden');
    tooltip.remove();
    return;
  }
  let info = {};
  if (data.isAnomaly) {
    const uniqAnomalies = uniq(data.anomalies.map(a => a.anomalyId)); // it can have duplication
    info[`${uniqAnomalies.length} anomalies`] = '';
    // data.anomalies.forEach(a => {
    //   info[a.anomalyId] = '';
    // });
    // info.role = 'anomaly';
  } else {
    info = { ...data };
    delete info.activeSource;
    delete info.activeDest;
  }

  const rowsAmount = Object.keys(info).length;

  if (!tooltip.node()) {
    const path = getTooltipPath(TOOLTIP_WIDTH, Math.max(40, 30 + rowsAmount * 20));
    tooltip = svg
      .append('g')
      .classed('node-tooltip', true)
      .classed(className, true);
    tooltip
      .append('path')
      .attr('d', path)
      .attr('fill', colorsTheme.tooltipFill);

    const text = tooltip
      .append('text')
      .classed('node-title', true)
      .attr('y', () => rowsAmount * -20 - 7)
      .attr('text-anchor', 'middle')
      .style('fill', colorsTheme.tooltipText);

    Object.keys(info).forEach((key, i) => {
      text
        .append('tspan')
        .text(`${key}${info[key] ? `: ${info[key]}` : ''}`)
        .attr('dy', () => (i === 0 ? 0 : LABEL_FONT_SIZE))
        .attr('x', 0);
    });
  }

  const { offsetX, offsetY } = d3.event;
  tooltip.style('visibility', 'visible').attr('transform', `translate (${offsetX},${offsetY})`);
};
const showNodeDivTooltip = (d, svg) => {
  let divTooltip = document.getElementById('tooltip-div');

  if (!d) {
    divTooltip.style.visibility = 'hidden';
    return;
  }

  const parsedTitle = JSON.parse(d.data.nodeId);
  let divTooltipContent = document.getElementById('tooltip-div-container');
  divTooltipContent.innerHTML = '';

  Object.keys(d.data.nodeData).forEach((key, i) => {
    divTooltipContent.innerHTML += `<div><span style="color: ${key === 'name' ? 'blue' : 'green'}">${key}</span>: ${
      d.data.nodeData[key]
    }</div>`;
  });

  const { offsetX, offsetY } = d3.event;
  divTooltip.style.visibility = 'visible';
  divTooltip.style.left = offsetX + 'px';
  divTooltip.style.top = offsetY + 'px';
};

const showAnomalyTooltip = (data, svg, colorsTheme) => {
  let tooltip = svg.select('.anomaly-tooltip');
  if (!data) {
    tooltip.style('visibility', 'hidden');
    return;
  }
  if (!tooltip.node()) {
    const pos = -140;
    const path = getTooltipPath(300, 150);
    tooltip = svg.append('g').classed('anomaly-tooltip', true);
    tooltip
      .append('path')
      .attr('d', path)
      .attr('fill', colorsTheme.tooltipFill);
    tooltip
      .append('text')
      .classed('anomaly-source', true)
      .attr('x', pos)
      .attr('y', -125)
      .style('fill', colorsTheme.tooltipText);
    tooltip
      .append('text')
      .classed('anomaly-target', true)
      .attr('x', pos)
      .attr('y', -100)
      .style('fill', colorsTheme.tooltipText);
    tooltip
      .append('text')
      .classed('anomaly-state', true)
      .attr('x', pos)
      .attr('y', -75)
      .style('fill', colorsTheme.tooltipText);
    tooltip
      .append('text')
      .classed('anomaly-score', true)
      .attr('x', pos)
      .attr('y', -50)
      .style('fill', colorsTheme.tooltipText);
    tooltip
      .append('text')
      .classed('anomaly-duration', true)
      .attr('x', pos)
      .attr('y', -25)
      .style('fill', colorsTheme.tooltipText);
  }

  const {
    data: { duplicates },
    from,
    to,
  } = data;
  tooltip.select('.anomaly-source').text(`Source: ${from}`);
  tooltip.select('.anomaly-target').text(`Target: ${to}`);
  tooltip.select('.anomaly-state').text(`State: ${duplicates[0].state}`);
  tooltip.select('.anomaly-score').text(`Score: ${duplicates[0].score}`);
  // tooltip.select('.anomaly-duration')
  // 	.text(`Duration: ${duplicates[0].duration}`);

  const { offsetX, offsetY } = d3.event;
  tooltip.style('visibility', 'visible').attr('transform', `translate (${offsetX},${offsetY})`);
};

const highlightAnomaly = (anomaly, ref, svgZoom) => {
  const svg = d3.select(ref);
  svg.selectAll('.highlighted-edge').classed('highlighted-edge', false);

  if (!anomaly) {
    return;
  }

  let path = svg.select(`[connection-id='${anomaly.connectionId}'`);
  path.classed('highlighted-edge', true);

  if (anomaly?.selectedFromPanel && anomaly?.anomalies) {
    /* Highlighting multiple edges and zooming in it */
    // let rectangles = []; // For the next zooming in
    anomaly.anomalies.forEach(({ affectedEdges }) => {
      /* Highlight all related anomalies and edges */
      affectedEdges.forEach(connectionId => {
        let path = svg.select(`[connection-id='${connectionId}'`);
        path.classed('highlighted-edge', true);
        // anomaly?.selectedFromPanel && rectangles.push(getLinkRect(path.datum()))
      });
    });
    // if (anomaly?.selectedFromPanel) {
    //     const rect = rectangles.reduce((res, cur) => ({
    //         top: res.top ? Math.min(cur.top, res.top) : cur.top,
    //         bottom: res.bottom ? Math.max(cur.bottom, res.bottom) : cur.bottom,
    //         left: res.left ? Math.min(cur.left, res.left) : cur.left,
    //         right: res.right ? Math.max(cur.right, res.right) : cur.right,
    //     }), {});
    //    //  zoomOnRect({ svg, svgZoom, rect });
    // }
  }

  // if (!anomaly?.hasAnomaly) return;
  // const target = svg.select(`[node-id='${anomaly.to}'`);
  // const source = svg.select(`[node-id='${anomaly.from}'`);
  // if (!source.node() || !target.node())
  // 	return;
  // const g = svg.select('.link-layer')
  // 	.append('g')
  // 	.datum(anomaly)
  // 	.classed('selected-anomaly', true)
  // 	.on('mousemove', () => showAnomalyTooltip(anomaly, svg))
  // 	.on('mouseleave', () => showAnomalyTooltip(null, svg));
  //
  // const coordinates = {
  // 	fX: source.datum().x,
  // 	fY: source.datum().y,
  // 	tX: target.datum().x,
  // 	tY: target.datum().y,
  // 	fW: parseInt(source.select('rect').attr('width')),
  // 	tW: parseInt(target.select('rect').attr('width')),
  // 	endCorrection: 12,
  // };
  //
  // g.append('path')
  // 	.attr('class', 'anomaly-path')
  // 	.style('fill', 'none')
  // 	.style('stroke-width', 3)
  // 	.style('stroke', '#ff8f24')
  // 	.style('stroke-dasharray', '20')
  // 	.attr('d', linkPath(coordinates))
  // 	.attr('marker-end', 'url(#orange-arrow-head)');
  //
  // const rect = getLinkRect(coordinates);
  // zoomOnRect({svg, svgZoom, rect});
};

const TopologyMap = ({
  data,
  selectedEdge,
  onHoverEdge,
  onClickEdge,
  onClickMap,
  onClickNode,
  width = '100%',
  height = '100%',
  isSubchart,
  displayName,
}) => {
  const svgRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [svgData, setSvgData] = useState({});
  const { isDark } = useTheme();

  useEffect(() => {
    if (!svgRef.current || initialized) {
      return;
    }
    const svgZoom = initSvg(d3.select(svgRef.current), true);
    setSvgData({ ...svgData, svgZoom });
    setInitialized(true);
  }, [svgRef, svgData, initialized]);

  const renderData = useCallback(
    data => {
      const { root, links } = data;
      const svg = d3.select(svgRef.current);
      const size = isSubchart ? [1200, 1200] : [2000, 2000];
      const pack = createPack(root, size);
      const nodes = pack.descendants().slice(1);
      const colorsTheme = !isDark ? lightColors : darkColors;
      renderNodes({ svg, nodes, onClickNode, displayName, svgZoom: svgData.svgZoom, colorsTheme });
      renderClusters({ svg, nodes, colorsTheme });

      const processedLinks = processLinks({ nodes, links, svg });
      renderLinks({ svg, ...processedLinks, onHoverEdge, onClickEdge, isSubchart, colorsTheme });
      updateView(svg.select('.container'), isSubchart ? DEFAULT_ZERO_POSITION : DEFAULT_POSITION);
    },
    [svgRef.current, isSubchart, displayName, svgData, isDark]
  );

  useEffect(() => {
    if (!initialized || !data) {
      return;
    }
    let links = data.links;
    renderData({ root: data.root, links });
  }, [data?.timestamp, initialized]);

  useEffect(() => {
    if (!data) {
      return;
    }

    highlightAnomaly(selectedEdge, svgRef.current, svgData.svgZoom);
  }, [selectedEdge, data?.timestamp]);

  const onSvgClick = useCallback(e => {
    onClickMap && onClickMap(e);
    highlightNode(null, d3.select(svgRef.current), isDark ? lightColors : darkColors);
    //onHoverEdge(null);
    onClickEdge(null);
    onClickNode?.(null);
  }, []);

  return !data ? (
    <h5>No data</h5>
  ) : (
    <svg ref={svgRef} style={{ width, height }} onClick={onSvgClick}>
      <defs>
        <ArrowMarker name="orange" color="#ff8f24" shift={8} />
        <ArrowMarker name="gray" color="gray" />
      </defs>
    </svg>
  );
};

export default TopologyMap;
