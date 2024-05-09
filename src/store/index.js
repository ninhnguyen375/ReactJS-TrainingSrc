import { configureStore } from '@reduxjs/toolkit'
import { MODULE_AUTH, authReducer } from './auth'
import { MODULE_COMMON, commonReducer } from './common'

export const store = configureStore({
  reducer: {
    [MODULE_AUTH]: authReducer,
    [MODULE_COMMON]: commonReducer
  }
})
