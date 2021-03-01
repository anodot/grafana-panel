// @ts-nocheck
// search/user-events/propandval

import React, { useContext, useState } from 'react';
import { makeRequest } from './api';
import { urlBase } from './constants';
import { ReducerContext } from './reducer_context';

export const useGetEventsPropAndVal = () => {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const retrieveEventsPropandval = async (bodyParams, onDone) => {
    setIsLoading(true);
    try {
      const url = `${urlBase}/search/user-events/propandval`;
      const payload = {
        expression: '',
        filter: [],
        size: 1000,
      };
      makeRequest(url, payload).then(({ properties: { properties }, propertyValues: { propertyValues } }) => {
        const propertiesDictionary = propertyValues.reduce((res, { key, value }) => {
          if (!res[key]) {
            res[key] = [];
          }
          res[key].push(value);
          return res;
        });
        setResponse({ properties, propertiesDictionary });
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return {
    eventsProperties: response.properties,
    eventsPropDict: response.propertiesDictionary,
    isEventsPropandvalLoading: isLoading,
    retrieveEventsPropandval,
  };
};

export const useGetMe = () => {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [storage, dispatch] = useContext(ReducerContext);

  const getMe = async () => {
    setIsLoading(true);
    try {
      const url = `${urlBase}/me`;
      makeRequest(url).then(({ properties: { properties }, propertyValues: { propertyValues } }) => {
        setResponse(response);
      });
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return {
    me: response,
    getMe,
  };
};
