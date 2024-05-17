import React, { createContext, useContext, useState } from 'react'
import LoadingPage from './components/LoadingPage'
import { PropTypes } from 'prop-types'
import useNotification from 'antd/es/notification/useNotification'

const UIContext = createContext(null)

const UIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = useNotification()

  const messageConfig = {
    style: { whiteSpace: 'pre-line' }
  }

  const notiInfo = (mess, desc) => api.info({ message: mess, description: desc, ...messageConfig })
  const notiError = (mess, desc) =>
    api.error({ message: mess, duration: 6, description: desc, ...messageConfig })
  const notiWarning = (mess, desc) =>
    api.warning({
      message: mess,
      description: desc,
      ...messageConfig
    })
  const notiSuccess = (mess, desc) =>
    api.success({ message: mess, description: desc, ...messageConfig })

  return (
    <UIContext.Provider
      value={{ loading, setLoading, notiInfo, notiError, notiWarning, notiSuccess }}>
      {contextHolder}
      {children}
      <LoadingPage open={loading} />
    </UIContext.Provider>
  )
}

UIProvider.propTypes = {
  children: PropTypes.element.isRequired
}

export function useUI() {
  const { loading, setLoading, notiInfo, notiError, notiWarning, notiSuccess } =
    useContext(UIContext)

  return { loading, setLoading, notiInfo, notiError, notiWarning, notiSuccess }
}
export default UIProvider
