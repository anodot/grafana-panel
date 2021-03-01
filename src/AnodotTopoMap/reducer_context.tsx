// @ts-nocheck
import React, { useReducer, createContext } from 'react';

export const ReducerContext = createContext();

const initialState = {
  metricsData: null,
  metricsServerData: [],
  clusterMetricsData: null,
  investigateAnomalies: [],
  metricsTimeSeries: [],
  selectedEdge: null,
  selectedNode: null,
  searchParams: {},
  isTimeLineOpened: false,
  anomalyData: {
    topologyAnomalyData: null,
    legendAnomalyData: [],
  },
  isMetricsLoading: false,
  isClusterMetricsLoading: false,
  availableOptions: [],
  drawerContent: 'anomaly',
  isSubAnomalyLoading: false,
  isLoggedIn: true,
  source: null,
  destination: null,
  context: [],
  clusterBy: null,
  urlBase: '',
};

const reducer = (state, action) => {
  let tempState = { ...state };
  if (action.type === 'bulk') {
    /* so we can to modify several properties in one time */
    action.actions.forEach(action => {
      tempState = reducer(tempState, action);
    });
    return tempState;
  } else {
    switch (action.type) {
      case 'setMetricsData':
        action.metricsData.timestamp = Date.now();
        return {
          ...state,
          metricsData: action.metricsData,
        };
      case 'setMetricsServerData':
        action.data.timestamp = Date.now();
        return {
          ...state,
          metricsServerData: action.data,
        };
      case 'setClusterMetricsData':
        action.clusterMetricsData.timestamp = Date.now();
        return {
          ...state,
          clusterMetricsData: action.clusterMetricsData,
        };
      case 'setAnomalyData':
        action.anomalyData.topologyAnomalyData.timestamp = Date.now();
        return {
          ...state,
          anomalyData: action.anomalyData,
        };
      case 'setInvestigateAnomalies':
        return {
          ...state,
          investigateAnomalies: action.value,
        };
      case 'setOpenTimeLine':
        return {
          ...state,
          isTimeLineOpened: action.value,
        };
      case 'setMetricsTimeSeries':
        action.value.timestamp = Date.now();
        return {
          ...state,
          metricsTimeSeries: action.value,
        };
      case 'setSelectedEdge':
        return {
          ...state,
          selectedEdge: action.selectedEdge,
        };
      case 'setSelectedNode':
        return {
          ...state,
          selectedNode: action.selectedNode,
        };
      case 'setIsMetricsLoading':
        return {
          ...state,
          isMetricsLoading: action.isMetricsLoading,
        };
      case 'setIsClusterMetricsLoading':
        return {
          ...state,
          isClusterMetricsLoading: action.isClusterMetricsLoading,
        };
      case 'setIsVisibleTimeSeries':
        return {
          ...state,
          isVisibleTimeSeries: action.value,
        };
      case 'setIsAnomaliesLoading':
        return {
          ...state,
          isAnomaliesLoading: action.isAnomaliesLoading,
        };
      case 'setAvailableOptions':
        return {
          ...state,
          availableOptions: action.availableOptions,
        };
      case 'setSearchParams':
        return {
          ...state,
          searchParams: action.searchParams,
        };
      case 'setClusterBy':
        return {
          ...state,
          clusterBy: action.value,
        };
      case 'setDrawerContent':
        return {
          ...state,
          drawerContent: action.value,
        };
      case 'setSubAnomalyData':
        action.subAnomalyData.topologyAnomalyData.timestamp = Date.now();
        return {
          ...state,
          subTopologyAnomalyData: action.subAnomalyData.topologyAnomalyData,
        };
      case 'isSubAnomalyLoading':
        return {
          ...state,
          isSubAnomalyLoading: action.value,
        };
      case 'setEvents':
        return {
          ...state,
          events: action.events,
        };
      case 'setIsLoggedIn':
        return {
          ...state,
          isLoggedIn: action.value,
        };
      case 'setSource':
        return {
          ...state,
          source: action.value,
        };
      case 'setDestination':
        return {
          ...state,
          destination: action.value,
        };
      case 'setContext':
        return {
          ...state,
          context: action.value,
        };
      case 'setUrlBase':
        return {
          ...state,
          urlBase: action.urlBase,
        };
      default:
        console.error('UNKNOWN REDUCER TYPE', action);
        throw new Error();
    }
  }
};

export const ReducerContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <ReducerContext.Provider value={[state, dispatch]}>{props.children}</ReducerContext.Provider>;
};
