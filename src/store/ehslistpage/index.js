import { createSlice } from '@reduxjs/toolkit'

const initState = {}

export const MODULE_EHS_LIST_PAGE = 'EHS_MODULE/EHS_LIST_PAGE'

export const ehsListPageSlice = createSlice({
  name: MODULE_EHS_LIST_PAGE,
  initialState: initState,
  reducers: {
    reset: () => {
      return initState
    }
  }
})

export const ehsListPageReducer = ehsListPageSlice.reducer
