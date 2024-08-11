import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  office365AuthService,
  requestResetPasswordService,
  verifyResetService
} from '../../common/services'
import { handleError } from '../../common/helpers'

const initialState = {
  isShowForgotPW: false,
  isUserExsist: false,
  isResetPWSuccess: false,
  resetPWMessage: null,
  isResettingPW: false,
  isOTPValid: false,
  isVerifyResetSuccess: false,
  verifyResetPWMessage: null,
  isVerifyingResetPW: false,
  countdown: 60,
  canResendOTP: false,
  offfice365AuthResp: null
}

export const requestResetPassword = createAsyncThunk(
  'MODULE_AUTH/requestresetpw',
  async (email) => {
    try {
      const response = await requestResetPasswordService(email)
      return response
    } catch (error) {
      const response = handleError(error)
      return response
    }
  }
)

export const verifyResetPassword = createAsyncThunk('MODULE_AUTH/verifyresetpw', async (data) => {
  try {
    const response = await verifyResetService(data.email, data.verifyCode)
    return response
  } catch (error) {
    const errorResponse = handleError(error)
    return errorResponse
  }
})

export const authWithOffice365 = createAsyncThunk('MODULE_AUTH/office365Auth', async (token) => {
  try {
    const response = await office365AuthService(token)
    return { isSuccess: true, response }
  } catch (err) {
    const errorResponse = handleError(err)
    return { isSuccess: false, errorResponse }
  }
})

export const MODULE_AUTH = 'MODULE_AUTH'

export const authSlice = createSlice({
  name: MODULE_AUTH,
  initialState,
  reducers: {
    openForgotPWModal: (state) => {
      state.isShowForgotPW = true
    },
    closeForgotPWModal: (state) => {
      if (!state.isResettingPW && !state.isVerifyingResetPW) {
        state.isShowForgotPW = false

        state.isResetPWSuccess = false
        state.resetPWMessage = null
        state.isUserExsist = false

        state.isOTPValid = false
        state.isVerifyResetSuccess = false
        state.verifyResetPWMessage = null
        state.isVerifyingResetPW = false
      }
    },
    setCountDown: (state, action) => {
      state.countdown = action.payload
    },
    decreaseCountDown: (state, action) => {
      if (state.countdown === 0) {
        clearInterval(action.payload.interval)
        state.canResendOTP = true
      } else {
        state.countdown = state.countdown - 1
      }
    },
    setCanResendOTP: (state, action) => {
      state.canResendOTP = action.payload
    },
    resetRequestForgotPWState: (state) => {
      state.resetPWMessage = null
      state.isUserExsist = false
      state.isResetPWSuccess = false
    },
    resetVerifyForgotPWState: (state) => {
      state.isOTPValid = false
      state.verifyResetPWMessage = null
      state.isVerifyResetSuccess = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestResetPassword.pending, (state) => {
        state.isResettingPW = true
      })
      .addCase(requestResetPassword.fulfilled, (state, action) => {
        state.isResetPWSuccess = action.payload.isSuccess
        state.resetPWMessage = action.payload.message
        state.isUserExsist = action.payload.isUserExsist
        state.isResettingPW = false
        state.canResendOTP = false
      })
      .addCase(requestResetPassword.rejected, (state) => {
        state.isResettingPW = false
      })
      .addCase(verifyResetPassword.pending, (state) => {
        state.isVerifyingResetPW = true
      })
      .addCase(verifyResetPassword.fulfilled, (state, action) => {
        state.isOTPValid = action.payload.isOTPValid
        state.isVerifyResetSuccess = action.payload.isSuccess
        state.verifyResetPWMessage = action.payload.message
        state.isVerifyingResetPW = false
      })
      .addCase(verifyResetPassword.rejected, (state) => {
        state.isVerifyingResetPW = false
      })
      .addCase(authWithOffice365.fulfilled, (state, action) => {
        state.offfice365AuthResp = action.payload
      })
  }
})

// Action creators are generated for each case reducer function
export const authActions = { ...authSlice.actions }

export const authReducer = authSlice.reducer
