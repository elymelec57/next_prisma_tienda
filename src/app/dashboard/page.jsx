'use client'

import { useAppSelector } from '@/lib/hooks'

export default function Store() {
  const Authname = useAppSelector((state) => state.auth.auth.name)
  return (
    <div className="bg-green-500 text-white p-10 mt-10">Biemvenido: {Authname}</div>
  )
}
