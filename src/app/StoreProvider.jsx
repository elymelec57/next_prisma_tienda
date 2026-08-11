'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { makeStore } from '../lib/store'
import TanstackProvider from '@/components/providers/TanstackProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Providers({ children }) {
  const storeRef = useRef(null)
  const persistorRef = useRef(null)

  if (!storeRef.current) {
    // Se crea el store y el persistor una sola vez
    storeRef.current = makeStore()
    persistorRef.current = persistStore(storeRef.current)
  }

  return (
    <Provider store={storeRef.current}>
      {/* PersistGate retrasa el renderizado hasta que el estado se rehidrate desde localStorage */}
      <PersistGate loading={null} persistor={persistorRef.current}>
        <TanstackProvider>
          {children}
          <ToastContainer />
        </TanstackProvider>
      </PersistGate>
    </Provider>
  )
}