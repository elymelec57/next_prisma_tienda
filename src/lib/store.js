import { authSlice } from './features/auth/authSlice'
import { orderSlice } from './features/cart/orderSlice'
import { waiterSlice } from './features/waiter/waiterSlice'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

// SSR-safe storage: en el servidor usa un noop storage
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
})

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

const persistConfig = {
  key: 'root',
  storage,
  // Puedes limitar qué slices persistir con whitelist:
  // whitelist: ['auth', 'order', 'waiter'],
}

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  order: orderSlice.reducer,
  waiter: waiterSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignorar acciones internas de redux-persist (no son serializables)
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  return store
}