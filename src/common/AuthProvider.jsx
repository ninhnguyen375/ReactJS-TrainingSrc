import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { batchPromises, handleError } from './helpers'
import { getAuth, getItemsService, refreshTokenService } from './services'
import { useReadLocalStorage } from 'usehooks-ts'
import LoadingPage from './components/LoadingPage'
import { useDispatch } from 'react-redux'
import lists from './lists'
import { commonActions } from '../store/common'
import config from './config'

const AuthContext = createContext(null)

const AuthProvider = () => {
  // localStorage
  const [profile, setProfile] = useState(useReadLocalStorage(config.LOCAL_PROFILE))
  // state
  const [isGettingUser, setIsGettingUser] = useState(true)
  const [isRefreshPage, setIsRefreshPage] = useState(true)

  // hook
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logout = () => {
    localStorage.clear(config.LOCAL_PROFILE)
    localStorage.clear(config.LOCAL_AUTHENTICATED)
    localStorage.clear(config.LOCAL_ACCESS_TOKEN)
    localStorage.clear(config.LOCAL_REFRESH_TOKEN)

    setProfile()

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
      let filterTest = config.IN_TEST ? '' : ` and Status eq 'Activated'`
      let data = await batchPromises([
        () =>
          getItemsService(lists.WorkLocation, {
            filter: `WorkLocationType eq 'Nhà máy' ${filterTest}`
          }),
        () => getItemsService(lists.WorkLocationSlotMapping)
      ])

      let workLocation = data[0].value
      let mapping = data[1].value

      workLocation = workLocation.map((wl) => ({
        ...wl,
        MappingID: mapping.find((map) => map.WorkLocationID === wl.Title)?.SlotID || wl.Title,
        WorkLocationID: wl.Title
      }))

      if (config.IN_TEST) {
        workLocation = [
          ...workLocation,
          {
            ID: 999,
            WorkLocationID: 'TEST',
            WorkingLocationName: 'TEST',
            WorkLocation_VIE: 'TEST',
            WorkLocation_EN: 'TEST',
            MappingID: 'TEST',
            Status: 'Activated'
          }
        ]
      }

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

  if (
    profile &&
    !isRefreshPage &&
    location.pathname !== '/term' &&
    profile.account &&
    !profile.account.IsAcceptedTerm
  ) {
    return <Navigate to="/term" state={{ returnUrl: location.pathname }} />
  }

  if (profile && !isRefreshPage) {
    return (
      <AuthContext.Provider value={{ profile, logout, fetchUser }}>
        <Outlet />
      </AuthContext.Provider>
    )
  }

  if (!profile && !isGettingUser) {
    return <Navigate to="/login" state={{ returnUrl: location.pathname }} />
  }
}

export function useAuth() {
  const { profile, logout, fetchUser } = useContext(AuthContext)
  return { profile, logout, fetchUser }
}

export default AuthProvider
