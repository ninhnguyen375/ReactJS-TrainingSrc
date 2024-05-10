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
import TodoListPage from '../components/TodoList/TodoListPage'
dayjs.locale('vi')

const Root = () => {
  useEffect(() => {
    window.services = services
    window.helpers = helpers
    window.lists = lists
    window._ = _
    window.moment = moment
  }, [])

  return (
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
                  path="/todo-list"
                  element={
                    <MainLayout>
                      <TodoListPage />
                    </MainLayout>
                  }
                />

                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <HomePage />
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
  )
}

export default Root
