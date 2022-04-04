import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

/**
 *
 * @param {string} apiUrl - The request URL.
 * @param  callback - A callback that is called on a successful response.
 * @returns {object}  { response , error , setUrl, setData }
 */


export default function useFetch(URL, callback) {
  const [url, setUrl] = useState(URL);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const controller = new AbortController();

  useEffect(() => {
    // do nothing when url is  NULL.
    if (!url) {
      return false;
    }

    // Perfrom api request.
    setIsFetching(true);
    axios
      .get(url, {
        signal: controller.signal,
      })
      .then((res) => {
        setResponse(res.data);
        callback(res.data);
        setIsFetching(false);
      })
      .catch((err) => {
        setIsFetching(false);
        setError(err);
      });

    return () => {

      // Using Abort signal to cancel request and stop fetching data when unmounted.
      controller.abort();

      // set default state when unmounted
      setResponse(null);
      setError(null);
      setIsFetching(false);
    };
  }, [url]);

  const setData = useCallback(
    (data) => {
      // Check if theres is a request processing, before setting data.
      if (!isFetching) {
        setResponse(data);
      }
    },
    [isFetching]
  );

  return {
    response,
    error,
    setUrl,
    setData,
  };
}



