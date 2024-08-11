import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { handleError } from './helpers'
import { getAuth, refreshTokenService } from './services'
import { useReadLocalStorage } from 'usehooks-ts'
import LoadingPage from './components/LoadingPage'
import { useDispatch } from 'react-redux'
import { commonActions } from '../store/common'
import config from './config'

const AuthContext = createContext(null)

const AuthProvider = () => {
  // localStorage
  const [profile, setProfile] = useState(useReadLocalStorage(config.LOCAL_PROFILE))
  const [loginType, setLoginType] = useState(useReadLocalStorage(config.LOCAL_LOGIN_TYPE))
  // state
  const [isGettingUser, setIsGettingUser] = useState(true)
  const [isRefreshPage, setIsRefreshPage] = useState(true)

  // hook
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = () => {
    localStorage.removeItem(config.LOCAL_PROFILE)
    localStorage.removeItem(config.LOCAL_AUTHENTICATED)
    localStorage.removeItem(config.LOCAL_ACCESS_TOKEN)
    localStorage.removeItem(config.LOCAL_REFRESH_TOKEN)
    localStorage.removeItem(config.LOCAL_LOGIN_TYPE)

    setProfile()
    setLoginType()

    navigate('/login', {
      state: {
        returnUrl: location.pathname
      }
    })

    window.location.reload()
  }

  const fetchUser = async () => {
    setIsGettingUser(true)

    try {
      const newProfile = await getAuth()

      setProfile(newProfile)

      localStorage.setItem(config.LOCAL_PROFILE, JSON.stringify(newProfile))
    } catch (error) {
      if (handleError(error) === '"401"') {
        try {
          await handleRefreshToken()
          await fetchUser()

          return
        } catch (error) {
          logout()
        }
      } else {
        logout()
      }
    }

    setIsGettingUser(false)
    setIsRefreshPage(false)
  }

  const getWorkLocationAndMapping = async () => {
    try {
      let workLocation = []

      dispatch(commonActions.setWorkLocationList(workLocation))
    } catch (error) {
      handleError(error)
    }
  }

  const handleRefreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem(config.LOCAL_REFRESH_TOKEN)
      const accessToken = localStorage.getItem(config.LOCAL_ACCESS_TOKEN)
      const newToken = await refreshTokenService(accessToken, refreshToken)

      localStorage.setItem(config.LOCAL_ACCESS_TOKEN, newToken.accessToken)
      localStorage.setItem(config.LOCAL_REFRESH_TOKEN, newToken.refreshToken)

      return newToken
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    fetchUser()
    getWorkLocationAndMapping()
  }, [])

  if (isGettingUser && isRefreshPage) {
    return <LoadingPage open={true} />
  }

  // if (
  //   profile &&
  //   !isRefreshPage &&
  //   location.pathname !== '/term' &&
  //   profile.account &&
  //   !profile.account.IsAcceptedTerm
  // ) {
  //   return <Navigate to="/term" state={{ returnUrl: location.pathname }} />
  // }

  if (profile && !isRefreshPage) {
    return (
      <AuthContext.Provider value={{ profile, logout, fetchUser, loginType }}>
        <Outlet />
      </AuthContext.Provider>
    )
  }

  if (!profile && !isGettingUser) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} />
  }
}

export function useAuth() {
  const { profile, logout, fetchUser, loginType } = useContext(AuthContext)
  return { profile, logout, fetchUser, loginType }
}

export default AuthProvider
