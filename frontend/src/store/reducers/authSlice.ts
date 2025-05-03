import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, User } from '../../types'
import { authApi } from '../api/authApi'

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isAuthenticated = true
        }
      )
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.user = action.payload.user
          state.token = action.payload.token
          state.isAuthenticated = true
        }
      )
      .addMatcher(
        authApi.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null
          state.token = null
          state.isAuthenticated = false
        }
      )
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer