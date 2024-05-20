import axios from 'axios'
import config from './config'
import axiosRetry from 'axios-retry'
import { handleError } from './helpers'

axiosRetry(axios, {
  retries: 2, // number of retries,
  retryDelay: (retryCount) => {
    return retryCount * 2000 // time interval between retries
  },
  retryCondition: (error) => {
    const message = handleError(error)

    // if retry condition is not specified, by default idempotent requests are retried
    return (
      // Service Unavailable
      error.response.status === 503 ||
      // Xung đột khi chỉnh cùng lúc
      message.indexOf('変更内容が、同時に編集しているユーザーの変更内容と競合しています') > -1
    )
  }
})

axios.defaults.baseURL = config.BASE_URL
axios.defaults.headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
}

export const fetchAuth = async ({
  ignore401 = false,
  token,
  url,
  params,
  headers,
  method,
  data,
  ...options
}) => {
  try {
    // console.time(url)
    const tokenKey = token || localStorage.getItem(config.LOCAL_ACCESS_TOKEN)

    const res = await axios({
      url,
      params,
      method,
      data,
      timeout: config.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenKey}`,
        ...headers
      },
      ...options
    })

    // console.timeEnd(url)
    return res.data
  } catch (error) {
    if (handleError(error) === '"401"') {
      if (ignore401) {
        throw error
      } else {
        window.location.reload()
      }
    } else {
      throw error
    }
  }
}

export const fetchAxios = async ({ url, headers, method, data, ...options }) => {
  // console.time(url)
  const res = await axios({
    url,
    method,
    data,
    timeout: config.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...options
  })

  // console.timeEnd(url)
  return res.data
}
