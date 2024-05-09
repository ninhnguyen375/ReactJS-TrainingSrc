import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0
}

export const MODULE_AUTH = 'MODULE_AUTH'

export const authSlice = createSlice({
  name: MODULE_AUTH,
  initialState,
  reducers: {}
})

// Action creators are generated for each case reducer function
export const authActions = { ...authSlice.actions }

export const authReducer = authSlice.reducer
