'use client'

import Link from "next/link";
import {
  increment,
  incrementByAmount
} from "../lib/features/auth/authSlice";
import { useAppSelector, useAppDispatch, useAppStore } from '../lib/hooks'
import { useState } from "react";

export default function Home() {

  const [numero, setNumero] = useState()

  const sumar = () => {
    dispatch(increment())
  }

  const sumar2 = () => {
    dispatch(incrementByAmount(numero))
  }

  const count = useAppSelector((state) => state.auth.value)
  const dispatch = useAppDispatch()

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
        <p>{count}</p>

        <button className="bg-red-500 text-white p-4" onClick={sumar}>aumentar</button>
        <input type="number" onChange={(e) => setNumero(e.target.value) }  />

        <button className="bg-red-500 text-white p-4" onClick={sumar2}>sumar cantidad</button>
        <Link href={'/login'}>login</Link>
      </div>
    </div>
  );
}
