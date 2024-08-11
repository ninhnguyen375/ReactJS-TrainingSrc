import { ConfigProvider } from 'antd'
import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './MainLayout'
import AuthProvider from './AuthProvider'
import UIProvider from './UIProvider'
import LoginPage from '../components/Auth/LoginPage'
import ChangePasswordPage from '../components/Auth/ChangePasswordPage'
import HomePage from '../components/Home/HomePage'
import { Provider } from 'react-redux'
import { store } from '../store'
import NotFoundPage from '../components/Auth/NotFoundPage'
import * as services from '../common/services'
import * as helpers from '../common/helpers'
import lists from './lists'
import _ from 'lodash'
import moment from 'moment'
import dayjs from 'dayjs'

import locale from 'antd/locale/vi_VN'
import 'dayjs/locale/vi'
import ImagesListPage from '../components/ImageAll/ImagesListPage'
import AccountPage from '../components/Account/AccountPage'
import DocumentStore from './components/DocumentStore/DocumentStore'
import UserPage from '../components/User/UserPage'
import { EventType, PublicClientApplication } from '@azure/msal-browser'
import { office365MsalConfig } from '../office365AuthConfig'
import { MsalProvider } from '@azure/msal-react'
import RoutePitstopPage from '../components/Gemba/RoutePitstopPage'
import GembaChecklist from '../components/Gemba/GembaChecklist'

import EHSReportDetailPage from '../components/EHSReportDetailPage/EHSReportDetailPage'
import EHSListPage from '../components/EHSListPage/EHSListPage'
dayjs.locale('vi')

/**
 * MSAL should be instantiated outside of the component tree to prevent it from being re-instantiated on re-renders.
 * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */

export const msalInstance = new PublicClientApplication(office365MsalConfig)

// Default to using the first account if no account is active on page load

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.

  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0])
}

// Listen for sign-in event and set active account

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account

    msalInstance.setActiveAccount(account)
  }
})

const Root = () => {
  useEffect(() => {
    window.services = services
    window.helpers = helpers
    window.lists = lists
    window._ = _
    window.moment = moment
  }, [])

  return (
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <UIProvider>
          {/* custom antd */}
          <ConfigProvider
            locale={locale}
            theme={{
              token: {
                colorPrimary: '#5ac2dc'
              }
            }}>
            {/* Router */}
            <BrowserRouter>
              <Routes>
                {/* public routes */}
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
                <Route path="/notfound" element={<NotFoundPage />} />

                {/* auth routes */}
                <Route element={<AuthProvider />}>
                  <Route path="/change-password" element={<ChangePasswordPage />} />

                  <Route
                    path="/"
                    element={
                      <MainLayout>
                        <HomePage />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/Images_List_Page"
                    element={
                      <MainLayout>
                        <ImagesListPage></ImagesListPage>
                      </MainLayout>
                    }></Route>
                  <Route
                    path="/account"
                    element={
                      <MainLayout>
                        <AccountPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/documentstore"
                    element={
                      <MainLayout>
                        <DocumentStore mode="View" list={lists.DocumentStore} storeID={79} />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/user"
                    element={
                      <MainLayout>
                        <UserPage />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/gemba/route-pitstop/follow"
                    element={
                      <MainLayout>
                        <RoutePitstopPage mode={'follow'} />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/gemba/route-pitstop/update-standard"
                    element={
                      <MainLayout>
                        <RoutePitstopPage mode={'update'} />
                      </MainLayout>
                    }
                  />

                  <Route
                    path="/gemba/route-pitstop/follow/:id"
                    element={
                      <MainLayout>
                        <GembaChecklist mode="new" />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/ehs"
                    element={
                      <MainLayout>
                        <EHSListPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/ehs-report/create/:ReportSubjectID"
                    element={
                      <MainLayout>
                        <EHSReportDetailPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/ehs-report/detail/:id"
                    element={
                      <MainLayout>
                        <EHSReportDetailPage />
                      </MainLayout>
                    }
                  />
                  <Route
                    path="/ehs"
                    element={
                      <MainLayout>
                        <EHSListPage />
                      </MainLayout>
                    }
                  />
                </Route>

                {/* notfound */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ConfigProvider>
        </UIProvider>
      </Provider>
    </MsalProvider>
  )
}

export default Root
