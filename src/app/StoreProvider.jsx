'use client'
import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
// import {
//   saludo
// } from "../lib/features/auth/authSlice";

export default function Providers({ children }) {
  const storeRef = useRef(null)
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    // storeRef.current.dispatch(saludo(saludoo))
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}