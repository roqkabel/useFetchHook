import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

/**
 * 
 * @param {string} apiUrl - The request URL.
 * @param  callback - A callback that is called on a successful response.
 * @returns {object}  { data , error , setUrl, setData }
 */


/* 
 ======= EXAMPLE USAGE ====
 
    const{
        data, 
        error,
        setUrl
        } = useFetch('https://murmuring-peak-71788.herokuapp.com/api/products', 
                (res) => console.log('CALLBACK_FUNC', res))
*/


export default function useFetch(apiUrl, callback) {

    const [url, setUrl] = useState(apiUrl)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const controller = new AbortController();


    useEffect(() => {
        setUrl(apiUrl)
      return () => {
        setUrl('')
      }
    }, [apiUrl])
    

 
    


    useEffect(() => {
        if(!!url){
            handleFetchRequest()
        }
        return () => {
            // cancel api request when unmounted.
            controller.abort()

            // set defaul state when unmounted
            setData(null)
            setError(null)
        }
    }, [url])

    // peform api request.
    const handleFetchRequest = () => {
        axios.get(url, {
            signal: controller.signal
        }).then(res => {
            setData(res.data)
            callback(res)
        }).catch(err => {
            setError(err)
        })
    }

    useCallback(handleFetchRequest, [url])



    return {
        data,
        error,
        setUrl,
        setData
    }
}


