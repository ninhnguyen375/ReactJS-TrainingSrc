import { createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const initialState = {
  WorkLocationList: [
    {
      WorkLocationID: '',
      MappingID: '',
      Worklocation_EN: ''
    }
  ]
}

export const MODULE_COMMON = 'MODULE_COMMON'

export const commonSlice = createSlice({
  name: MODULE_COMMON,
  initialState,
  reducers: {
    setWorkLocationList: (state, action) => {
      state.WorkLocationList = action.payload
    },
    reset: () => {
      return initialState
    }
  }
})

export const useCommon = () => {
  const data = useSelector((state) => state[MODULE_COMMON])
  return {
    WorkLocationList: data.WorkLocationList
  }
}

// Action creators are generated for each case reducer function
export const commonActions = { ...commonSlice.actions }

export const commonReducer = commonSlice.reducer
