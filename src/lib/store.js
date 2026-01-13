import { authSlice } from './features/auth/authSlice'
import { orderSlice } from './features/cart/orderSlice'
import { waiterSlice } from './features/waiter/waiterSlice'
import { configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      order: orderSlice.reducer,
      waiter: waiterSlice.reducer
    },
  })
}