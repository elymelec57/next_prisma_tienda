import { authSlice } from './features/auth/authSlice'
import { orderSlice } from './features/cart/orderSlice'
import { configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      order: orderSlice.reducer
    },
  })
}